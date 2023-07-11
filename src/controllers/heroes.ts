import { ExpressRequestInterface } from "../types/expresRequest.interface";
import HeroModel from "../models/hero";
import { NextFunction, Request, Response } from "express";

export const getHeroes = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401);
    }
    const foundHeroes = await HeroModel.find({ userId: req.user.id });
    res.status(200).send({ Status: "Success", foundHeroes });
  } catch (err) {
    next(err);
  }
};

export const createHero = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const newHero = new HeroModel({
      superhero: req.body.superhero,
      publisher: req.body.publisher,
      alterEgo: req.body.alterEgo,
      firstAppearance: req.body.firstAppearance,
      characters: req.body.characters,
      photo: req.body.photo,
      userId: req.user.id,
    });

    const savedHero = await newHero.save();

    res.status(200).send({ Status: "Success", savedHero: savedHero });
  } catch (err) {
    next(err);
  }
};
