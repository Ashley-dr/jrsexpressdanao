/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import TobeDeployed from "@/couriers/TobeDeployed";
import { LocateIcon, Mail, Phone } from "lucide-react";
import { RiFacebookFill } from "react-icons/ri";
import { CiInstagram } from "react-icons/ci";
import { FaTwitter } from "react-icons/fa";
import React from "react";
import { Link } from "react-router-dom";
import jrslogo from "../assets/jrslogo.png";
import { Button } from "@/components/ui/button";
function Footer({ currentAuth }) {
  return (
    <div className="mt-32 space-y-10 font-poppins lg:w-[100] grid justify-self-center">
      {" "}
      <figure>
        <article className="space-y-10">
          <p className="text-center text-4xl font-bold font-poppins grid justify-center items-center text-[#008000]">
            Contact Us
          </p>
          <p className="text-center  font-poppins grid justify-center items-center text-[#303a30]">
            Have a question or need assistance? Reach out to us!
          </p>
        </article>
        <div className="text-center  font-poppins grid ssm:grid-cols-1 lg:grid-cols-3 justify-center items-center  ">
          <div className="grid justify-items-center items-center font-quicksand space-y-2 mt-10">
            <Mail className="size-10" />
            <p className="text-xl font-semibold">Email</p>
            <p className="text-sm w-64">
              For business inquiries, please contact our corporate office.
            </p>
            <p className="font-bold">info@jrs-express.com</p>
          </div>
          <div className="grid justify-items-center items-center font-quicksand space-y-2 mt-10">
            <Phone className="size-10" />
            <p className="text-xl font-semibold">Contact</p>
            <p className="text-sm w-64">
              Follow us on social media for updates and promotions.
            </p>
            <p className="font-bold">+123-456-7890</p>
          </div>
          <div className="grid justify-items-center items-center font-quicksand space-y-2 mt-10">
            <LocateIcon className="size-10" />
            <p className="text-xl font-semibold">Office</p>
            <p className="text-sm w-64">
              We strive to provide the best customer service experience.
            </p>
            <p className="font-bold">123 Main Street, Danao, Philippines</p>
          </div>
        </div>
      </figure>
      <div className="mb-10">
        <div className="grid xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 justify-items-center mb-5">
          <div className="space-y-2">
            <p className="font-bold">About Us</p>
            <ul className="space-y-2">
              <li>
                <a href="#">Company Profile</a>
              </li>
              <li>
                <a href="#">Our History</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-bold">Services</p>
            <ul className="space-y-2">
              <li>
                <a href="#">Domestic Express</a>
              </li>
              <li>
                <a href="#">International Express</a>
              </li>
              <li>
                <a href="#">Cargo Forwarding</a>
              </li>
              <li>
                <a href="#">Cash on Delivery</a>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-bold">Support</p>
            <ul className="space-y-2">
              <li>
                <a href="#">Track & Trace</a>
              </li>
              <li>
                <a href="#">Rates</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="grid justify-self-center">
          <div className="flex flex-row gap-5">
            <a href="#">
              <RiFacebookFill size={32} />
            </a>
            <a href="#">
              <FaTwitter size={32} />
            </a>
            <a href="#">
              <CiInstagram size={32} />
            </a>
          </div>
        </div>
        <p className="flex justify-self-center text-xs mt-4 text-gray-400 mb-10">
          &copy; {new Date().getFullYear()} JRS Express - Danao. All rights
          reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer;
