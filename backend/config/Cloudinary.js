/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const cloudstorage = multer.memoryStorage();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    resource_type: "raw",
    allowed_formats: ["jpg", "jpeg", "png", "pdf", "doc", "docx"],
  },
});

const upload = multer({ storage: storage });
export default upload;
