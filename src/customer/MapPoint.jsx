/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { io } from "socket.io-client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "../assets/location-pin.png";
import axios from "axios";

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

const MapPoint = ({ currentAuth }) => {
  const [couriers, setCouriers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const [error, setError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  // useEffect(() => {
  //   let intervalId;

  //   const updateLocation = async () => {
  //     if (navigator.geolocation && currentAuth) {
  //       navigator.geolocation.getCurrentPosition(
  //         async (position) => {
  //           const { latitude, longitude } = position.coords;

  //           try {
  //             // await axios.put(
  //             //   `${baseUrl}/courier-update-location/${currentAuth.id}`,
  //             //   { latitude, longitude },
  //             //   { withCredentials: true }
  //             // );
  //             await axios.put(
  //               `${baseUrl}/users-update-location/${currentAuth.id}`,
  //               { latitude, longitude },
  //               { withCredentials: true }
  //             );
  //             // console.log("Location updated successfully.");
  //           } catch (error) {
  //             console.error("Error updating location:", error);
  //           }
  //         },
  //         (error) => {
  //           console.error("Geolocation error:", error);
  //         }
  //       );
  //     }
  //   };

  //   if (currentAuth) {
  //     intervalId = setInterval(updateLocation, 6000);
  //   }

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [currentAuth, baseUrl]);

  useEffect(() => {
    // Initialize socket connection
    const socket = io(`${baseUrl}`);

    const fetchCouriers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api-couriers`);

        setCouriers(response.data);
      } catch (error) {
        console.error("Failed to fetch couriers:", error);
      }
    };

    fetchCouriers();

    // Listen for courier updates from the backend
    socket.on("courier-update", (courier) => {
      setCouriers((prevCouriers) => {
        const existingCourier = prevCouriers.find(
          (c) => c._id === courier.userId
        );
        if (existingCourier) {
          // Update existing courier's location
          return prevCouriers.map((c) =>
            c._id === courier.userId
              ? {
                  ...c,
                  latitude: courier.latitude,
                  longitude: courier.longitude,
                }
              : c
          );
        } else {
          // Add new courier to the list
          return [...prevCouriers, courier];
        }
      });
    });

    // Clean up socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [baseUrl]);

  return (
    <MapContainer
      style={{ height: "100vh", width: "100%" }}
      center={
        userLocation
          ? [userLocation.lat, userLocation.lng]
          : [10.5417498, 123.9527031]
      }
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* User's location marker */}
      <LocationMarker setUserLocation={setUserLocation} />

      {/* Loop through the couriers and create markers for each available courier */}
      {couriers.map((courier) => (
        <Marker
          key={courier._id}
          zIndexOffset={2}
          position={[courier.latitude, courier.longitude]}
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
            <strong>Courier {courier.fullname}</strong>
            <br />
            <strong>Email: {courier.email}</strong>
            <br />
            <strong>Contact Number: {courier.phoneNumber}</strong>
            <br />
            {courier.status === "Available Now" && (
              <div className="flex justify-center items-center gap-2">
                Status:{" "}
                <p className="bg-green-300 p-1 rounded-md">{courier.status}</p>
              </div>
            )}
            {courier.status === "Not Available" && (
              <div className="flex justify-center items-center gap-2">
                Status:{" "}
                <p className="bg-red-400 p-1 rounded-md">{courier.status}</p>
              </div>
            )}
            {courier.status === "On Break" && (
              <div className="flex justify-center items-center gap-2">
                Status:{" "}
                <p className="bg-orange-300 p-1 rounded-md">{courier.status}</p>
              </div>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapPoint;
