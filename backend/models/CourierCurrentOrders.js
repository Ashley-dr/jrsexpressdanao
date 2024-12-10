/* eslint-disable no-unused-vars */
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const CourierCurrentOrderSchema = new mongoose.Schema({
  courierId: {
    type: String,
  },
  courierName: {
    type: String,
  },
  courierEmail: {
    type: String,
  },
  courierContact: {
    type: String,
  },
  courierImage: {
    type: String,
  },

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
  status: {
    type: Boolean,
    default: false,
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

export const CourierCurrentOrderModel = mongoose.model(
  "CourierCurrentOrderModel",
  CourierCurrentOrderSchema
);
