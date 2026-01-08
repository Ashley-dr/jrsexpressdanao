/* eslint-disable no-unused-vars */
import React, { useState } from "react";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { LoaderPinwheelIcon } from "lucide-react";
function Authentication() {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${baseUrl}/Login`,
        { ...form },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message, { position: "top-left", duration: 5000 });

        if (data.data.isCourier) {
          if (data.data.isDeployed) {
            navigate("/ToBeDeployed");
            window.location.reload();
          } else {
            navigate("/CourierPage");
            window.location.reload();
          }
          navigate("/CourierPage");
          window.location.reload();
        } else if (data.data.isUser) {
          navigate("/CustomerPage");
          window.location.reload();
        }
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <div className=" font-poppins grid justify-self-center items-center mt-20 pb-20 ">
      <ToastContainer />
      <Card className="ssm:w-[350px] lg:w-[400px]">
        <CardHeader>
          <CardTitle className="text-[#008000] font-bold">Sign in</CardTitle>
          <CardDescription>Log in to explore things</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={login} className="grid gap-4">
            {" "}
            <div className="grid grid-cols-4 items-center ">
              <Label htmlFor="email" className="text-left">
                Email
              </Label>
              <Input
                id="email"
                type="text"
                value={form.email}
                name="email"
                placeholder="Email"
                onChange={(e) =>
                  setForm({ ...form, [e.target.name]: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center ">
              <Label htmlFor="password" className="text-left">
                password
              </Label>
              <div className="flex">
                <Input
                  id="password"
                  value={form.password}
                  name="password"
                  placeholder="password"
                  onChange={(e) =>
                    setForm({ ...form, [e.target.name]: e.target.value })
                  }
                  type={showPassword ? "text" : "password"}
                  className="ssm:w-40 lg:w-64"
                  required
                />
                <Button
                  type="button"
                  className="bg-gray-100 ml-2"
                  onClick={togglePasswordVisibility}
                >
                  {" "}
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </div>
            </div>
            <CardFooter className="grid grid-cols-1 space-y-2 justify-center">
              {loading ? (
                <Button className="w-full bg-black text-white mt-2 hover:transform hover:scale-105 hover:duration-75">
                  Processing <LoaderPinwheelIcon className=" animate-spin" />
                </Button>
              ) : (
                <Button
                  className="w-full bg-black text-white mt-2 hover:transform hover:scale-105 hover:duration-75"
                  type="submit"
                >
                  Log in
                </Button>
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Authentication;
