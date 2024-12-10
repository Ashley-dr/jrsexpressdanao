/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { UserModel } from "../models/Usermodel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const userVerification = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const user = await UserModel.findById(data.id);
      if (user)
        return res.json({
          status: true,
          user: {
            id: user._id,
            email: user.email,
            status: user.status,
            fullname: user.fullname,
            address: user.address,
            image: user.image,
            gender: user.gender,
            phoneNumber: user.phoneNumber,

            isUser: user.isUser,
            isAdmin: user.isAdmin,
            validId: user.validId,
            latitude: user.latitude,
            longitude: user.longitude,
            createdAt: user.createdAt,
          },
        });
      else return res.json({ status: false });
    }
  });
};
