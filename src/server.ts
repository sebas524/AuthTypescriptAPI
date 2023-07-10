import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import * as usersController from "./controllers/users";
import * as boardsController from "./controllers/boards";
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

io.on("connection", () => {
  console.log("io connected");
});

mongoose.connect(`${process.env.MONGO_URI}`).then(() => {
  console.log("connected to mongo db");

  httpServer.listen(port, () => {
    console.log(`server listening on port: ${port} `);
  });
});

const dbUrl = process.env.MONGO_URI;
console.log("xxx", dbUrl);

// "mongodb://localhost:27017/trelloApi"
