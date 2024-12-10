/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";
import L from "leaflet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
function CurrentOrders({ currentAuth }) {
  const [orders, setOrders] = useState([]);
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const [isDialogOpen, setDialogOpen] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `${baseUrl}/api/getOrders/${currentAuth.id}`,
          { withCredentials: true }
        );
        setOrders(result.data);
      } catch (error) {
        console.error("Cannot fetch Data:", error.message);
      }
    };
    fetchData();
  }, [currentAuth.id, baseUrl]);

  const cancelOrder = (id) => {
    axios
      .delete(`${baseUrl}/api/deleteOrder/${id}`)
      .then((result) => {
        if (result.data.message) {
          toast.success(result.data.message, {
            position: "top-left",
          });
          setOrders((prevOrders) =>
            prevOrders.filter((order) => order._id !== id)
          );
          setDialogOpen(null);
        }
      })
      .catch((err) => {
        console.log();
        if (err.response && err.response.status === 400) {
          toast.error(err.response.data.message);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      });
  };
  return (
    <div className="">
      <ToastContainer />
      {orders.length === 0 ? (
        <>
          <p className="text-center mt-32 text-xl font-poppins">No Orders</p>
        </>
      ) : (
        <ScrollArea className="h-[650px] border px-2 w-full shadow-xl  mb-10 rounded-md">
          {orders.map((entry, index) => (
            <div
              key={entry._id}
              className="flex gap-x-3 mt-2  border-b-2 border-black"
            >
              <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-neutral-700">
                <div className="relative z-10 size-7 flex justify-center items-center">
                  <div className="size-2 rounded-full bg-gray-400 dark:bg-neutral-600"></div>
                </div>
              </div>

              <div className="grow pt-0.5 pb-8">
                <h3 className="flex gap-x-1.5 font-semibold text-gray-800 dark:text-white ">
                  <svg
                    className="shrink-0 size-4 mt-1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" x2="8" y1="13" y2="13"></line>
                    <line x1="16" x2="8" y1="17" y2="17"></line>
                    <line x1="10" x2="8" y1="9" y2="9"></line>
                  </svg>

                  {entry.RatesAndServices}
                </h3>
                <button
                  type="button"
                  className="mt-1 -ms-1 p-1 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                >
                  <img
                    className="shrink-0 size-4 rounded-full"
                    src={entry.customerImage}
                    alt="Avatar"
                  />
                  {entry.customerName}
                </button>
                <div className="flex gap-2">
                  <p className="mt-1 text-xs  text-gray-600 dark:text-neutral-400">
                    Pick point:
                  </p>
                  <p className="mt-1 text-sm break-words w-80 text-gray-900 dark:text-neutral-400">
                    {entry.pickPoint}
                  </p>
                </div>
                <div className="flex gap-2">
                  <p className="mt-1 text-xs text-gray-600 dark:text-neutral-400">
                    Destination:
                  </p>
                  <p className="mt-1 text-sm break-words w-80 text-gray-800 dark:text-neutral-400">
                    {entry.destination}
                  </p>
                </div>
                <div className="flex gap-2">
                  <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                    Distances:
                  </p>
                  <p className="mt-1 text-sm break-words w-80 text-gray-800 dark:text-neutral-400 ">
                    {entry.distance} km
                  </p>
                </div>
                <div className="flex gap-2">
                  <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                    Delivery Schedule:
                  </p>
                  <p className="mt-1 text-sm text-gray-800 dark:text-neutral-400">
                    {new Date(entry.orderSchedule).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                    Tip:
                  </p>
                  <p className="mt-1 text-sm text-gray-800 dark:text-neutral-400">
                    P {entry.tip}
                  </p>
                </div>
                <div className="flex gap-2">
                  <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                    Price:
                  </p>
                  <p className="mt-1 text-sm text-gray-800 dark:text-neutral-400">
                    P {entry.total}
                  </p>
                </div>{" "}
                <div className="flex gap-2">
                  <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                    Note:
                  </p>
                  <p className="mt-1 text-sm break-words w-80 text-gray-800 dark:text-neutral-400 ">
                    {entry.note}
                  </p>
                </div>
                <div className="flex mt-5">
                  <Button
                    onClick={() => setDialogOpen(entry._id)}
                    className="p-3 border-2 bg-gray-200 transition hover:scale-105 hover:bg-red-900 hover:text-white"
                  >
                    Cancel Order
                  </Button>
                </div>
              </div>
              <Dialog
                open={isDialogOpen === entry._id}
                onOpenChange={() => setDialogOpen(null)}
              >
                <DialogContent
                  className="bg-gray-200 font-poppins"
                  aria-describedby="cancel-order-description"
                >
                  <DialogHeader>
                    <DialogTitle className="flex justify-center items-center gap-5 font-poppins">
                      Cancel Order
                    </DialogTitle>
                  </DialogHeader>
                  <p>Are you sure you want to cancel this order?. </p>
                  <Button
                    onClick={() => cancelOrder(entry._id)}
                    className="p-3 border-black border-2 transition hover:scale-105 hover:bg-gray-900 hover:text-white"
                  >
                    Cancel Order
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </ScrollArea>
      )}
    </div>
  );
}

export default CurrentOrders;
