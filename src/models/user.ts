import { Schema, model } from "mongoose";
import { UserDocument } from "../types/user.interface";
import validator from "validator";
import * as bcryptjs from "bcryptjs";
const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: [validator.isEmail, "Invalid email"],
      indexes: { unique: true },
    },
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
  },
  { timestamps: true }
);

// * pre allows you to run a function before (in this case, save)
userSchema.pre("save", async function (next) {
  // * to check if password field was modiefied:
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcryptjs.genSalt(10);
    // * hashing password:
    this.password = await bcryptjs.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error as Error);
  }
});

// * validate password:
userSchema.methods.validatePassword = function (password: string) {
  return bcryptjs.compare(password, this.password);
};

export default model<UserDocument>("User", userSchema);
