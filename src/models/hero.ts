import { Schema, model } from "mongoose";
import { HeroDocument } from "../types/hero.interface";

const heroSchema = new Schema<HeroDocument>({
  superhero: { type: String, required: true },
  publisher: String,
  alterEgo: String,
  firstAppearance: String,
  characters: String,
  photo: String,
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

export default model<HeroDocument>("Hero", heroSchema);
