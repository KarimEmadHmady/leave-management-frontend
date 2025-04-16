"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function CreateUserPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    hireDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user-details`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      router.push("/admin/users");
    } catch (err) {
      console.error(err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-blue-100 rounded-2xl shadow-md">
      <div className="lines">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Create New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-blue-400 mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:text-blue-400  placeholder-blue-400 text-blue-700"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-blue-400 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:text-blue-400 placeholder-blue-400 text-blue-700"
          />
        </div>
        <div className="relative">
  <label htmlFor="password" className="block text-sm font-medium text-blue-400 mb-1">
    Password
  </label>
  <input
    id="password"
    type={showPassword ? "text" : "password"}
    name="password"
    value={formData.password}
    onChange={handleChange}
    placeholder="Create password"
    className="w-full border border-gray-300 p-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:text-blue-400 placeholder-blue-400 text-blue-700"
  />
  <span
    onClick={togglePasswordVisibility}
    className="absolute right-3 top-9 cursor-pointer text-blue-400"
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </span>
</div>

        <div>
          <label htmlFor="hireDate" className="block text-sm font-medium text-blue-400 mb-1">
            Hire Date
          </label>
          <input
            id="hireDate"
            type="date"
            name="hireDate"
            value={formData.hireDate}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:text-blue-400 placeholder-blue-400 text-blue-700"
          />
        </div>
        <div className="flex items-center justify-between mt-4 gap-2">
        <button
          type="submit"
          className="w-full bg-blue-400 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Create User
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
