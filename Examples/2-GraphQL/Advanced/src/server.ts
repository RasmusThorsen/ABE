import dotenv from "dotenv";
dotenv.config();

import "reflect-metadata";

import App from "./app";

const PORT: number = parseInt(process.env.PORT || "5001");
new App().Start(PORT);
