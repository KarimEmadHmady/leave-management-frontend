"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import Image from "next/image";
import { FaUserShield, FaUsers } from "react-icons/fa"; 


const Navbar = () => {
  const { user, setUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <div className="cursor-pointer" onClick={() => router.push("/")}>
        <Image
          src="/logo.png"
          alt="Company Logo"
          width={120}
          height={40}
          className="hover:opacity-80 transition"
        />
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-300 text-sm sm:text-base">
              👋 {user.name}
            </span>

            {user.role === "admin" && (
              <>
                <div
                  onClick={() => router.push("/admin")}
                  className="flex items-center gap-2 cursor-pointer hover:text-gray-400 transition text-sm sm:text-base"
                >
                  <FaUserShield size={18} className="sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Leave requests</span>
                </div>

                <div
                  onClick={() => router.push("/admin/users")}
                  className="flex items-center gap-2 cursor-pointer hover:text-gray-400 transition text-sm sm:text-base"
                >
                  <FaUsers size={18} className="sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">All Users</span>
                </div>
              </>
            )}


            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition text-sm sm:text-base"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm sm:text-base"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/register")}
              className="bg-[#49a4d5] hover:bg-[#2c6c8f] text-white px-4 py-2 rounded-lg transition text-sm sm:text-base"
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
