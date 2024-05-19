import { Document } from "mongoose";
import { JwtPayload } from 'jsonwebtoken';

export interface IUser extends Document {
  name: string;
  password: string;
  email: string;
}


export interface CustomJwtPayload extends JwtPayload {
  id: string;
}