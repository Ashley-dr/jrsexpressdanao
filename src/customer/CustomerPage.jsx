/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AddOrders from "./AddOrders";
import MapPoint from "@/customer/MapPoint";
import CurrentOrders from "./CurrentOrders";
import axios from "axios";
import CustomerBookedTicket from "./CustomerBookedTicket";
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";

function CustomerPage({ currentAuth }) {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  useEffect(() => {
    let intervalId;

    const updateLocation = async () => {
      if (navigator.geolocation && currentAuth) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              // await axios.put(
              //   `${baseUrl}/courier-update-location/${currentAuth.id}`,
              //   { latitude, longitude },
              //   { withCredentials: true }
              // );
              await axios.put(
                `${baseUrl}/users-update-location/${currentAuth.id}`,
                { latitude, longitude },
                { withCredentials: true }
              );
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
  const location = useLocation();
  useEffect(() => {
    if (location.hash === "#item") {
      const element = document.getElementById("item");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location]);
  return (
    <div className="max-w-full font-poppins">
      {/* <p className="relative left-16 top-10">Order for an Delivery</p> */}
      <div className="lg:h-[900px] grid ssm:grid-rows-1 lg:grid-rows-2 lg:grid-flow-col ">
        <a
          href="#item"
          className="fixed  bg-[#8080804a] bottom-4 right-4 flex items-center justify-center  p-2 rounded-full z-50 shadow-lg hover:bg-[#bababad0] transition duration-300 ease-in-out"
        >
          <ArrowUp className="text-2xl" />
        </a>
        <div id="item" className=" justify-items-center mt-10   lg:w-full">
          {" "}
          <Tabs defaultValue="neworders" className="">
            <TabsList className="ssm:p-2 ssm:w-[370px] lg:w-[450px] gap-10">
              <TabsTrigger
                value="neworders"
                className="px-10 border border-t-0 border-l-0 border-r-0 hover:bg-gray-200 aria-selected:bg-[#1a2526] aria-selected:rounded-md aria-selected:text-white transition-colors"
              >
                Add Orders
              </TabsTrigger>
              <TabsTrigger
                value="currentorders"
                className="px-10 border border-t-0 border-l-0 border-r-0 hover:bg-gray-200  aria-selected:bg-[#1a2526] aria-selected:rounded-md aria-selected:text-white transition-colors"
              >
                Current Orders
              </TabsTrigger>
            </TabsList>
            <TabsContent value="neworders">
              <AddOrders currentAuth={currentAuth} />
            </TabsContent>
            <TabsContent value="currentorders">
              <Tabs
                defaultValue="neworders"
                className="ssm:w-[370px] lg:w-[450px]"
              >
                <TabsList className="w-full gap-10">
                  <TabsTrigger
                    value="neworders"
                    className="px-10 border border-t-0 border-l-0 border-r-0 hover:bg-gray-200 aria-selected:bg-[#1a2526] aria-selected:rounded-md aria-selected:text-white transition-colors"
                  >
                    My Orders
                  </TabsTrigger>
                  <TabsTrigger
                    value="currentorders"
                    className="px-10 border border-t-0 border-l-0 border-r-0 hover:bg-gray-200  aria-selected:bg-[#1a2526] aria-selected:rounded-md aria-selected:text-white transition-colors"
                  >
                    Orders Booked
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="neworders">
                  <CurrentOrders currentAuth={currentAuth} />
                </TabsContent>
                <TabsContent value="currentorders">
                  <CustomerBookedTicket currentAuth={currentAuth} />
                </TabsContent>
              </Tabs>
              {/* <CurrentOrders currentAuth={currentAuth} /> */}
            </TabsContent>
          </Tabs>
        </div>

        <div className="row-span-2 col-span-12 h-32  z-40  ssm:mb-[700px] lg:mb-0">
          <p className="text-center mb-10 mt-10 font-quicksand font-thin ">
            A Real time map view to show registered Courier all around the
            world.
          </p>
          <MapPoint />
        </div>
      </div>
    </div>
  );
}

export default CustomerPage;
