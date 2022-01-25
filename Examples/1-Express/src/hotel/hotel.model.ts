import { Document, model, Schema, Types } from 'mongoose';
import { Room, roomSchema } from '../room/room.model';
import { User } from '../user/user.model';

export interface IHotel {
  _id?: Types.ObjectId;
  name: string;
  country: string;
  city: string;
  stars: number;
  rooms: Room[];
  owner: User;
}

export interface Hotel extends IHotel, Document<Types.ObjectId> {}

export interface CreateHotelDTO {
  name: string;
  country: string;
  city: string;
  stars: number;
}

export const hotelSchema = new Schema<Hotel>({
  name: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  stars: {
    type: Number,
    required: true,
  },
  rooms: [roomSchema],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

hotelSchema.set('toJSON', { versionKey: false });

export default model<Hotel>('Hotel', hotelSchema);
