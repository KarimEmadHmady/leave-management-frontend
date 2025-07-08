"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import enGB from "date-fns/locale/en-GB"; 
registerLocale("en-GB", enGB);

export default function CreateUserPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [hireDate, setHireDate] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user-details`,
        {
          ...formData,
          hireDate: hireDate?.toISOString(),    
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      router.push("/admin/users");
    } catch (err) {
      console.error(err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-[#eee] rounded-2xl shadow-md">
      <div className="lines">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center text-[#1fabaa]">Create New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#1fabaa] mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:text-[#1fabaa]  placeholder-[#1fabaa] text-[#1fabaa]"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#1fabaa] mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:text-[#1fabaa] placeholder-[#1fabaa] text-[#1fabaa]"
          />
        </div>
        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-[#1fabaa] mb-1">
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create password"
            className="w-full border border-gray-300 p-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:text-[#1fabaa] placeholder-[#1fabaa] text-[#1fabaa]"
          />
          <span
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-9 cursor-pointer text-[#1fabaa]"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <div>
          <label htmlFor="hireDate" className="block text-sm font-medium text-[#1fabaa] mb-1">
            Hire Date
          </label>
          <DatePicker
            id="hireDate"
            selected={hireDate}
            onChange={(date) => setHireDate(date)}
            dateFormat="dd/MM/yyyy"
            locale="en-GB"
            placeholderText="Select hire date"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:text-[#1fabaa] placeholder-[#1fabaa] text-[#1fabaa]"
          />
        </div>

        <div className="flex items-center justify-between mt-4 gap-2">
          <button
            type="submit"
            className="w-full bg-[#1fabaa] text-white py-2 rounded-lg hover:bg-[#1fabaa] transition duration-300"
          >
            Create employees
          </button>
          <Button
            variant="secondary"
            className="flex items-center gap-2 px-5 py-2 rounded-xl shadow-sm hover:bg-gray-200 transition-all"
            onClick={() => router.back()}
          >
            Back
          </Button>
        </div>
      </form>
    </div>
  );
}
