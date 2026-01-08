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
function CourierSignup() {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    fullname: "",
    password: "",
    address: "",
    gender: "",
    phoneNumber: "",
  });

  const handleSignup = (e) => {
    e.preventDefault();
    axios
      .post(`${baseUrl}/SignupCouriers`, form)
      .then((result) => {
        setForm({
          email: "",
          fullname: "",
          password: "",
          address: "",
          gender: "",
          phoneNumber: "",
        });
        if (result.data.success) {
          toast.success(result.data.message, {
            position: "top-left",
            duration: 5000,
            isClosable: true,
          });
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
      });
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <div className=" font-poppins grid justify-self-center  mt-20 pb-20">
      <ToastContainer />
      <Card className="ssm:w-[350px] lg:w-[400px]">
        <CardHeader>
          <CardTitle>Create Account as Courier</CardTitle>
          <CardDescription>
            To Create account fill up form below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="grid gap-4">
            <div className="grid grid-cols-4 items-center">
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
              <Label htmlFor="name" className="text-left">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                value={form.fullname}
                name="fullname"
                placeholder="Fullname"
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
                <Button type="button" onClick={togglePasswordVisibility}>
                  {" "}
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center ">
              <Label htmlFor="address" className="text-left">
                address
              </Label>
              <Input
                id="address"
                type="text"
                value={form.address}
                name="address"
                placeholder="address"
                onChange={(e) =>
                  setForm({ ...form, [e.target.name]: e.target.value })
                }
                required
                className="col-span-3 "
              />
            </div>

            <div className="grid grid-cols-4 items-center ">
              <Label htmlFor="gender" className="text-left">
                Gender
              </Label>
              <Select
                onValueChange={(value) => setForm({ ...form, gender: value })}
                value={form.gender}
                required
              >
                <SelectTrigger className=" ssm:w-[225px] lg:w-[262px]">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center ">
              <Label htmlFor="phoneNumber" className="text-left text-xs">
                phone #
              </Label>
              <Input
                id="phoneNumber"
                type="number"
                value={form.phoneNumber}
                name="phoneNumber"
                placeholder="phone number"
                onChange={(e) =>
                  setForm({ ...form, [e.target.name]: e.target.value })
                }
                required
                className="col-span-3 "
              />
            </div>

            <CardFooter className="grid grid-cols-1 space-y-2 justify-center">
              <Button
                className="w-full bg-black text-white mt-2 hover:transform hover:scale-105 hover:duration-75"
                type="submit"
              >
                Create Account
              </Button>
              <div>
                <label className="text-sm flex gap-1">
                  Already Registered?{" "}
                  <Link to="/Authentication">
                    <p className="underline">Sign in</p>{" "}
                  </Link>
                </label>
              </div>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CourierSignup;
