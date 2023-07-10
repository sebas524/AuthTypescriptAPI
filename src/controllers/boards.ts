import { NextFunction, Request, Response } from "express";
import BoardModel from "../models/board";
import { ExpressRequestInterface } from "../types/expresRequest.interface";

export const getBoards = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401);
    }
    const foundBoards = await BoardModel.find({ userId: req.user.id });
    res.status(200).send({ Status: "Success", foundBoards });
  } catch (err) {
    next(err);
  }
};

export const createBoard = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const newBoard = new BoardModel({
      title: req.body.title,
      userId: req.user.id,
    });

    const savedBoard = await newBoard.save();

    res.status(200).send({ Status: "Success", savedBoard });
  } catch (err) {
    next(err);
  }
};
