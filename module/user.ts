import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  giveaways: [
    {
      title: { type: String, required: true },
      date: { type: Date, required: true },
      winners: [
        {
          name: { type: String, required: true },
          prize: { type: String, required: true },
        },
      ],
      items: [{ type: String, required: true }],
    },
  ],
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const UserModal = mongoose.model("User", UserSchema);
