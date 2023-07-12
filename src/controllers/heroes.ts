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

export const getHero = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  if (!req.user) {
    return res.sendStatus(401);
  }
  try {
    // * get user info from db
    const heroInfo = await HeroModel.findById(id);

    // * return:
    if (!heroInfo) {
      return res
        .status(404)
        .json({ status: "Error", message: "User does not exist" });
    }

    return res.status(200).json({
      status: "success",
      userFound: heroInfo,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      message: "Server error, please contact admin.",
    });
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

export const updateHero = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  // * get new info to update from body
  let newHeroInfo = req.body;

  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const updatedHero = await HeroModel.findByIdAndUpdate(
      id,
      newHeroInfo,
      { new: true } // Return the updated document
    );

    if (!updatedHero) {
      return res.status(404).json({
        status: "Error",
        message: "Hero does not exist",
      });
    }

    return res.status(200).json({
      status: "Success",
      updatedHero: updatedHero,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      message: "Server error, please contact admin.",
    });
  }
};

export const deleteHero = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const deletedHero = await HeroModel.findByIdAndDelete(id);

    if (!deletedHero) {
      return res.status(404).json({
        status: "Error",
        message: "Hero does not exist",
      });
    }

    return res.status(200).json({
      status: "Success",
      message: "Hero deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      message: "Server error, please contact admin.",
    });
  }
};

export const searchHeroesByLetter = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  const letter = req.params.letter.toLowerCase();

  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const foundHeroes = await HeroModel.find({
      userId: req.user.id,
      superhero: { $regex: `^${letter}`, $options: "i" },
    });

    return res.status(200).json({
      status: "Success",
      foundHeroes: foundHeroes,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      message: "Server error, please contact admin.",
    });
  }
};
