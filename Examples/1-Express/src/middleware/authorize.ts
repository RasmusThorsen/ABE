import jwt from 'express-jwt';

export default function authorize(...roles: string[]) {
  // // roles param can be a single role string (e.g. Role.User or 'User')
  // // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  // if (typeof roles === 'string') {
  //     roles = [roles];
  // }

  // Defines two middleware functions
  return [
    // authenticate JWT token and attach user to request object (req.user)
    jwt({ secret: process.env.SECRET || '1234', algorithms: ['HS256'] }),

    // authorize based on user role
    (req: any, res: any, next: any) => {
      if (roles.length && !req.user.role.some((userRole: string) => roles.includes(userRole))) {
        // user's role is not authorized
        return res.status(401).json({ message: 'Unauthorized' });
      }
      // authentication and authorization successful
      next();
    },
  ];
}
