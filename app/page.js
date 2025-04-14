"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveBalance = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLeaveBalance(res.data.leaveBalance);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchLeaveBalance();
  }, [router]);

  return (
    <div className="p-6 text-white">
      <div className="lines">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Image
            src="/logo.png"
            alt="Company Logo"
            width={100}
            height={30}
            className="hover:opacity-80 transition"
          />
          <p className="text-gray-200 ml-4">Loading...</p>
        </div>
      ) : (
        leaveBalance && (
          <div className="mt-8 bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-blue-400">
              Remaining Leave Balance
            </h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow-md font-semibold">
                <p>Annual Leave: {leaveBalance.annual} days</p>
              </div>
              <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow-md font-semibold">
                <p>Sick Leave: {leaveBalance.sick} days</p>
              </div>
              <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-md font-semibold">
                <p>Unpaid Leave: {leaveBalance.unpaid} days</p>
              </div>
            </div>
          </div>
        )
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center p-5">
        <button
          onClick={() => router.push("/leaves")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          Leave Requests
        </button>

        <button
          onClick={() => router.push("/remote")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          Remote Work Requests
        </button>
      </div>
    </div>
  );
}

