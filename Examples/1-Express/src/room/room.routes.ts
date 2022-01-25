import { Router } from 'express';
import authorize from '../middleware/authorize';
import { UserRole } from '../user/user.model';
import RoomController from './room.controller';

const routes: Router = Router();
const controller = new RoomController();

routes.route('/hotels/:hotelId/rooms').post(authorize(UserRole.HotelManager), controller.add);
routes.route('/hotels/:hotelId/rooms').get(controller.get);

export default routes;
