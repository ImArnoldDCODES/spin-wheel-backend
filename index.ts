import cors from "cors";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import errorHandler from "./middleware/errorHandler";
import { UserModal } from "./module/user";
require("dotenv").config();

const port = 5000;
const app = express();
const mongooseConnect = process.env.MONGOOSE || "";
mongoose.connect(mongooseConnect);

app.use(express.json());
app.use(cors());


app.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const user = new UserModal({ name, email, password });
    await user.save();
    res.status(200).json({ message: "User Registered Successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
