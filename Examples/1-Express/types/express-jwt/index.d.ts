import { LoggedInUser } from '../../src/user/user.model';

declare global {
  namespace Express {
    // tslint:disable-next-line:no-empty-interface
    interface User extends LoggedInUser {}

    interface Request {
      user?: User;
    }
  }
}
