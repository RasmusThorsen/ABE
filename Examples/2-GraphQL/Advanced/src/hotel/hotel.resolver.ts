import { Arg, Query, Mutation, Resolver, Authorized, Ctx } from "type-graphql";
import { HotelInput, HotelType } from "./hotel.types";
import { Connection } from "typeorm";
import { UserRole } from "../user/user.types";

@Resolver()
export class HotelResolver {
  @Authorized([UserRole.Guest])
  @Query(() => [HotelType], { description: "Fetches all hotels in the system" })
  async hotels(@Arg("id", { nullable: true, description: "Optional ID for specific hotel" }) id: string,  @Ctx() ctx: { db: Connection }) {
    const repo = ctx.db.getRepository(HotelType);
    if (id) {
      return await repo.findOne(id);
    }
    return await repo.find();
  }

  @Authorized([UserRole.Admin, UserRole.HotelManager])
  @Mutation(() => HotelType, { description: "Mutation for creating a hotel" })
  async createHotel(@Arg("hotel") hotelInput: HotelInput, @Ctx() ctx: { db: Connection }) {
    const repo = ctx.db.getRepository(HotelType);
    const hotel: HotelType = {
      name: hotelInput.name,
      country: hotelInput.country,
      city: hotelInput.city,
      stars: hotelInput.stars,
      owner: "ctx.user."
    };
    
    await repo.save(hotel);

    return hotel;
  }
}
