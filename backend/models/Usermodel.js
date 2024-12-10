/* eslint-disable no-unused-vars */
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  fullname: {
    type: String,
  },

  address: {
    type: String,
  },

  image: {
    type: String,
  },
  gender: {
    type: String,
  },
  isUser: {
    type: Boolean,
    default: true,
  },
  phoneNumber: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["Available Now", "Not Available", "On-Break"],
  },
  age: {
    type: Number,
  },
  validId: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },

  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  resetToken: { type: String, select: false },
  resetTokenExpiration: { type: String, select: false },
});

UserSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

export const UserModel = mongoose.model("User", UserSchema);
