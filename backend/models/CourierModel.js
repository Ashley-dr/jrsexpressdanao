/* eslint-disable no-unused-vars */
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const CourierSchema = new mongoose.Schema({
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

  phoneNumber: {
    type: Number,
  },
  isCourier: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ["Available Now", "Not Available", "On-Break"],
  },

  isDeployed: {
    type: Boolean,
    default: false,
  },
  age: {
    type: Number,
  },
  service: {
    type: String,
  },
  driverLicense: {
    type: [String],
  },
  validId: {
    type: String,
  },
  resume: {
    type: String,
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

CourierSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

export const CourierModel = mongoose.model("Courier", CourierSchema);
