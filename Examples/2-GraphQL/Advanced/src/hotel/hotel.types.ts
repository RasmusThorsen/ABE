import { Authorized, Field, InputType, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoomType } from "../room/room.types";
import { UserRole } from "../user/user.types";

@Entity()
@ObjectType({ description: "A type defining the hotel in the system"})
export class HotelType {
  @PrimaryGeneratedColumn()
  @Field(() => String, { description: "The unique mongoDb identifier" })
  _id?: string;

  @Column()
  @Field(() => String, { description: "The name of the hotel" })
  name?: string;

  @Column()
  @Field(() => String, { description: "The country of the hotel" })
  country?: string;

  @Column()
  @Field(() => String, { description: "The city of the hotel" })
  city?: string;

  @Column()
  @Authorized([UserRole.Admin, UserRole.HotelManager])
  @Field(() => String, { description: "The owner of the hotel" })
  owner?: string;

  @Column()
  @Field(() => Number, {description: "The stars of the hotel"})
  stars?: number;

  @ManyToOne(() => RoomType, room => room.hotel)
  @Field(() => [RoomType], { description: "The rooms that are avaiable in the hotel" })
  rooms?: RoomType[];
}

@InputType({description: "Used for hotel creation"})
export class HotelInput {
  @Field({ nullable: false, description: "The name of the hotel" })
  name?: string;

  @Field({ nullable: false, description: "The country of the hotel"})
  country?: string;

  @Field({ nullable: false, description: "Hotel Rating" })
  stars?: number;

  @Field({ nullable: false, description: "The city of the hotel" })
  city?: string;
}
