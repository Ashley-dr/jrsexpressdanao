/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import axios from "axios";
import CustomerMap from "./CustomersMap";
import AllOrders from "./AllOrders";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import CurrentOrders from "./CurrentOrders.jsx";
function CourierPage({ currentAuth }) {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let intervalId;

    const updateLocation = async () => {
      if (navigator.geolocation && currentAuth) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              await axios.put(
                `${baseUrl}/courier-update-location/${currentAuth.id}`,
                { latitude, longitude },
                { withCredentials: true }
              );
              // await axios.put(
              //   `${baseUrl}/users-update-location/${currentAuth.id}`,
              //   { latitude, longitude },
              //   { withCredentials: true }
              // );
              // console.log("Location updated successfully.");
            } catch (error) {
              console.error("Error updating location:", error);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
          }
        );
      }
    };

    if (currentAuth) {
      intervalId = setInterval(updateLocation, 6000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [currentAuth, baseUrl]);

  const [status, setStatus] = useState(currentAuth?.status || ""); // Initialize state with current status

  const updateStatus = async (e) => {
    e.preventDefault();

    if (!status) {
      toast.error("Please select a status before submitting.", {
        position: "top-left",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        `${baseUrl}/api/changeStatus/${currentAuth.id}`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.message) {
        toast.success(response.data.message, {
          position: "top-left",
        });
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full font-poppins">
      {/* <ToastContainer /> */}

      <form
        onSubmit={updateStatus}
        className="mx-10 relative top-9 flex items-center bg-gray-800 text-white gap-2 w-[390px]  px-2 p-1 rounded-md"
      >
        <p>Status: </p>

        <Select
          onValueChange={(value) => setStatus(value)}
          value={status}
          required
        >
          <SelectTrigger className="w-[500px] ">
            <SelectValue
              placeholder={currentAuth?.status || "Select Status"}
              className="bg-black"
            />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectItem value="Available Now">Available Now</SelectItem>
              <SelectItem value="Not Available">Not Available</SelectItem>
              <SelectItem value="On Break">On Break</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          type="submit"
          className="bg-gray-900 w-40 px-2 text-white rounded-md transition-transform hover:scale-105"
        >
          Change
        </Button>
      </form>

      <div className="grid grid-rows-2 grid-flow-col">
        <div className="row-span-3 justify-items-center mt-10">
          {" "}
          <Tabs defaultValue="neworders" className="w-[450px]">
            <TabsList className="w-full gap-10">
              <TabsTrigger
                value="neworders"
                className="px-10 border border-t-0 border-l-0 border-r-0 hover:bg-gray-200 aria-selected:bg-[#1a2526] aria-selected:rounded-md aria-selected:text-white transition-colors"
              >
                All Orders
              </TabsTrigger>
              <TabsTrigger
                value="currentorders"
                className="px-10 border border-t-0 border-l-0 border-r-0 hover:bg-gray-200  aria-selected:bg-[#1a2526] aria-selected:rounded-md aria-selected:text-white transition-colors"
              >
                Current Orders
              </TabsTrigger>
            </TabsList>
            <TabsContent value="neworders">
              <AllOrders currentAuth={currentAuth} />
            </TabsContent>
            <TabsContent value="currentorders">
              <CurrentOrders currentAuth={currentAuth} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="row-span-2 col-span-12 h-32  z-40">
          <p className="text-center mb-10  font-quicksand font-thin ">
            A Real time map view to show Available Customers all around the
            world.
          </p>
          <CustomerMap />
        </div>
      </div>
    </div>
  );
}

export default CourierPage;
