/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { MountainIcon, TruckIcon } from "lucide-react";
import React from "react";
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
function Navigation({ currentAuth }) {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const [cookies, removeCookies] = useCookies([]);
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await axios.post(
        `${baseUrl}/logout`,
        {},
        { withCredentials: true } // Ensure the cookie is sent with the request
      );
      removeCookies("token", { path: "/" });
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Cannot Sign out: ", error);
    }
  };
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm  dark:bg-gray-950/90">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-14 items-center ">
          <Link to={"/"} className="flex items-center" prefetch={false}>
            {/* <TruckIcon className="h-6 w-6" /> */}
            <img src={jrslogo} alt="jrslogo" className="size-20 w-32" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          {currentAuth ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-gray-700 text-white px-3 py-2 rounded-md ">
                  {currentAuth.fullname || "Profile"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-2 space-y-1 bg-white">
                <DropdownMenuItem onClick={logout}>
                  <Button className="w-full text-left text-red-500">
                    Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/Authentication">
                <Button className="border-black px-3 border p-2 rounded-md font-thin text-sm hover:bg-[#2c2525] hover:text-white">
                  Sign in
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="border-black  bg-[#2c2525] text-white border p-2 rounded-md font-thin text-sm px-3 hover:bg-[#ffffff] hover:text-black">
                    Get Started
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mt-2 space-y-1">
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
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
