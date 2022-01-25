import { Request, Response } from 'express';
import Hotel from '../hotel/hotel.model';
import RoomModel, { AddRoomDTO } from './room.model';

export default class RoomController {
  async get(req: Request, res: Response) {
    const hotelId = req.params.hotelId;

    const hotel = await Hotel.findById(hotelId).exec();

    if (!hotel) {
      res.status(404).send();
      return;
    }

    res.status(200).json(hotel.rooms);
  }

  async add(req: Request<any, any, AddRoomDTO>, res: Response) {
    const hotelId = req.params.hotelId;

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
      res.status(403).json({ message: `No permission to add rooms to hotel with id ${hotelId}` });
      return;
    }

    // TODO validation of room properties

    // add room
    const dto = req.body;
    const roomModel = new RoomModel(dto);
    const room = await roomModel.save();
    if (!room) {
      res.status(500).json({ message: 'Failed to add room to hotel' });
      return;
    }
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $addToSet: { rooms: room },
      });
      res.status(201).json(room);
    } catch (err) {
      await RoomModel.findByIdAndDelete(room._id);
      res.status(500).json(`Room failed to be added to hotel`);
    }
  }
}
