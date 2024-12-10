/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import TobeDeployed from "@/couriers/TobeDeployed";
import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";

function Home({ currentAuth }) {
  return (
    <div>
      <figure>
        <p className="text-center text-4xl font-bold font-poppins grid justify-center items-center h-80">
          Fast and Reliable Couriers Servicess with <br /> JRS Express - Danao
        </p>
        <p className="text-center  font-poppins grid justify-center items-center ">
          Experience seamless delivery solutions with JRS Express and Real Time
          Tracking for all Users/Couriers. We offer fast and reliable courier
          services <br /> to ensure your packages reach their destination on
          time.
        </p>
        <div className="text-center  font-poppins flex justify-center items-center space-x-5 ">
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
      </figure>
    </div>
  );
}

export default Home;
