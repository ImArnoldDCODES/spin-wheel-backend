import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/moduleTypes";

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  age: { type: String, required: true },
  height: { type: String, require: true },
  lastname: { type: String, require: true },
});

export const UserModel = mongoose.model<IUser>("user", UserSchema);
