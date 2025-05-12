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
import headerbg from "../assets/header.png";
function Navigation({ currentAuth }) {
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
    <div className="w-full ">
      <nav
        className=" inset-x-0 top-0  shadow-sm xs:h-10 sm:h-20 lg:h-28  bg-cover bg-center"
        style={{ backgroundImage: `url(${headerbg})` }}
      ></nav>

      <div className="w-full  mx-auto ">
        <div className="flex justify-between  items-center ">
          {/* <Link to={"/"} className="flex items-center" prefetch={false}>
            <TruckIcon className="h-6 w-6" />
            <img src={jrslogo} alt="jrslogo" className="size-20 w-32" />
          </Link> */}
          <nav className="bg-white w-full font-poppins font-bold gap-5 shadow-md  grid  grid-cols-4 justify-between p-3">
            <div className="text-center w-full ">
              <Link
                to={"/"}
                className="text-center px-5 p-1 transition-colors hover:text-green-700 hover:border-2 hover:border-teal-600 rounded-md "
                prefetch={false}
              >
                Home
              </Link>
            </div>
            <div className="text-center w-full ">
              <Link
                to={"/"}
                className="text-center px-5 p-1 transition-colors hover:text-green-700 hover:border-2 hover:border-teal-600 rounded-md "
                prefetch={false}
              >
                Rates
              </Link>
            </div>

            <div className="text-center w-full ">
              <Link
                to={"/"}
                className="text-center px-5 p-1 transition-colors hover:text-green-700 hover:border-2 hover:border-teal-600 rounded-md "
                prefetch={false}
              >
                Scope
              </Link>
            </div>
            <div className="text-center w-full ">
              <Link
                to={"/"}
                className="text-center px-5 p-1 transition-colors hover:text-green-700 hover:border-2 hover:border-teal-600 rounded-md "
                prefetch={false}
              >
                Services <span className="">▼</span>
              </Link>
            </div>
          </nav>
        </div>
        {currentAuth ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-gray-700 absolute right-4 mt-1 text-white px-3 py-2 rounded-md ">
                {currentAuth.isUser === true ? (
                  <>
                    <p>{currentAuth.fullname || "Profile"}</p>|
                    <p className="text-sm font-thin">Logged as User</p>
                  </>
                ) : (
                  <>
                    <p>{currentAuth.fullname || "Profile"}</p>|
                    <p className="text-sm font-thin">Logged as Rider</p>
                  </>
                )}
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
          ""
        )}
      </div>
    </div>
  );
}

export default Navigation;
