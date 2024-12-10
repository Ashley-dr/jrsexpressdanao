/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import markerIcon from "../assets/location-pin.png";
import starting from "../assets/startingbox.png";
import endbox from "../assets/endbox.png";
import { ScrollArea } from "@/components/ui/scroll-area";
import { io } from "socket.io-client";
const LocationMarker = ({ setUserLocation }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click() {
      this.locate();
    },
    locationfound(e) {
      setPosition(e.latlng);
      console.log(e.latlng);

      setUserLocation(e.latlng); // Update parent state with user location
      this.flyTo(e.latlng, this.getZoom());
    },
  });

  return position ? (
    <Marker
      position={position}
      icon={
        new L.Icon({
          iconUrl: markerIcon,
          iconSize: [70, 60],
          iconAnchor: [25, 60],
        })
      }
    >
      <Popup>
        <strong>Your Location</strong>
      </Popup>
    </Marker>
  ) : null;
};

const fetchCoordinates = async (address) => {
  try {
    const result = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    if (result.data.length > 0) {
      return {
        latitude: parseFloat(result.data[0].lat),
        longitude: parseFloat(result.data[0].lon),
      };
    }
    throw new Error("No coordinates found");
  } catch (error) {
    console.error("Geocoding error:", error.message);
    return null;
  }
};

