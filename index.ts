import cors from "cors";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { UserModel } from "./module/user";

const port = 3000;
const app = express();
const mongooseConnect = process.env.MONGOOSE;
app.use(express.json());
app.use(cors());

mongoose.connect(
  "mongodb+srv://adcodes:Darasimi10@spinner.crj4kzv.mongodb.net/main?retryWrites=true&w=majority"
);
console.log(mongooseConnect, "hello");

app.get("/users", (req: Request, res: Response) => {
  UserModel.find({})
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.log("error", err);
      res.status(500).json({ error: err.message });
    });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
