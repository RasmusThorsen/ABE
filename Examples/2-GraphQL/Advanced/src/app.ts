import { ApolloServer } from "apollo-server-express";
import { json } from "body-parser";
import cors from "cors";
import express, { Application } from "express";
import jwt from "express-jwt";
import { buildSchema } from "type-graphql";
import { HotelResolver } from "./hotel/hotel.resolver";
import { RoomResolver } from "./room/room.resolver";
import { authChecker } from "./middleware/authorize.gql";
import {createConnection } from "typeorm";
import { UserResolver } from "./user/user.resolver";

export default class App {
  private httpServer: Application;
  private apolloServer: ApolloServer | null = null;

  constructor() {
    this.httpServer = express();
    this.httpServer.use(json());
    this.httpServer.use(cors());
  }

  async Start(port: number) {
    const result = async () => {
      try {
        const connection = await createConnection();

        const schema = await buildSchema({
          resolvers: [RoomResolver, HotelResolver, UserResolver],
          authChecker
        });

        this.apolloServer = new ApolloServer({
          schema,
          context: ({ req }) => {
            return {
              req,
              user: req.user,
              db: connection
            }
          }
        });

        // Authorization on GQL endpoint
        this.httpServer.use(
          '/graphql',
          jwt({
            secret: process.env.SECRET || '1234',
            algorithms: ['HS256'],
            credentialsRequired: false,
          }),
        );
        
        // Connect Apollo and Express
        this.apolloServer.applyMiddleware({ app: this.httpServer });

        this.httpServer.listen(port);
        console.log(`The server is running on http://localhost:${port}`);
      } catch (err) {
        console.log(err);
      }
    };

    return await result();
  }
}
