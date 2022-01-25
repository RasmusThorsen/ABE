import { Field, InputType, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { HotelType } from "../hotel/hotel.types";

@Entity()
@ObjectType({ description: "A type defining a room in the system"})
export class RoomType {
  @PrimaryGeneratedColumn()
  @Field(() => String, { description: "The mongoDb identifier" })
  _id?: String;

  @Column()
  @Field(() => Number, { description: "The specific number for this room"})
  number?: number;

  @Column()
  @Field(() => String, { description: "How many guests that are allowed in the room"})
  size?: string;

  @Column()
  @Field(() => Number, { description: "The cost of one night"})
  price?: number;

  @Column()
  @Field(() => Boolean, { description: "Wether or not there is wifi access"})
  wifi?: boolean;

  @Column()
  @Field(() => String, { description: "The description of the room" })
  description?: string;

  @OneToMany(() => HotelType, hotel => hotel.rooms)
  hotel?: HotelType
}

@InputType({ description: "The input used for room creation" })
export class RoomInput {
  @Field({ nullable: false, description: "The number which this room has" })
  number?: number;

  @Field({ nullable: false, description: "How many guests that are allowed in the room" })
  size?: string;

  @Field({ nullable: false, description: "The cost of one night" })
  price?: number;

  @Field({ nullable: false, description: "Wether or not there is wifi access" })
  wifi?: boolean;

  @Field({ nullable: true, description: "The description of the room" })
  description?: string;
}
