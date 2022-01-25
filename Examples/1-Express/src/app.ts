import { json } from 'body-parser';
import cors from 'cors';
import express, { Application, Router } from 'express';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import routes from './router';
import { seed_db } from './seed-db';
import * as swaggerDocument from './swagger.json';
import path from "path";

export default class App {
  private httpServer: Application;
  private router: Router;

  constructor() {
    this.httpServer = express();
    this.router = routes;

    this.httpServer.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    this.httpServer.use(json());
    this.httpServer.use(cors());

    this.httpServer.use('/api', this.router);

    //Use a Custom Templating Engine
    this.httpServer.set("view engine", "pug");
    //Change views default directory 
    this.httpServer.set("views", path.resolve("./src/views"));


    // DB-connection
    try {
      mongoose.connect(process.env.CONNECTION_STRING || 'mongodb://localhost:27017/hotel-booking', {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      let env = process.env.NODE_ENV || 'development';
      if (env === 'development') {
        seed_db("admin@hotels.com", "test");
      }
    } catch (error) {
      console.log('Error');
      console.log(error);
    }
  }

  async Start(port: number) {
    const result = async () => {
      try {
        this.httpServer.listen(port);
        console.log(`The server is running on http://localhost:${port}`);
      } catch (err) {
        console.log(err);
      }
    };

    return await result();
  }
}
