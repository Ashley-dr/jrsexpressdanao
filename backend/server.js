/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server as socketIo } from "socket.io";

import authRoute from "./routes/authRoute.js";

import CourierRoute from "./routes/CourierRoute.js";
import OrdersAdd from "./routes/AddOrderRoute.js";
import { CourierModel } from "./models/CourierModel.js";
import { UserModel } from "./models/Usermodel.js";
import { CourierCurrentOrderModel } from "./models/CourierCurrentOrders.js";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "https://jrsexpress.onrender.com"], // Change this to the frontend URL
    methods: ["GET", "POST"],
  },
});
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB conneyction error:", err));

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://jrsexpress.onrender.com"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRoute);
app.use("/api", CourierRoute);
app.use("/api", OrdersAdd);

app.get("/api-couriers", cors(), async (req, res) => {
  try {
    const availableCouriers = await CourierModel.find(
      { status: "Available Now" }, // Filtering condition
      {
        latitude: 1,
        longitude: 1,
        email: 1,
        fullname: 1,
        status: 1,
        phoneNumber: 1,
      }
    );
    availableCouriers.forEach((courier) => {
      io.emit("courier-update", {
        userId: courier._id,
        fullname: courier.fullname,
        email: courier.email,
        phoneNumber: courier.phoneNumber,
        latitude: courier.latitude,
        longitude: courier.longitude,
        status: courier.status,
      });
    });

    res.status(200).json(availableCouriers);
  } catch (error) {
    res.status(500).json({ error: "Failed to track couriers" });
  }
});

app.get("/api-courier/:id", cors(), async (req, res) => {
  try {
    const courierId = req.params.id; // Extract the courier ID from the request params

    // Find the courier's current order
    const currentOrder = await CourierCurrentOrderModel.findOne({
      courierId,
    });

    if (!currentOrder) {
      return res
        .status(404)
        .json({ message: "No current order for this courier" });
    }

    // Fetch the courier details using the courierId
    const courier = await CourierModel.findOne(
      { _id: courierId }, // Filtering condition
      {
        latitude: 1,
        longitude: 1,
        email: 1,
        fullname: 1,
        status: 1,
        phoneNumber: 1,
      }
    );

    if (!courier) {
      return res
        .status(404)
        .json({ message: "Courier not found or unavailable" });
    }

    // Emit courier details via socket for real-time updates
    io.emit("courier-update-id", {
      userId: courier._id,
      fullname: courier.fullname,
      email: courier.email,
      phoneNumber: courier.phoneNumber,
      latitude: courier.latitude,
      longitude: courier.longitude,
      status: courier.status,
    });

    // Return the courier's location and details
    res.status(200).json({
      courier: {
        id: courier._id,
        fullname: courier.fullname,
        latitude: courier.latitude,
        longitude: courier.longitude,
        email: courier.email,
        phoneNumber: courier.phoneNumber,
        status: courier.status,
      },
      orderDetails: currentOrder, // Include order details if needed
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch courier details" });
  }
});

app.get("/api-users", cors(), async (req, res) => {
  try {
    const availableUsers = await UserModel.find(
      { status: "Available Now" }, // Filtering condition
      {
        latitude: 1,
        longitude: 1,
        email: 1,
        fullname: 1,
        status: 1,
        phoneNumber: 1,
      }
    );
    availableUsers.forEach((user) => {
      io.emit("users-update", {
        userId: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        latitude: user.latitude,
        longitude: user.longitude,
        status: user.status,
      });
    });

    res.status(200).json(availableUsers);
  } catch (error) {
    res.status(500).json({ error: "Failed to track couriers" });
  }
});

app.put("/courier-update-location/:id", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const updatedCourier = await CourierModel.findByIdAndUpdate(
      req.params.id,
      {
        latitude,
        longitude,
        // status: "Available Now",
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedCourier) {
      return res.status(404).json({ message: "Courier not found" });
    }
    io.emit("courier-update", {
      userId: updatedCourier._id,
      fullname: updatedCourier.fullname,
      email: updatedCourier.email,
      phoneNumber: updatedCourier.phoneNumber,
      latitude,
      longitude,
      status: updatedCourier.status,
    });

    res.status(200).json({
      message: "Location updated successfully",
      courier: {
        latitude: updatedCourier.latitude,
        longitude: updatedCourier.longitude,
      },
    });
  } catch (error) {
    console.error("Location update error:", error);
    res
      .status(500)
      .json({ message: "Error updating location", error: error.message });
  }
});

app.put("/users-update-location/:id", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const updatedUsers = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        latitude,
        longitude,
        // status: "Available Now",
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedUsers) {
      return res.status(404).json({ message: "Users not found" });
    }
    io.emit("user-update", {
      userId: updatedUsers._id,
      fullname: updatedUsers.fullname,
      email: updatedUsers.email,
      phoneNumber: updatedUsers.phoneNumber,
      latitude,
      longitude,
      status: updatedUsers.status,
    });

    res.status(200).json({
      message: "Location updated successfully",
      courier: {
        latitude: updatedUsers.latitude,
        longitude: updatedUsers.longitude,
      },
    });
  } catch (error) {
    console.error("Location update error:", error);
    res
      .status(500)
      .json({ message: "Error updating location", error: error.message });
  }
});

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});
// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
