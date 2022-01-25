import { Document, model, Schema, Types } from 'mongoose';

export interface IRoom {
  _id?: Types.ObjectId;
  number: string;
  size: string;
}

export interface Room extends IRoom, Document<Types.ObjectId> {}

export interface AddRoomDTO {
  number: string;
  size: string;
}

export const roomSchema = new Schema<Room>({
  number: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
});

roomSchema.set('toJSON', { versionKey: false });

export default model<Room>('Room', roomSchema);
