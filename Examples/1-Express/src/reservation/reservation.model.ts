import { Document, model, Schema, Types } from 'mongoose';

export interface IReservation {
  _id?: Types.ObjectId;
  hotel: Types.ObjectId;
  room: Types.ObjectId;
  user: Types.ObjectId;
  date: Date;
}

export interface Reservation extends IReservation, Document<Types.ObjectId> {}

export interface CreateReservationDTO {
  date?: string;
}

export const reservationSchema = new Schema<Reservation>({
  hotel: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Schema.Types.Date,
    required: true,
  },
});

reservationSchema.set('toJSON', { versionKey: false });

export default model<Reservation>('Reservation', reservationSchema);
