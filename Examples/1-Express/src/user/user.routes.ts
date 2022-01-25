import { Router } from 'express';
import authorize from '../middleware/authorize';
import UserController from './user.controller';
import { UserRole } from './user.model';

const routes: Router = Router();
const controller = new UserController();

routes.route('/user').post(controller.createUser);
routes.route('/user/authenticate').post(controller.authenticate);
routes.route('/user/:id').put(authorize(UserRole.Admin), controller.update);

export default routes;
