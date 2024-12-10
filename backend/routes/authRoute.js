/* eslint-disable no-unused-vars */
import { Login, Signup } from "../controllers/AuthController.js";
import { userVerification } from "../middleware/AuthMiddleware.js";

import { courierVerification } from "../middleware/CouriersMiddleware.js";
import { SignupCouriers } from "../controllers/CourierController.js";
import dotenv from "dotenv";
import express from "express";
dotenv.config();
const router = express.Router();

router.post("/Signup", Signup);
router.post("/SignupCouriers", SignupCouriers);
router.post("/Login", Login);
router.post("/users", userVerification);
router.post("/couriers", courierVerification);

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ message: "Logout successful" }); // Send a response
});

export default router;
