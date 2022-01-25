import { pbkdf2Sync, randomBytes } from 'crypto';
import { UserManager, UserRole, } from './user/user.model';

export async function seed_db(email: string, password: string){
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 90000, 32, 'sha512').toString('hex');

  const user = await UserManager.findOne({ email});
  if (user) return;

  try {
    await UserManager.create({
      email: email,
      role: [UserRole.Admin],
      salt,
      hash,
    });
  } catch (e) {
    console.log("Couldn't create admin user");
    console.log(e);
  }
}