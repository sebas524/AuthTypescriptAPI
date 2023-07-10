import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
import userModel from "../models/user";
import { ExpressRequestInterface } from "../types/expresRequest.interface";

export default async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    // * we are going to store our token inside the authorization header:
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.sendStatus(401);
    }
    // * because inside we have "Bearer fef1123xssoq" so we need the token part:
    const token = authHeader.split(" ")[1];
    const data = jwt.verify(token, `${process.env.JWT_SEED}`) as {
      id: string;
      email: String;
    };
    const user = await userModel.findById(data.id);
    if (!user) {
      return res.sendStatus(401);
    }
    req.user = user;
    next();
  } catch (error) {
    res.sendStatus(401);
  }
};
