import bcrypt from "bcryptjs";
import cors from "cors";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import errorHandler from "../middleware/errorHandler";
import { UserModal } from "../module/user";
import { CustomJwtPayload } from "../types/moduleTypes";
import dotenv from 'dotenv';
dotenv.config();

const port = 5000;
const app = express();
const mongooseConnect = process.env.MONGOOSE || "";
mongoose.connect(mongooseConnect);
const jwtSecret = process.env.JWT_SECRET || "default_secret_key";
let publicId: string;

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

app.get("/profile", async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as CustomJwtPayload;
    const user = await UserModal.findById(decoded.id).select("-password");
    publicId = decoded.id;
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post("/wheel", async (req: Request, res: Response) => {
  const { title, items } = req.body;

  try {
    const user = await UserModal.findOne({ _id: publicId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newGiveaway = {
      title: title,
      date: new Date(),
      items: items,
      winners: [],
    };

    user.giveaways.push(newGiveaway);
    await user.save();

    const createdGiveaway = user.giveaways[user.giveaways.length - 1];

    res.status(200).json({
      message: "Giveaway added successfully",
      giveawayId: createdGiveaway._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post("/winner", async (req: Request, res: Response) => {
  const { name, prize, giveawayId } = req.body;

  try {
    const user = await UserModal.findOne({ _id: publicId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const giveaway = user.giveaways.id(giveawayId);
    if (!giveaway) {
      return res.status(404).json({ message: "Giveaway not found" });
    }

    giveaway.winners.push({ name, prize });

    await user.save();

    res.status(200).json({ message: "Winner added successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
