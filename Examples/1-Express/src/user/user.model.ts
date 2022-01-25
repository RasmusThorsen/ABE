import { Document, model, Schema, Types } from 'mongoose';

export enum UserRole {
  Admin = 'Admin',
  HotelManager = 'HotelManager',
  Guest = 'Guest',
}

export interface UserDTO {
  email: string;
  password: string;
}

export interface UserUpdateDTO {
  email?: string;
  role?: UserRole;
}

export interface LoggedInUser {
  id: any;
  email: string;
  role: UserRole;
}

export interface IUser {
  _id?: Types.ObjectId;
  email: string;
  role: string;
  hash: string;
  salt: string;
}

export interface User extends IUser, Document<Types.ObjectId> {}

const userSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  role: { type: [String], required: true },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
});

userSchema.set('toJSON', { versionKey: false });

const UserManager = model<User>('User', userSchema);
export { UserManager };
