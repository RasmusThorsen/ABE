import { Router } from 'express';
import hotelRoutes from './hotel/hotel.routes';
import reservationRoutes from './reservation/reservation.routes';
import roomRoutes from './room/room.routes';
import userRoutes from './user/user.routes';

const routes: Router = Router();

routes.use('/', userRoutes);
routes.use('/', hotelRoutes);
routes.use('/', roomRoutes);
routes.use('/', reservationRoutes);

export default routes;