function CustomerBookedTicket({ currentAuth }) {
  const [couriers, setCouriers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const [orders, setOrders] = useState([]);
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const [isDialogOpen, setDialogOpen] = useState(null);
  const [isDialogOpenStatus, setDialogOpenStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const [coordinates, setCoordinates] = useState(null); // Coordinates for map markers
  const [selectedOrder, setSelectedOrder] = useState(null); // Currently viewed order

  const handleViewMap = async (order) => {
    setSelectedOrder(order); // Set the selected order
    try {
      const pickPointCoords = await fetchCoordinates(order.pickPoint);
      const destinationCoords = await fetchCoordinates(order.destination);

      if (pickPointCoords && destinationCoords) {
        setCoordinates({
          pickPoint: pickPointCoords,
          destination: destinationCoords,
        });
        setDrawerOpen(true);
      } else {
        alert("Unable to fetch coordinates for the addresses.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `${baseUrl}/api/getOrdersBooked/${currentAuth.id}`,
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
      .delete(`${baseUrl}/api/deleteCourierOrders/${id}`)
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

  // useEffect(() => {
  //   // Initialize socket connection
  //   const socket = io(`${baseUrl}`);

  //   const fetchCouriers = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${baseUrl}/api-courier/${selectedOrder.courierId}`
  //       );

  //       setCouriers(response.data.courier);
  //     } catch (error) {
  //       console.error("Failed to fetch couriers:", error);
  //     }
  //   };

  //   fetchCouriers();

  //   // Listen for courier updates from the backend
  //   socket.on("courier-update-id", (courier) => {
  //     setCouriers((prevCouriers) => {
  //       const existingCourier = prevCouriers.find(
  //         (c) => c._id === courier.userId
  //       );
  //       if (existingCourier) {
  //         // Update existing courier's location
  //         return prevCouriers.map((c) =>
  //           c._id === courier.userId
  //             ? {
  //                 ...c,
  //                 latitude: courier.latitude,
  //                 longitude: courier.longitude,
  //               }
  //             : c
  //         );
  //       } else {
  //         // Add new courier to the list
  //         return [...prevCouriers, courier];
  //       }
  //     });
  //   });

  //   // Clean up socket connection on component unmount
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [baseUrl, selectedOrder]);
  useEffect(() => {
    const fetchCouriers = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api-courier/${selectedOrder.courierId}`
        );

        setCouriers(response.data.courier);
      } catch (error) {
        console.error("Failed to fetch couriers:", error);
      }
    };

    fetchCouriers();

    // Polling every 5 seconds
    const interval = setInterval(fetchCouriers, 5000);

    // Cleanup on component unmount
    return () => {
      clearInterval(interval);
    };
  }, [baseUrl, selectedOrder]);

  const [status, setStatus] = useState(false);
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
        `${baseUrl}/api/courierCurrentBookStatus/${selectedOrder._id}`,
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
        // setOrders((prevOrders) => prevOrders.filter((order) => order._id));
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
      setDialogOpenStatus(false);
      window.location.reload(6000);
    }
  };
  return (
    <div className="">
      <ToastContainer />
      {orders.length === 0 ? (
        <>
          <p className="text-center mt-32 text-xl font-poppins">
            No Booked by Couriers
          </p>
        </>
      ) : (
        <ScrollArea className="h-[650px] border px-2 w-full shadow-xl  mb-10 rounded-md">
          {orders
            .filter((orders) => orders.status === false)
            .map((entry, index) => (
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
                      {new Date(entry.orderSchedule).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
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
                  <div className="flex mt-5 gap-1">
                    <Button
                      onClick={() => {
                        handleViewMap(entry);
                      }}
                      className="p-3  bg-gray-400 transition hover:scale-105 hover:bg-gray-900 hover:text-white"
                    >
                      Track Order
                    </Button>

                    <Button
                      onClick={() => {
                        setDialogOpenStatus(entry._id);
                      }}
                      className="p-3 bg-emerald-400 transition hover:scale-105 hover:bg-gray-900 hover:text-white"
                      disabled={loading} // Disable button while loading
                    >
                      Complete
                    </Button>

                    <Button
                      onClick={() => setDialogOpen(entry._id)}
                      className="p-3  bg-red-500 transition hover:scale-105 hover:bg-red-900 hover:text-white"
                    >
                      Cancel Delivery
                    </Button>
                  </div>
                </div>
                <Dialog
                  open={isDialogOpenStatus === entry._id}
                  onOpenChange={() => setDialogOpenStatus(null)}
                >
                  <DialogContent
                    className="bg-gray-200 font-poppins"
                    aria-describedby="cancel-order-description"
                  >
                    <DialogHeader>
                      <DialogTitle className="flex justify-center items-center gap-5 font-poppins">
                        Complete Transaction
                      </DialogTitle>
                    </DialogHeader>
                    <p>
                      If this Delivery are now complete please proceed with this
                      complete order.
                    </p>
                    <form onSubmit={updateStatus}>
                      <Button
                        onClick={() => {
                          setSelectedOrder(entry);
                          setStatus(true);
                        }}
                        className="p-3 w-full bg-emerald-400 transition hover:scale-105 hover:bg-gray-900 hover:text-white"
                        disabled={loading} // Disable button while loading
                      >
                        {loading ? "Submitting..." : "Complete Order"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
                {coordinates && selectedOrder && (
                  <Dialog open={isDrawerOpen} onOpenChange={setDrawerOpen}>
                    <DialogContent className="bg-gray-200 font-poppins w-screen h-screen ">
                      <DialogHeader>
                        <DialogTitle className="text-center text-sm justify-center mb-2 font-quicksand">
                          <Accordion
                            type="single"
                            collapsible
                            defaultValue="item-3"
                          >
                            <AccordionItem value="item-1">
                              <AccordionTrigger className="mx-5">
                                <p className="font-poppins">View Details</p>
                              </AccordionTrigger>
                              <AccordionContent>
                                {" "}
                                Location (Pick point and Destination)
                                <div className="grid text-left text-[13px] font-thin font-quicksand">
                                  <div className="flex">
                                    <p className="text-xs mt-0.5 mr-1">
                                      Pickpoint:
                                    </p>
                                    <p>{selectedOrder.pickPoint}</p>
                                  </div>
                                  <div className="flex">
                                    <p className="text-xs mt-0.5 mr-1">
                                      Destination:
                                    </p>
                                    <p>{selectedOrder.destination}</p>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </DialogTitle>
                        <DialogDescription className=""></DialogDescription>
                      </DialogHeader>

                      <MapContainer
                        center={[
                          coordinates.pickPoint.latitude,
                          coordinates.pickPoint.longitude,
                        ]}
                        zoom={12}
                        style={{
                          height: "500px",
                          width: "100%",
                          position: "relative",
                          bottom: "27px",
                        }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <LocationMarker setUserLocation={setUserLocation} />
                        <Marker
                          position={[
                            coordinates.pickPoint.latitude,
                            coordinates.pickPoint.longitude,
                          ]}
                          icon={
                            new L.Icon({
                              iconUrl: starting,
                              iconSize: [70, 60],
                              iconAnchor: [25, 60],
                            })
                          }
                        >
                          <Popup>
                            Pick-Up Point: {selectedOrder.pickPoint}
                          </Popup>
                        </Marker>
                        <Marker
                          position={[
                            coordinates.destination.latitude,
                            coordinates.destination.longitude,
                          ]}
                          icon={
                            new L.Icon({
                              iconUrl: endbox,
                              iconSize: [70, 60],
                              iconAnchor: [25, 60],
                            })
                          }
                        >
                          <Popup>
                            Destination: {selectedOrder.destination}
                          </Popup>
                        </Marker>
                        {couriers && (
                          <Marker
                            // key={courier._id}
                            zIndexOffset={2}
                            position={[couriers.latitude, couriers.longitude]}
                            icon={
                              new L.Icon({
                                iconUrl:
                                  "https://cdn0.iconfinder.com/data/icons/logistics-delivery-set-2-1/512/1-512.png",
                                iconSize: [70, 60],
                                iconAnchor: [25, 60],
                              })
                            }
                          >
                            <Popup>
                              <p>Your Courier</p>
                              <strong>Courier {couriers.fullname}</strong>
                              <br />
                              <strong>Email: {couriers.email}</strong>
                              <br />
                              <strong>
                                Contact Number: + {couriers.phoneNumber}
                              </strong>

                              <br />
                              {couriers.status === "Available Now" && (
                                <div className="flex justify-center items-center gap-2">
                                  Status:{" "}
                                  <p className="bg-green-300 p-1 rounded-md">
                                    {couriers.status}
                                  </p>
                                </div>
                              )}
                              {couriers.status === "Not Available" && (
                                <div className="flex justify-center items-center gap-2">
                                  Status:{" "}
                                  <p className="bg-red-400 p-1 rounded-md">
                                    {couriers.status}
                                  </p>
                                </div>
                              )}
                              {couriers.status === "On Break" && (
                                <div className="flex justify-center items-center gap-2">
                                  Status:{" "}
                                  <p className="bg-orange-300 p-1 rounded-md">
                                    {couriers.status}
                                  </p>
                                </div>
                              )}
                            </Popup>
                          </Marker>
                        )}
                        <Polyline
                          positions={[
                            [
                              coordinates.pickPoint.latitude,
                              coordinates.pickPoint.longitude,
                            ],
                            [
                              coordinates.destination.latitude,
                              coordinates.destination.longitude,
                            ],
                          ]}
                          color="blue"
                        />
                        {/* Loop through the couriers and create markers for each available courier */}
                      </MapContainer>
                    </DialogContent>
                  </Dialog>
                )}
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
                    <p>
                      Are you sure you want to cancel this booked delivery to a
                      courier?{" "}
                    </p>
                    <Button
                      onClick={() => cancelOrder(entry._id)}
                      className="p-3 border-black border-2 transition hover:scale-105 hover:bg-gray-900 hover:text-white"
                    >
                      Cancel Booked Delivery
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

export default CustomerBookedTicket;
