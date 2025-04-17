"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">All Users</h1>
        <Link
          href="/admin/users/create"
          className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition-all duration-300"
        >
          Create User
        </Link>
      </div>

      {/* حقل البحث */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-screen flex-col gap-3.5">
          <Image
            src="/logo.png"
            alt="Company Logo"
            width={100}
            height={30}
            className="hover:opacity-80 transition"
          />
          <p className="text-gray-200 ml-4">Loading users...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <Link
              href={`/admin/users/${user._id}`}
              key={user._id}
              className="bg-blue-100 shadow-lg hover:shadow-xl transition-all rounded-2xl p-6 transform hover:scale-105 p-[15px]"
            >
              <div className="flex items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-semibold text-blue-400">
                    {user.name}
                  </h2>
                  <p className="text-blue-400">{user.jobTitle || "No Job Title"}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="relative w-[80px] h-[80px]">
                  {user.profileImage && (
                    <Image
                      src={user.profileImage}
                      alt={`${user.name}'s Profile`}
                      width={80}
                      height={80}
                      className="rounded-full object-cover border-4 border-blue-500 shadow-md w-full h-full"
                    />
                  )}
                  {user.employeeStatus === "active" && (
                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                  {user.employeeStatus === "resigned" && (
                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersPage;
