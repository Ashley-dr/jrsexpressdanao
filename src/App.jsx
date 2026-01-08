/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { useCookies } from "react-cookie";
import axios from "axios";

import Navigation from "./pages/Navigation.jsx";
import Home from "./pages/Home.jsx";
import CourierSignup from "./tabs/CourierSignup.jsx";
import UserSignUp from "./tabs/UserSignUp.jsx";
import Authentication from "./tabs/Authentication.jsx";
import TobeDeployed from "./couriers/TobeDeployed.jsx";
import MapPoint from "./customer/MapPoint.jsx";
import AddOrders from "./customer/AddOrders.jsx";
import CustomerPage from "./customer/CustomerPage.jsx";
import CurrentOrders from "./customer/CurrentOrders";
import CustomerMap from "./couriers/CustomersMap";
import CourierPage from "./couriers/CourierPage";
import Footer from "./pages/Footer";

function App() {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const [cookies, removeCookies] = useCookies([]);
  const [isUsers, setIsUsers] = useState("");
  const [isCouriers, setIsCouriers] = useState("");
  const [currentAuth, setCurrentAuth] = useState("");

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const userRes = await axios.post(
          `${baseUrl}/users`,
          {},
          { withCredentials: true }
        );
        setIsUsers(userRes.data.user);

        const courierRes = await axios.post(
          `${baseUrl}/couriers`,
          {},
          { withCredentials: true }
        );
        setIsCouriers(courierRes.data.user);

        setCurrentAuth(userRes.data.user || courierRes.data.user);
      } catch (error) {
        console.error("Authentication error:", error);
      }
    };
    verifyAuth();
  }, [baseUrl]);

  return (
    <div className="">
      <header className="">
        <Navigation currentAuth={currentAuth} />
      </header>
      <Routes>
        {!currentAuth && (
          <Route
            path="/Authentication"
            element={<Authentication setCurrentAuth={setCurrentAuth} />}
          />
        )}
        <Route path="/" element={<Home currentAuth={currentAuth} />} />
        {currentAuth && currentAuth.isUser ? (
          <Route
            path="/CustomerPage"
            element={<CustomerPage currentAuth={currentAuth} />}
          />
        ) : (
          <></>
        )}
        {currentAuth && currentAuth.isCourier ? (
          <Route
            path="/CourierPage"
            element={<CourierPage currentAuth={currentAuth} />}
          />
        ) : (
          <></>
        )}
        <Route
          path="/AddOrders"
          element={<AddOrders currentAuth={currentAuth} />}
        />
        <Route
          path="/CurrentOrders"
          element={<CurrentOrders currentAuth={currentAuth} />}
        />

        <Route
          path="/MapPoint"
          element={<MapPoint currentAuth={currentAuth} />}
        />
        <Route
          path="/CustomersMap"
          element={<CustomerMap currentAuth={currentAuth} />}
        />
        <Route path="/CourierSignup" element={<CourierSignup />} />
        <Route path="/UserSignup" element={<UserSignUp />} />

        <Route
          path="/ToBeDeployed"
          element={<TobeDeployed currentAuth={currentAuth} />}
        />
      </Routes>
      <footer className="">
        <Footer currentAuth={currentAuth} />
      </footer>
    </div>
  );
}

export default App;
