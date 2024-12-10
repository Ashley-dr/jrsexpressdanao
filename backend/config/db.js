/* eslint-disable no-unused-vars */
import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const conn = await mongoose.connect();
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};
