import {
  deleteOrders,
  getOrders,
  getOrdersAll,
  OrderAdd,
} from "../controllers/OrderController.js";
import dotenv from "dotenv";
import express from "express";
dotenv.config();
const router = express.Router();

router.post("/addOrders", OrderAdd);
router.get("/getOrders/:id", getOrders);
router.delete("/deleteOrder/:id", deleteOrders);
router.get("/getOrdersAll", getOrdersAll);
export default router;
