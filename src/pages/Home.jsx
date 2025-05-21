/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import TobeDeployed from "@/couriers/TobeDeployed";
import React from "react";
import Footer from "./Footer";

import { MountainIcon, TruckIcon } from "lucide-react";
import { FaBox, FaGlobe, FaWallet } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCookies } from "react-cookie";
import jrslogo from "../assets/jrslogo.png";
import axios from "axios";
import headerbg from "../assets/header.png";
import RateCalculator from "@/customer/RateCalculator";
function Home({ currentAuth }) {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const [cookies, removeCookies] = useCookies([]);
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await axios.post(`${baseUrl}/logout`, {}, { withCredentials: true });
      removeCookies("token", { path: "/" });
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Cannot Sign out: ", error);
    }
  };
  return (
    <div className="bg-[#f9f9f9] font-poppins lg:w-[100] grid justify-self-center">
      <figure>
        <section className="bg-[#f9f9f9] h-screen grid sm:grid-cols-1  lg:grid-cols-2 justify-items-center items-center ">
          <div className="space-y-4 mx-5">
            <div className="lg:w-[600px]  space-y-2 ">
              <p className=" text-[40px] font-bold font-poppins text-[#008000] ">
                Your Reliable Logistics Partner in Danao City
              </p>
              <p className=" text-gray-600 font-bold font-poppins  ">
                Fast, secure, and efficient delivery services tailored for Danao
                and the surrounding areas.
              </p>
            </div>
            {!currentAuth && (
              <div className="flex items-center gap-4">
                <Link to="/Authentication">
                  <Button className=" px-5 text-white bg-[#008000] border  rounded-md font-poppins font-bold text-sm hover:bg-[#0e470e] hover:text-white">
                    Sign in
                  </Button>
                </Link>
                <DropdownMenu>
                  <Link to="/UserSignup">
                    <Button className="border-black  bg-[#2c2525] text-white border p-2 rounded-md font-thin text-sm px-3 hover:bg-[#ffffff] hover:text-black">
                      Get Started
                    </Button>
                  </Link>
                  {/* <DropdownMenuTrigger asChild> */}

                  {/* </DropdownMenuTrigger> */}
                  {/* <DropdownMenuContent className="mt-2 space-y-1">
                    <Link to="/UserSignup">
                      <DropdownMenuItem>
                        <Button className="border hover:bg-black hover:text-white">
                          User Sign up
                        </Button>
                      </DropdownMenuItem>
                    </Link>
                    <Link to="/CourierSignup">
                      <DropdownMenuItem>
                        {" "}
                        <Button className="border hover:bg-black hover:text-white">
                          Rider Sign up
                        </Button>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent> */}
                </DropdownMenu>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div
              style={{
                backgroundImage: `url('https://i.ibb.co/xq7FTBWN/jrs-banner.jpg')`,
              }}
              alt="JRS Banner"
              className="max-w-full  max-h-[300px] rounded object-cover w-96 h-40 lg shadow-lg top-0     bg-cover bg-no-repeat bg-center"
            ></div>
          </div>
        </section>
        <section id="scope" className="p-10 text-center ">
          <div className="grid space-y-10">
            <p className="text-[#008000] text-[30px] font-bold">
              Why Choose JRS Express?
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 justify-items-center items-center gap-10">
              <div className="p-16 bg-white rounded-md shadow-lg space-y-2 transition duration-150 ease-in-out hover:scale-105">
                <p className="font-bold">Nationwide Delivery</p>
                <p className="font-bold text-gray-500">
                  Extensive network across the Philippines.
                </p>
              </div>
              <div className="p-16 bg-white rounded-md shadow-lg space-y-2 transition duration-150 ease-in-out hover:scale-105">
                <p className="font-bold">Reliable Service</p>
                <p className="font-bold text-gray-500">
                  Trusted for secure and timely deliveries.
                </p>
              </div>
              <div className="p-16 bg-white rounded-md shadow-lg space-y-2 transition duration-150 ease-in-out hover:scale-105">
                <p className="font-bold">Fast Shipping</p>
                <p className="font-bold text-gray-500">
                  Efficient delivery to meet your deadlines.
                </p>
              </div>
              <div className="p-16 bg-white rounded-md shadow-lg space-y-2 transition duration-150 ease-in-out hover:scale-105">
                <p className="font-bold">Competitive Rates</p>
                <p className="font-bold text-gray-500">
                  Affordable shipping solutions for everyone.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="p-10 text-center ">
          <div className="grid space-y-10">
            <p className="text-[#008000] text-[30px] font-bold">Our Services</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 justify-items-center items-center gap-10">
              <div>
                <div className="p-10 bg-white rounded-t-md shadow-lg space-y-2  grid justify-items-center">
                  <FaBox color="green" size={43} />
                  <p className="font-bold">Domestic Express</p>
                  <p className="font-bold text-gray-500">
                    Fast and reliable delivery within the Philippines.
                  </p>
                </div>
                <Link
                  to="/"
                  className="p-2 bg-gray-100 text-green-700 font-bold  shadow-lg  grid justify-items-center transistion-colors duration-200 hover:bg-gray-200"
                >
                  Learn more
                </Link>
              </div>
              <div>
                <div className="p-10 bg-white rounded-t-md shadow-lg space-y-3  grid justify-items-center">
                  <FaGlobe color="green" size={43} />
                  <p className="font-bold">International Express</p>
                  <p className="font-bold text-gray-500">
                    Efficient shipping services to overseas destinations.
                  </p>
                </div>
                <Link
                  to="/"
                  className="p-2 bg-gray-100 text-green-700 font-bold  shadow-lg  grid justify-items-center transistion-colors duration-200 hover:bg-gray-200"
                >
                  Learn more
                </Link>
              </div>
              <div>
                <div className="p-10 bg-white rounded-t-md shadow-lg space-y-2  grid justify-items-center">
                  <TbTruckDelivery color="green" size={43} />
                  <p className="font-bold">Cargo Forwarding</p>
                  <p className="font-bold text-gray-500">
                    Solutions for larger shipments and freight.
                  </p>
                </div>
                <Link
                  to="/"
                  className="p-2 bg-gray-100 text-green-700 font-bold  shadow-lg  grid justify-items-center transistion-colors duration-200 hover:bg-gray-200"
                >
                  Learn more
                </Link>
              </div>
              <div>
                <div className="p-10 bg-white rounded-t-md shadow-lg space-y-2  grid justify-items-center">
                  <FaWallet color="green" size={43} />
                  <p className="font-bold">Cash on Delivery</p>
                  <p className="font-bold text-gray-500">
                    Convenient payment option for your customers.
                  </p>
                </div>
                <Link
                  to="/"
                  className="p-2 bg-gray-100 text-green-700 font-bold  shadow-lg  grid justify-items-center transistion-colors duration-200 hover:bg-gray-200"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div
          id="rates"
          className="text-center mb-20 mt-10 font-poppins flex justify-center items-center space-x-5 "
        >
          {currentAuth && currentAuth.isCourier ? (
            <Link
              to="/CourierPage"
              className="px-5 p-3 border mt-8 bg-gray-900 text-white transition-transform hover:scale-105 hover:rounded-md"
            >
              Find Orders NOW
            </Link>
          ) : (
            <></>
          )}
          {currentAuth && currentAuth.isUser ? (
            <Link
              to="/CustomerPage"
              className="px-5 p-3 border mt-8 bg-gray-900 text-white transition-transform hover:scale-105 hover:rounded-md"
            >
              Track your Orders
            </Link>
          ) : (
            <></>
          )}
        </div>

        <RateCalculator />
      </figure>
    </div>
  );
}

export default Home;
