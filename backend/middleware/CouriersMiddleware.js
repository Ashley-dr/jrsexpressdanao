/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { CourierModel } from "../models/CourierModel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const courierVerification = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const user = await CourierModel.findById(data.id);
      if (user)
        return res.json({
          status: true,
          user: {
            id: user._id,
            email: user.email,

            fullname: user.fullname,
            address: user.address,
            image: user.image,
            gender: user.gender,
            phoneNumber: user.phoneNumber,
            status: user.status,
            isDeployed: user.isDeployed,
            validId: user.validId,
            isCourier: user.isCourier,
            age: user.age,
            service: user.service,
            driverLicense: user.driverLicense,
            resume: user.resume,
            latitude: user.latitude,
            longitude: user.longitude,
            createdAt: user.createdAt,
          },
        });
      else return res.json({ status: false });
    }
  });
};
