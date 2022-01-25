import { Router } from 'express';
import authorize from '../middleware/authorize';
import { UserRole } from '../user/user.model';
import HotelController from './hotel.controller';

const routes: Router = Router();
const controller = new HotelController();

routes.route('/hotels').post(authorize(UserRole.Admin, UserRole.HotelManager), controller.create);
routes.route('/hotels').get(controller.get);
routes.route('/views/hotels').get(controller.getView);
routes.route('/hotels/:id').delete(authorize(UserRole.Admin, UserRole.HotelManager), controller.delete);
routes.route('/hotels/:id/available-rooms').get(controller.availableRooms);

export default routes;
