import { Request, Response } from 'express';
import ReservationModel from '../reservation/reservation.model';
import Hotel, { CreateHotelDTO } from './hotel.model';

export default class HotelController {
  create(req: Request<any, any, CreateHotelDTO>, res: Response) {
    if (!req.user) {
      res.status(500).json({ message: 'No user set' });
      return;
    }
    try {
      const hotel = new Hotel({
        name: req.body.name,
        country: req.body.country,
        city: req.body.city,
        stars: req.body.stars,
        owner: req.user.id,
      });
      hotel.save();
      hotel.populate('owner').execPopulate();
      res.status(201).json(hotel);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async getView(req: Request, res: Response) {
    const hotels = await Hotel.find().exec();

    res.render("hotel", {hotels});
  }

  async get(req: Request, res: Response) {
    const hotels = await Hotel.find().exec();

    if (hotels.length === 0) {
      res.status(204).send();
    } else {
      res.status(200).send(hotels);
    }
  }

  async delete(req: Request, res: Response) {
    // get id
    const hotelId = req.params.id;
    if (!hotelId) {
      res.status(400).json({ message: 'No hotel id received' });
      return;
    }

    if (!req.user) {
      res.status(500).json({ message: 'No user set' });
      return;
    }

    // auth
    const hotel = await Hotel.findById(hotelId).populate('owner');
    if (!hotel) {
      res.status(404).json({ message: `No hotel found with id: ${hotelId}` });
      return;
    }
    if (hotel.owner._id && !hotel.owner._id.equals(req.user.id)) {
      res.status(403).json({ message: `No permission to delete hotel with id ${hotelId}` });
      return;
    }

    // remove hotel
    await hotel.remove();
    res.status(200).json(hotel);
  }

  async availableRooms(req: Request, res: Response) {
    if (!req.query.date) {
      res.status(400).json({ message: 'Missing date query parameter' });
      return;
    }
    if (!req.params.id) {
      res.status(400).json({ message: 'No hotel id received' });
      return;
    }
    const hotelId = req.params.id;
    const date = new Date(req.query.date as string);

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      res.status(404).json({ message: `No hotel found with id: ${hotelId}` });
      return;
    }

    const existingReservations = await ReservationModel.find({ hotel: hotelId, date: date }).exec();

    const availableRooms = hotel.rooms.filter((room) => !existingReservations.some((er) => er.room.equals(room.id)));

    res.status(200).send(availableRooms);
  }
}
