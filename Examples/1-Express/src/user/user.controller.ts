import { pbkdf2Sync, randomBytes } from 'crypto';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import { UserDTO, UserManager, UserRole, UserUpdateDTO } from './user.model';

export default class UserController {
  public async createUser(req: Request<any, any, UserDTO>, res: Response): Promise<Response> {
    const salt = randomBytes(16).toString('hex');
    const hash = pbkdf2Sync(req.body.password, salt, 90000, 32, 'sha512').toString('hex');

    const user = await UserManager.findOne({ email: req.body.email });
    if (user) {
      return res.status(409).send({
        stats: 'Email is already in the system',
      });
    }
    try {
      await UserManager.create({
        email: req.body.email,
        role: [UserRole.Guest],
        salt,
        hash,
      });
      return res.status(201).send();
    } catch (e) {
      console.log(e);
      return res.status(500).send();
    }
  }

  public async authenticate(req: Request<any, any, UserDTO>, res: Response): Promise<Response | undefined> {
    const user = await UserManager.findOne({ email: req.body.email });
    if (!user) return;

    const matchingHash = user.hash == pbkdf2Sync(req.body.password, user.salt, 90000, 32, 'sha512').toString('hex');
    if (matchingHash) {
      const token = sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.SECRET || '1234',
        { expiresIn: '1h' }
      );

      return res.status(200).send({
        token,
      });
    }

    return res.status(401).send();
  }

  public async update(req: Request<any, any, UserUpdateDTO>, res: Response) {
    const userId = req.params.id;
    try {
      const user = await UserManager.findById(userId);
      if (!user) {
        res.status(404).json({
          message: 'User not found',
        });
      } else {
        user.email = req.body.email ? req.body.email : user.email;
        user.role = req.body.role ? req.body.role : user.role;
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
      }
    } catch (e) {
      res.status(500).json(e);
    }
  }
}
