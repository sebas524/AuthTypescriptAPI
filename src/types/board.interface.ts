import { Document, Schema } from "mongoose";

export interface Board {
  title: string;
  createdAt: Date;
  UpdatedAt: Date;
  //   * this is to actually tie a board to a specific user:
  userId: Schema.Types.ObjectId;
}

export interface BoardDocument extends Board, Document {}
