/* eslint-disable no-unused-vars */
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const OrderSchema = new mongoose.Schema({
  customerId: {
    type: String,
  },
  customerName: {
    type: String,
  },
  customerEmail: {
    type: String,
  },
  customerContact: {
    type: Number,
  },
  customerImage: {
    type: String,
  },

  paymentMethod: {
    type: String,
  },
  pickPoint: {
    type: String,
  },
  destination: {
    type: String,
  },
  distance: {
    type: Number,
  },
  orderSchedule: {
    type: Date,
  },
  itemImage: {
    type: [String],
  },

  tip: {
    type: Number,
  },

  total: {
    type: Number,
  },
  note: { type: String },
  RatesAndServices: {
    type: String,
    enum: [
      "Non Motorized / Walker",
      "Motor-Bike Delivery",
      "Bike Delivery",
      "Car Delivery",
    ],
  },
});

export const OrdersModel = mongoose.model("Orders", OrderSchema);
