/* eslint-disable no-unused-vars */

import {
  CourierCurrentBookStatus,
  CourierCurrentOrderAdd,
  courierGetOrders,
  deleteCourierOrders,
  getOrdersBooked,
} from "../controllers/CourierCurrentController.js";
import {
  changeStatus,
  ToBeDeployed,
} from "../controllers/CourierController.js";
import dotenv from "dotenv";
import express from "express";
dotenv.config();
const router = express.Router();

router.put("/tobedeployed/:id", ToBeDeployed);
router.put("/changeStatus/:id", changeStatus);

router.post("/courierCurrentOrderAdd", CourierCurrentOrderAdd);
router.get("/courierGetOrders/:id", courierGetOrders);
router.get("/getOrdersBooked/:id", getOrdersBooked);
router.delete("/deleteCourierOrders/:id", deleteCourierOrders);
router.put("/courierCurrentBookStatus/:id", CourierCurrentBookStatus);
export default router;
