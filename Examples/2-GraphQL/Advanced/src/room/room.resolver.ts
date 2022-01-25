import { Arg, Query, Mutation, Resolver, Authorized, Ctx } from "type-graphql";
import { RoomType, RoomInput } from "./room.types";
import { Connection } from "typeorm";
import { HotelType } from "../hotel/hotel.types";

@Resolver()
export class RoomResolver {
  @Query(() => [RoomType], { description: "Gets all rooms" })
  async rooms(@Arg("price", { nullable: true, description: "Upper price limit" }) price: number, @Ctx() ctx: { db: Connection }) {
    const repo = ctx.db.getRepository(HotelType);
    const hotels = await repo.find();

    const rooms = hotels.flatMap((h: HotelType) => h.rooms).filter((room): room is RoomType => !!room);
    return rooms.filter((r) => {
      if (r.price) {
        return (price ? r.price < price : true);
      } else {
        return r;
      }
    });
  }

  @Query(() => RoomType, { description: "Fetches specific room based on ID" })
  async room(@Arg("id") id: string, @Ctx() ctx: { db: Connection }) {
    const repo = ctx.db.getRepository(HotelType);
    const hotels = await repo.find();
    const rooms = hotels.flatMap((h: HotelType) => h.rooms);

    return rooms.find((r) => r?._id ? String(r._id) === id : false );
  }

  // @Authorized([UserRole.Admin, UserRole.HotelManager])
  @Mutation(() => RoomType, { description: "Adds a room to a hotel." })
  async createRoom(
    @Arg("hotelId", { description: "The hotel to which the room is added" }) hotelId: string,
    @Arg("room", { description: "The room to create" }) roomInput: RoomInput,
    @Ctx() ctx: { db: Connection }
  ) {
    const repo = ctx.db.getRepository(HotelType);
    const hotel = await repo.findOne(hotelId);

    if (!hotel) {
      throw new Error("Hotel not found!");
    }

    const room: RoomType = roomInput;
    hotel.rooms?.push(room)
    if(hotel._id) {
      await repo.update(hotel?._id, {
        rooms: hotel.rooms
      })
    }

    return room;
  }
}
