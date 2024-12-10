/* eslint-disable react/prop-types */
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
function TobeDeployed({ currentAuth }) {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    age: "",
    service: "",
  });
  const [file, setFile] = useState({
    image: null,
    validId: null,
    resume: null,
  });
  const [driverLicenses, setDriverLicense] = useState([]);

  const fileHandler = (e) => {
    setFile((prev) => ({
      ...prev,
      [e.target.name]: e.target.files[0],
    }));
  };
  const driverLicenseHandler = (e) => {
    setDriverLicense(Array.from(e.target.files));
  };
  const upload = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("age", form.age);
    formData.append("service", form.service);
    formData.append("image", file.image);
    formData.append("validId", file.validId);
    formData.append("resume", file.resume);
    driverLicenses.forEach((license, index) => {
      formData.append(`driverLicense`, license);
    });
    axios
      .put(`${baseUrl}/api/tobedeployed/${currentAuth.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((result) => {
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

  return (
    <div className=" font-poppins grid justify-self-center">
      <ToastContainer />
      <Card className="ssm:w-[350px] lg:w-[400px]">
        <CardHeader>
          <CardTitle>Apply now</CardTitle>
          <CardDescription>Ride for us</CardDescription>
          <CardDescription>
            Apply as full-time JRS Express - Danao Rider or Independent
            Contractor Driver and earn while Delivering!
          </CardDescription>
          <CardDescription>
            <p className="text-center justify-self-center text-xs flex">
              {currentAuth.fullname} <Hand size={16} className="ml-5" />
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={upload} className="grid gap-4">
            <CardFooter className="grid grid-cols-1 space-y-3 justify-center">
              <div className="grid grid-cols-4 items-center ">
                <Label htmlFor="age" className="text-left">
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={form.age}
                  name="age"
                  onChange={(e) =>
                    setForm({ ...form, [e.target.name]: e.target.value })
                  }
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center ">
                <Label htmlFor="gender" className="text-left">
                  Services
                </Label>
                <Select
                  onValueChange={(value) =>
                    setForm({ ...form, service: value })
                  }
                  value={form.service}
                  required
                >
                  <SelectTrigger className="w-[225px] ">
                    <SelectValue placeholder="Select Services" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      <SelectItem value="Non Motorized / Walker">
                        Non Motorized / Walker
                      </SelectItem>
                      <SelectItem value="2W">2W</SelectItem>
                      <SelectItem value="3W">3W</SelectItem>
                      <SelectItem value="4W">4W</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center ">
                <Label htmlFor="image" className="text-left">
                  Account Image
                </Label>
                <Input
                  id="image"
                  type="file"
                  name="image"
                  onChange={fileHandler}
                  accept="image/*"
                  className="col-span-3 cursor-pointer transition hover:scale-105"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center ">
                <Label htmlFor="resume" className="text-left">
                  Resume
                </Label>
                <Input
                  id="resume"
                  type="file"
                  name="resume"
                  onChange={fileHandler}
                  accept="application/pdf"
                  className="col-span-3 cursor-pointer transition hover:scale-105"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center ">
                <Label htmlFor="validId" className="text-left">
                  Valid ID
                </Label>
                <Input
                  id="validId"
                  type="file"
                  name="validId"
                  onChange={fileHandler}
                  accept="image/*"
                  className="col-span-3 cursor-pointer transition hover:scale-105"
                  required
                />
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
                    name="driverLicense"
                    accept=".jpeg,.jpg,.png,.gif,.pdf,.doc,.docx"
                    onChange={driverLicenseHandler}
                    multiple
                    required
                    hidden
                    max={3}
                  />
                  <p className="text-xs text-center">
                    Attach file image of your Driver License. <br />({" "}
                    {driverLicenses.length} ) 3 max.
                  </p>
                </div>
              </figure>
              {loading ? (
                <Button className="w-full bg-black text-white mt-2 hover:transform hover:scale-105 hover:duration-75">
                  Submit Form <LoaderPinwheelIcon className=" animate-spin" />
                </Button>
              ) : (
                <Button
                  className="w-full bg-black text-white mt-2 hover:transform hover:scale-105 hover:duration-75"
                  type="submit"
                >
                  Submit Form
                </Button>
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-green-200 font-poppins">
          <DialogHeader>
            <DialogTitle className="flex justify-center items-center gap-5 font-poppins">
              Application Uploaded <CheckCircle2Icon />
            </DialogTitle>
          </DialogHeader>
          <p>
            Your File Application are now to be reviewed, wait for your approval
            our team will reach for you.{" "}
          </p>
          <Link to="/" className="p-2 rounded-xl text-center bg-green-500">
            Go Back
          </Link>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TobeDeployed;
