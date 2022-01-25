import { Router } from 'express';
import authorize from '../middleware/authorize';
import { UserRole } from '../user/user.model';
import ReservationController from './reservation.controller';

const routes: Router = Router();
const controller = new ReservationController();

routes.route('/hotels/:hotelId/rooms/:roomId/reservations').post(authorize(UserRole.Guest), controller.create);

export default routes;
