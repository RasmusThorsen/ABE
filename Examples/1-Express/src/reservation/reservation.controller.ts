import { Request, Response } from 'express';
import ReservationModel, { CreateReservationDTO } from './reservation.model';

export default class ReservationController {
  async create(req: Request<any, any, CreateReservationDTO>, res: Response) {
    const hotelId = req.params.hotelId;
    const roomId = req.params.roomId;
    const dateString = req.body.date;
    if (!hotelId || !roomId) {
      res.status(400).json({ message: 'Missing request parameters' });
      return;
    }

    if (!dateString) {
      res.status(400).json({ message: 'Missing query parameters' });
      return;
    }

    if (!req.user) {
      res.status(500).json({ message: 'No user set' });
      return;
    }

    const reservation = new ReservationModel({
      hotel: hotelId,
      room: roomId,
      user: req.user.id,
      date: new Date(dateString),
    });
    await reservation.save();

    res.status(200).json(reservation);
  }
}
