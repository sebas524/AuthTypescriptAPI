import { Document } from "mongoose";

export interface User {
  email: string;
  username: string;
  password: string;
  createdAt: Date;
}

// * this will be used just for mongoose:
export interface UserDocument extends User, Document {
  validatePassword(param1: String): Promise<boolean>;
}
