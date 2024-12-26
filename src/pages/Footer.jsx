/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import TobeDeployed from "@/couriers/TobeDeployed";
import { LocateIcon, Mail, Phone } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import jrslogo from "../assets/jrslogo.png";
import { Button } from "@/components/ui/button";
function Footer({ currentAuth }) {
  return (
    <div className="mb-32 ">
      {" "}
      <figure>
        <article className="space-y-10">
          <p className="text-center text-xs  font-poppins grid justify-center items-center">
            Our customer service team is available to help you with any queries.
          </p>
          <p className="text-center text-4xl font-bold font-poppins grid justify-center items-center">
            Contact Us
          </p>
          <p className="text-center  font-poppins grid justify-center items-center ">
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
      <figure>
        <div className="container mx-auto px-4 mt-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Logo */}
            <div className="mb-4 md:mb-0 flex items-center">
              <img src={jrslogo} alt="Logo" className="w-44 h-32 mr-2" />
            </div>

            {/* Links */}
            <ul className="flex flex-col ssm:flex-row md:flex-row gap-4 text-sm mb-10">
              <li>
                <a
                  href="#"
                  className="hover:text-gray-300 transition duration-200 "
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-300 transition duration-200"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-300 transition duration-200"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-gray-300 transition duration-200"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>

            {/* Social Media */}
          </div>
          <div className="">
            <div>
              <input type="text" className="border-2 border-black h-10" />
              <Button className="border rounded-none bottom-0.5 relative bg-gray-950 text-white font-quicksand">
                Send
              </Button>
            </div>

            <p className="text-xs font-poppins">Email us</p>
          </div>

          <p className=" text-xs mt-4 text-gray-400">
            &copy; {new Date().getFullYear()} JRS Express - Danao. All rights
            reserved.
          </p>
        </div>
      </figure>
    </div>
  );
}

export default Footer;
