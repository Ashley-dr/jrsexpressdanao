/* eslint-disable no-unused-vars */
import { v2 as cloudinary } from "cloudinary";
import upload from "../config/Cloudinary.js";
import { OrdersModel } from "../models/Orders.js";

export const OrderAdd = [
  upload.fields([{ name: "itemImage", maxCount: 5 }]),
  async (req, res) => {
    try {
      const {
        customerId,
        customerName,
        customerEmail,
        customerContact,
        customerImage,
        pickPoint,
        destination,
        orderSchedule,
        distance,
        paymentMethod,

        tip,
        note,
        total,
        RatesAndServices,
      } = req.body;
      const { itemImage } = req.files;

      const uploadCloud = async (file) => {
        try {
          const result = await cloudinary.uploader.upload(file.path);
          return result.secure_url;
        } catch (error) {
          console.error("Error uploading file to Cloudinary:", error.message);
          throw new Error("Cloudinary upload failed.");
        }
      };

      const itemImageUpload =
        itemImage &&
        (await Promise.all(itemImage.map((file) => uploadCloud(file))));

      const addOrders = new OrdersModel({
        customerId,
        customerName,
        customerEmail,
        customerContact,
        customerImage,
        pickPoint,
        destination,
        distance,
        orderSchedule,
        paymentMethod,
        tip,
        note,
        total,
        RatesAndServices,
        itemImage: itemImageUpload,
      });
      await addOrders.save();
      res.status(201).json({
        message:
          "Order Added: Wait for any rider to receive your package or find couriers nearby. .",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error uploading files." });
    }
  },
];

export const getOrders = async (req, res) => {
  try {
    const customerId = req.params.id; // Use consistent naming (req.params.id matches the route)
    const result = await OrdersModel.find({ customerId });

    if (!result) {
      return res
        .status(404)
        .json({ message: "No orders found for this customer." });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res
      .status(500)
      .json({ message: "An error occurred while fetching orders." });
  }
};

export const getOrdersAll = async (req, res) => {
  try {
    const result = await OrdersModel.find();

    if (!result) {
      return res.status(404).json({ message: "No Orders found." });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res
      .status(500)
      .json({ message: "An error occurred while fetching orders." });
  }
};

export const deleteOrders = async (req, res) => {
  OrdersModel.findByIdAndDelete(req.params.id)
    .then((result) => {
      return res.status(201).json({ message: "Order canceled." });
    })
    .catch((err) => {
      console.log("Order Cancel error.");
    });
};
