/* eslint-disable no-unused-vars */
import { CourierModel } from "../models/CourierModel.js";
import { UserModel } from "../models/Usermodel.js";
import { createSecretToken } from "../utils/SecretToken.js";

import bcrypt from "bcryptjs";
import crypto from "crypto";

export const Signup = async (req, res, next) => {
  try {
    const { email, password, fullname, address, image, gender, phoneNumber } =
      req.body;

    const emailExist = await CourierModel.findOne({ email });
    const userEmailExist = await UserModel.findOne({ email });
    if (emailExist || userEmailExist) {
      return res.status(400).json({ message: "Email already Exists." });
    }
    const phoneExist = await CourierModel.findOne({ phoneNumber });
    const phoneUserExist = await UserModel.findOne({ phoneNumber });
    if (phoneExist || phoneUserExist) {
      return res.status(400).json({ message: "phone number already Exists." });
    }

    const user = await UserModel.create({
      email,
      fullname,
      password,
      address,
      gender,
      phoneNumber,
    });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.status(201).json({
      message: `User signed up successfully ${email}`,
      success: true,
      user,
    });
    next();
  } catch (error) {
    console.error(error);
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are empty." });
    }
    const user = await UserModel.findOne({ email });
    const couriers = await CourierModel.findOne({ email });
    const account = user || couriers;
    if (!account) {
      return res.status(400).json({ message: "Incorrect email or password." });
    }

    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
          withCredentials: true,
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        return res.json({
          message: `${email} Successfully Logged on`,
          success: true,
          data: {
            isUser: true,
          },
        });
      }
    }

    if (couriers) {
      const auth = await bcrypt.compare(password, couriers.password);
      if (auth) {
        const token = createSecretToken(couriers._id);
        res.cookie("token", token, {
          withCredentials: true,
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        return res.json({
          message: `${email} Successfully Logged in as Courier`,
          success: true,
          data: {
            isCourier: true,
            isDeployed: account.isDeployed,
          },
        });
      }
    }
    return res.json({ message: "Incorrect Email or Password" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
