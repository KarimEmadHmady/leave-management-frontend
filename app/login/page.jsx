"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);

      if (res.data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("Something went wrong");
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
      <div className="bg-dives p-8 rounded-lg shadow-lg w-full max-w-md mx-3">
        <div className="flex flex-row items-center justify-between mb-6">
          <Image
            src="/logo.png"
            alt="Company Logo"
            width={100}
            height={30}
            className="hover:opacity-80 transition"
          />
          <h1 className="text-2xl font-bold  text-center text-gray-200">
            Login
          </h1>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#eee] text-gray-200"
              required
            />
          </div>
          <div className="mb-6 relative">
            <label className="block text-gray-300">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-[#eee] text-gray-200 bg-transparent"
              required
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-9 cursor-pointer text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-[#eee] text-[#1facab] p-2 rounded hover:bg-black transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
