/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  CheckCircle2Icon,
  Hand,
  ImageIcon,
  Loader2,
  LoaderPinwheelIcon,
} from "lucide-react";
import { CardBody } from "@chakra-ui/react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const convertCoordsToAddress = async (coords) => {
  const { lat, lng } = coords;
  try {
    // Use Google Maps API, Nominatim, or any reverse geocoding service
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse`,
      {
        params: {
          lat,
          lon: lng,
          format: "json",
        },
      }
    );

    const address = response.data.display_name;
    return address || `Lat: ${lat}, Lng: ${lng}`;
  } catch (error) {
    console.error("Error fetching address:", error);
    return `Lat: ${lat}, Lng: ${lng}`; // Fallback to coordinates if API fails
  }
};

function MapSelector({ onSelectLocation }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onSelectLocation({ lat, lng });
    },
  });
  return null;
}
function AddOrders({ currentAuth }) {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    customerId: "",
    customerName: "",
    customerEmail: "",
    customerContact: "",
    customerImage: "",
    pickPoint: "",
    destination: "",
    orderSchedule: "",
    paymentMethod: "",
    total: "",

    tip: "",
    note: "",
    distance: "",
    RatesAndServices: "",
  });
  const [itemImage, setItemImage] = useState([]);
  const [mapType, setMapType] = useState(null); // "pickPoint" or "destination"
  const [isMapOpen, setIsMapOpen] = useState(false);

  const [pickPointCoords, setPickPointCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);

  const handleMapClick = async (coords) => {
    const address = await convertCoordsToAddress(coords); // Fetch address

    if (mapType === "pickPoint") {
      setPickPointCoords(coords);
      setForm({ ...form, pickPoint: address });
    } else if (mapType === "destination") {
      setDestinationCoords(coords);
      setForm({ ...form, destination: address });
    }

    setIsMapOpen(false); // Close map modal
  };

  const itemImageHandler = (e) => {
    setItemImage(Array.from(e.target.files));
  };
  const [containerType, setContainerType] = useState("");
  const [isExpress, setIsExpress] = useState(false);
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [containerTypes, setContainerTypes] = useState([]);

  useEffect(() => {
    setContainerTypes([
      { value: "Documents", label: "Documents" },
      { value: "Pouch", label: "Pouch" },
      { value: "Box", label: "Box" },
      { value: "Cargo", label: "Cargo" },
    ]);
  }, []);

  const upload = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("customerId", currentAuth.id);
    formData.append("customerName", currentAuth.fullname);
    formData.append("customerEmail", currentAuth.email);
    formData.append("customerImage", currentAuth.image);
    formData.append("customerContact", currentAuth.phoneNumber);

    formData.append("pickPoint", form.pickPoint);
    formData.append("destination", form.destination);
    formData.append("distance", form.distance);
    formData.append("total", form.total);
    formData.append("paymentMethod", form.paymentMethod);
    formData.append("orderSchedule", form.orderSchedule);

    formData.append("tip", form.tip);
    formData.append("note", form.note);
    formData.append("RatesAndServices", form.RatesAndServices);

    itemImage.forEach((image, index) => {
      formData.append(`itemImage`, image);
    });
    axios
      .post(`${baseUrl}/api/addOrders`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((result) => {
        setForm({
          customerId: "",
          customerName: "",
          customerEmail: "",
          customerContact: "",
          pickPoint: "",
          destination: "",
          customerImage: "",
          orderSchedule: "",
          paymentMethod: "",
          total: "",

          tip: "",
          note: "",
          distance: "",
          RatesAndServices: "",
        });
        if (result.data.message) {
          toast.success(result.data.message, {
            position: "top-left",
          });
          setDialogOpen(true);
        }
        // navigate("/");
      })

      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 400) {
          toast.error(err.response.data.message);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      })
      .finally(() => {
        setLoading(false); // Reset loading state after the request completes
      });
  };
  const calculateDistanceAndTotal = () => {
    if (pickPointCoords && destinationCoords) {
      const R = 6371; // Earth's radius in km
      const lat1 = (pickPointCoords.lat * Math.PI) / 180;
      const lat2 = (destinationCoords.lat * Math.PI) / 180;
      const lon1 = (pickPointCoords.lng * Math.PI) / 180;
      const lon2 = (destinationCoords.lng * Math.PI) / 180;

      const dLat = lat2 - lat1;
      const dLon = lon2 - lon1;

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) *
          Math.cos(lat2) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km

      const totalPrice = distance * 10; // Example pricing: $10 per km

      console.log(`Distance: ${distance.toFixed(2)} km`);
      console.log(`Total Price: ${totalPrice.toFixed(2)}`);

      // Update the form with the total price
      setForm((prevForm) => ({
        ...prevForm,
        total: totalPrice.toFixed(2),
        distance: distance.toFixed(2),
      }));
    } else {
      toast.error("Please select both pickup and destination points");
    }
  };

  return (
    <div className=" font-poppins grid justify-self-center mb-10">
      <ToastContainer />
      <Card className="ssm:w-[350px] lg:w-[400px]">
        <CardHeader>
          <CardTitle>Add Order for Delivery</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={upload} className="grid gap-4">
            <CardFooter className="grid grid-cols-1 space-y-3 justify-center">
              {/* <div className=" items-center ">
                <Input
                  id="pickPoint"
                  type="number"
                  value={form.pickPoint}
                  name="pickPoint"
                  placeholder="Pick Point"
                  onChange={(e) =>
                    setForm({ ...form, [e.target.name]: e.target.value })
                  }
                  className="col-span-3"
                  required
                />
              </div> */}
              {/* <div className=" items-center ">
                <Input
                  id="total"
                  type="number"
                  placeholder="Total Cost"
                  value={form.total}
                  name="total"
                  onChange={(e) =>
                    setForm({ ...form, [e.target.name]: e.target.value })
                  }
                  className="col-span-3"
                  required
                />
                <p className="text-left text-[10px] font-quicksand text-gray-900">
                  Total cost.
                </p>
              </div> */}
              <div className="form-group">
                <Input
                  readOnly
                  className="tranform transition hover:scale-105 cursor-pointer"
                  placeholder="Click to select pick-up point"
                  value={form.pickPoint}
                  onClick={() => {
                    setMapType("pickPoint");
                    setIsMapOpen(true);
                  }}
                />
                <p className="text-left text-[10px] absolute font-quicksand text-gray-900">
                  Pick up Point.
                </p>
              </div>

              <div className="form-group">
                <Input
                  readOnly
                  className="tranform transition hover:scale-105 cursor-pointer"
                  placeholder="Click to select destination"
                  value={form.destination}
                  onClick={() => {
                    setMapType("destination");
                    setIsMapOpen(true);
                  }}
                />
                <p className="text-left text-[10px]  font-quicksand text-gray-900">
                  Drop off Point.
                </p>
              </div>
              <Input
                readOnly
                className="border-none hidden"
                placeholder="Distances"
                value={`${form.distance} km`}
                required
              />
              <p>{form.distance} km</p>
              {isMapOpen && (
                <div className="map-modal z-40">
                  <MapContainer
                    center={[10.5417498, 123.9527031]}
                    zoom={13}
                    style={{ height: "400px", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapSelector onSelectLocation={handleMapClick} />
                    {pickPointCoords && (
                      <Marker
                        position={[pickPointCoords.lat, pickPointCoords.lng]}
                      />
                    )}
                    {destinationCoords && (
                      <Marker
                        position={[
                          destinationCoords.lat,
                          destinationCoords.lng,
                        ]}
                      />
                    )}
                  </MapContainer>
                  <Button
                    className="text-center bg-gray-900 text-white w-full"
                    onClick={() => setIsMapOpen(false)}
                  >
                    Close Map
                  </Button>
                </div>
              )}
              <div className="gap-5 grid grid-cols-2">
                <Button
                  onClick={calculateDistanceAndTotal}
                  required
                  className="bg-gray-900 text-white transition-transform hover:scale-105"
                >
                  Calculate Price
                </Button>
                <Input
                  readOnly
                  className=""
                  placeholder="Total Price"
                  value={`P${form.total}`}
                  required
                />
              </div>

              <div className=" items-center ">
                <Input
                  id="orderSchedule"
                  type="date"
                  value={form.orderSchedule}
                  name="orderSchedule"
                  onChange={(e) =>
                    setForm({ ...form, [e.target.name]: e.target.value })
                  }
                  className="col-span-3 text-center"
                  required
                />
                <p className="text-left text-[10px] font-quicksand text-gray-900">
                  Order Schedule.
                </p>
              </div>

              <div className=" items-center ">
                <Select
                  onValueChange={(value) => setForm({ ...form, tip: value })}
                  value={form.tip}
                  required
                >
                  <SelectTrigger className=" ">
                    <SelectValue placeholder="Select Tip" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      {Array.from({ length: 101 }, (_, i) => i * 10).map(
                        (value) => (
                          <SelectItem key={value} value={value.toString()}>
                            P{value}
                          </SelectItem>
                        )
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <p className="text-left text-[10px] font-quicksand text-gray-900">
                  Tips.
                </p>
              </div>

              <div className=" items-center ">
                <Select
                  onValueChange={(value) =>
                    setForm({ ...form, RatesAndServices: value })
                  }
                  value={form.RatesAndServices}
                  required
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select Services" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      <SelectItem value="Non Motorized / Walker">
                        Non Motorized / Walker
                      </SelectItem>
                      <SelectItem value="Motor-Bike Delivery">
                        Motor-Bike Delivery
                      </SelectItem>
                      <SelectItem value="Bike Delivery">
                        Bike Delivery
                      </SelectItem>
                      <SelectItem value="Car Delivery">Car Delivery</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <p className="text-left text-[10px] font-quicksand text-gray-900">
                  Rates and Service.
                </p>
              </div>
              <div className="section container-details">
                <div className="input-group">
                  <label>Container Type</label>
                  <select
                    value={containerType}
                    onChange={(e) => setContainerType(e.target.value)}
                  >
                    <option value="">Select type</option>
                    {containerTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="express-checkbox">
                  <label htmlFor="express">Express</label>
                  <input
                    type="checkbox"
                    id="express"
                    checked={isExpress}
                    onChange={(e) => setIsExpress(e.target.checked)}
                  />
                </div>
                <div className="dimensions">
                  <div className="input-group">
                    <label>Length (cm)</label>
                    <input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(+e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>Width (cm)</label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(+e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>Height (cm)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(+e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className=" items-center ">
                <Select
                  onValueChange={(value) =>
                    setForm({ ...form, paymentMethod: value })
                  }
                  value={form.paymentMethod}
                  required
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select Payment" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      <SelectItem value="In Cash">In Cash</SelectItem>
                      <SelectItem value="E-Payment">E-Payment</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <p className="text-left text-[10px] font-quicksand text-gray-900">
                  Payment Method.
                </p>
              </div>
              <div className="items-center ">
                <Input
                  id="note"
                  type="text"
                  placeholder="Description"
                  value={form.note}
                  name="note"
                  onChange={(e) =>
                    setForm({ ...form, [e.target.name]: e.target.value })
                  }
                  className="col-span-3"
                  required
                />
                <p className="text-left text-[10px] font-quicksand text-gray-900">
                  Note of Order.
                </p>
              </div>
              <figure className="space-y-2 grid justify-items-center">
                <div className="mx-5 mt-5 grid justify-items-center ">
                  <label htmlFor="file-upload" className="cursor-pointer flex">
                    <div
                      className="border p-4 rounded-md hover:bg-[#191818d3]"
                      size="lg"
                      aria-label="Upload file"
                    >
                      <ImageIcon />
                    </div>
                  </label>

                  <input
                    id="file-upload"
                    type="file"
                    name="itemImage"
                    accept=".jpeg,.jpg,.png,.gif,.pdf,.doc,.docx"
                    onChange={itemImageHandler}
                    multiple
                    required
                    hidden
                    max={3}
                  />
                  <p className="text-xs text-center">
                    Attach file image of an Item. <br />( {itemImage.length} ) 5
                    max.
                  </p>
                </div>
              </figure>
              {loading ? (
                <Button className="w-full bg-black text-white mt-2 hover:transform hover:scale-105 hover:duration-75">
                  Processing <LoaderPinwheelIcon className=" animate-spin" />
                </Button>
              ) : (
                <Button
                  className="w-full bg-black text-white mt-2 hover:transform hover:scale-105 hover:duration-75"
                  type="submit"
                >
                  Confirm Order
                </Button>
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-gray-200 font-poppins">
          <DialogHeader>
            <DialogTitle className="flex justify-center items-center gap-5 font-poppins">
              Order Added <CheckCircle2Icon />
            </DialogTitle>
          </DialogHeader>
          <p>
            Order package uploaded: Wait for any Couriers to receive an order or
            Find Couriers nearby.{" "}
          </p>
          <DialogClose asChild>
            <Button className="p-2 rounded-xl text-center bg-green-500">
              Go Back
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddOrders;
