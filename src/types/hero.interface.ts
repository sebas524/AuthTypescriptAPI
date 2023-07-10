import { Document, Schema } from "mongoose";

export interface Hero {
  superhero: string;
  publisher: String;
  alterEgo: String;
  firstAppearance: String;
  characters: String;
  photo: String;
  createdAt: Date;
  UpdatedAt: Date;
  //   * this is to actually tie a board to a specific user:
  userId: Schema.Types.ObjectId;
}

export interface HeroDocument extends Hero, Document {}
