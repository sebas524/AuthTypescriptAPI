import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import * as usersController from "./controllers/users";
import * as boardsController from "./controllers/boards";
import * as heroesController from "./controllers/heroes";

import bodyParser from "body-parser";
import authMiddleware from "./middlewares/auth";
import cors from "cors";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set("toJSON", {
  virtuals: true,
  transform: (_, converted) => {
    delete converted._id;
  },
});

app.post("/api/users/register", usersController.register);
const port = 3000;
app.post("/api/users/login", usersController.login);
app.get("/api/users/user", authMiddleware, usersController.currentUser);
app.get("/api/boards/allBoards", authMiddleware, boardsController.getBoards);
app.post(
  "/api/boards/createBoard",
  authMiddleware,
  boardsController.createBoard
);
app.get("/api/heroes/allHeroes", authMiddleware, heroesController.getHeroes);
app.get("/api/heroes/hero/:id", authMiddleware, heroesController.getHero);
app.post("/api/heroes/createHero", authMiddleware, heroesController.createHero);
app.patch("/api/heroes/hero/:id", authMiddleware, heroesController.updateHero);
app.delete("/api/heroes/hero/:id", authMiddleware, heroesController.deleteHero);
app.get(
  "/api/heroes/search/:letter",
  authMiddleware,
  heroesController.searchHeroesByLetter
);

io.on("connection", () => {
  console.log("io connected");
});

mongoose.connect(`${process.env.MONGO_URI}`).then(() => {
  console.log("connected to mongo db");

  httpServer.listen(process.env.PORT || port, () => {
    console.log(`server is listening... `);
  });
});
