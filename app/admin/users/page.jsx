"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user-details`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <div className="lines">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800 ">All Users</h1>
        <Link
          href="/admin/users/create"
          className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition-all duration-300"
        >
          Create User
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
        {users.map((user) => (
          <Link
            href={`/admin/users/${user._id}`}
            key={user._id}
            className="bg-blue-100 shadow-lg hover:shadow-xl transition-all rounded-2xl p-6 transform hover:scale-105 p-[15px]"
          >
            <div className="flex items-center justify-between gap-6  ">
              <div>
                <h2 className="text-2xl font-semibold text-blue-400">
                  {user.name}
                </h2>
                <p className="text-blue-400">
                  {user.jobTitle || "No Job Title"}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <div>
                {user.profileImage && (
                  <Image
                    src={user.profileImage}
                    alt={`${user.name}'s Profile`}
                    width={100}
                    height={100}
                    className="rounded-full object-cover border-4 border-blue-500 shadow-md rounded-full w-[100px] h-[100px] p-0"
                  />
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
