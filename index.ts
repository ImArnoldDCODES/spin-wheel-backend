import cors from "cors";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import errorHandler from "./middleware/errorHandler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModal } from "./module/user";
require("dotenv").config();

const port = 5000;
const app = express();
const mongooseConnect = process.env.MONGOOSE || "";
mongoose.connect(mongooseConnect);
const jwtSecret = process.env.JWT_SECRET || "default_secret_key";

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

app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await UserModal.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentails" });

    const token = jwt.sign({ id: user._id }, jwtSecret, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
