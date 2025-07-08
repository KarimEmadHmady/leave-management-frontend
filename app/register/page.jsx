
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { Eye, EyeOff } from "lucide-react"; 

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import enGB from "date-fns/locale/en-GB";

registerLocale("en-GB", enGB);



export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hireDate, setHireDate] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        name,
        email,
        password,
        hireDate: hireDate?.toISOString(),
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
      }

      router.push("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };


  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="lines">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <div className="bg-dives p-8 rounded-lg shadow-lg w-full max-w-md ">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-200 ">
          Register
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-200">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
              required
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-200">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 bg-transparent"
              required
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-9 cursor-pointer text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          <div className="mb-6">
            <label className="block text-gray-200">Hire Date</label>
            <DatePicker
              selected={hireDate}
              onChange={(date) => setHireDate(date)}
              dateFormat="dd/MM/yyyy"
              locale="en-GB"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
              placeholderText="Select date"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#eee] text-[#1facab] p-2 rounded hover:bg-black transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
