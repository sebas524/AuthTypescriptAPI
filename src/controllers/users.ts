import { NextFunction, Request, Response } from "express";
import UserModel from "../models/user";
import { UserDocument } from "../types/user.interface";
import { Error } from "mongoose";
import jwt from "jsonwebtoken";
import { ExpressRequestInterface } from "../types/expresRequest.interface";
import * as dotenv from "dotenv";
dotenv.config();

export const normalizeUser = (user: UserDocument) => {
  const token = jwt.sign(
    { id: user.id, email: user.email },
    `${process.env.JWT_SEED}`
  );
  return {
    email: user.email,
    username: user.username,
    id: user.id,
    token: `Bearer ${token}`,
  };
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const newUser = new UserModel({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  console.log("new user: => ", newUser);
  try {
    const saveUser = await newUser.save();
    console.log("saved user: => ", saveUser);
    res.send(normalizeUser(saveUser));
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      const errorMessages = Object.values(error.errors).map((error) => {
        return error.message;
      });
      return res.status(422).json(errorMessages);
    }

    next(error);
    return res.status(500).json({
      status: "Error",
      message: "Server error, please contact admin.",
    });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // * compare email
    const foundUser = await UserModel.findOne({
      email: req.body.email,
    }).select("+password");
    if (!foundUser) {
      return res.status(422).json({
        status: "Error",
        message: "Incorect email or password",
      });
    }
    // * compare password:
    const samePasswords = await foundUser.validatePassword(req.body.password);

    if (!samePasswords) {
      return res.status(422).json({
        status: "Error",
        message: "Incorect email or password",
      });
    }

    res.send(normalizeUser(foundUser));
  } catch (error) {}
};

export const currentUser = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  res.send(normalizeUser(req.user));
};
