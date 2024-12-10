/* eslint-disable no-unused-vars */
import { OrdersModel } from "../models/Orders.js";
import { CourierCurrentOrderModel } from "../models/CourierCurrentOrders.js";

export const CourierCurrentOrderAdd = async (req, res) => {
  try {
    const {
      courierId,
      courierName,
      courierEmail,
      courierImage,
      courierContact,
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

    const addOrders = new CourierCurrentOrderModel({
      courierId,
      courierName,
      courierEmail,
      courierImage,
      courierContact,
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
    });
    await addOrders.save();
    res.status(201).json({
      message: "Customer Order added.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error uploading files." });
  }
};

export const CourierCurrentBookStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updateStatus = await CourierCurrentOrderModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updateStatus) {
      return res
        .status(400)
        .json({ message: "Cannot find it's id and update." });
    }
    return res
      .status(200)
      .json({ message: "Order Completed", status: updateStatus });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error uploading files or updating courier." });
  }
};
export const courierGetOrders = async (req, res) => {
  try {
    const courierId = req.params.id; // Use consistent naming (req.params.id matches the route)
    const result = await CourierCurrentOrderModel.find({ courierId });

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

export const getOrdersBooked = async (req, res) => {
  try {
    const customerId = req.params.id; // Use consistent naming (req.params.id matches the route)
    const result = await CourierCurrentOrderModel.find({ customerId });

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

export const getCouriersOrder = async (req, res) => {
  try {
    const result = await CourierCurrentOrderModel.find();

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

export const deleteCourierOrders = async (req, res) => {
  CourierCurrentOrderModel.findByIdAndDelete(req.params.id)
    .then((result) => {
      return res.status(201).json({ message: "Order canceled." });
    })
    .catch((err) => {
      console.log("Order Cancel error.");
    });
};
