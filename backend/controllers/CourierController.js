/* eslint-disable no-unused-vars */
import { UserModel } from "../models/Usermodel.js";
import { CourierModel } from "../models/CourierModel.js";
import { createSecretToken } from "../utils/SecretToken.js";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import upload from "../config/Cloudinary.js";

export const SignupCouriers = async (req, res, next) => {
  try {
    const { email, password, fullname, address, image, gender, phoneNumber } =
      req.body;

    const emailExist = await CourierModel.findOne({ email });
    const userEmailExist = await UserModel.findOne({ email });
    if (emailExist || userEmailExist) {
      return res.status(400).json({ message: "Email already Exists." });
    }
    const phoneExist = await CourierModel.findOne({ phoneNumber });
    const phoneUserExist = await UserModel.findOne({ phoneNumber });
    if (phoneExist || phoneUserExist) {
      return res.status(400).json({ message: "phone number already Exists." });
    }

    const user = await CourierModel.create({
      email,
      fullname,
      password,
      address,
      gender,
      phoneNumber,
    });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.status(201).json({
      message: `Rider signed up successfully ${email}`,
      success: true,
      user,
    });
    next();
  } catch (error) {
    console.error(error);
  }
};

export const changeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updateStatus = await CourierModel.findByIdAndUpdate(
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
      .status(201)
      .json({ message: "Status Updated", status: updateStatus });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error uploading files or updating courier." });
  }
};

export const ToBeDeployed = [
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "validId", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "driverLicense", maxCount: 3 },
  ]),
  async (req, res) => {
    try {
      const { age, service } = req.body;
      const { driverLicense, validId, resume, image } = req.files;
      const rider = await CourierModel.findById(req.params.id);
      if (!rider) {
        return res.status(404).json({ message: "No Rider Provided." });
      }
      const uploadCloud = async (file) => {
        try {
          const result = await cloudinary.uploader.upload(file.path);
          return result.secure_url;
        } catch (error) {
          console.error("Error uploading file to Cloudinary:", error.message);
          throw new Error("Cloudinary upload failed.");
        }
      };
      const driverLicenseId = driverLicense
        ? await Promise.all(driverLicense.map((file) => uploadCloud(file)))
        : rider.driverLicense;
      const validIdUrl = validId
        ? await uploadCloud(validId[0])
        : rider.validId;
      const resumeFile = resume ? await uploadCloud(resume[0]) : rider.resume;
      const imageFile = image ? await uploadCloud(image[0]) : rider.image;

      const uploaded = await CourierModel.findByIdAndUpdate(
        req.params.id,
        {
          age,
          service,
          driverLicense: driverLicenseId,
          validId: validIdUrl,
          resume: resumeFile,
          image: imageFile,
        },
        { new: true }
      );

      if (!uploaded) {
        return res.status(404).json({ message: "No Upload found." });
      }
      res.status(201).json({
        message:
          "Uploaded successfully: Wait for our Approval for your request and we will send you an email if confirmed.",
        user: uploaded,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Error uploading files or updating courier." });
    }
  },
];
