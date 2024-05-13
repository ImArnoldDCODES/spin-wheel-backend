import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  age: string;
  height: string;
  lastname: string;
}
