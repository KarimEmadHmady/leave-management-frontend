"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BackToTopButton from "../components/BackToTopButton";

export default function AdminDashboard() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [remoteWorkRequests, setRemoteWorkRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        setLoading(true);

        const leaveRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/leaves`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const reversedLeaves = leaveRes.data;
        setLeaveRequests(reversedLeaves);

        const remoteRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/remote`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const reversedRemote = remoteRes.data;
        setRemoteWorkRequests(reversedRemote);

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleLeaveStatus = async (id, status) => {
    const adminComment = prompt(`Enter comment for ${status} request:`) || "";

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/leaves/${id}`,
        { status, adminComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLeaveRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === id ? { ...request, status, adminComment } : request
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleRemoteStatus = async (id, status) => {
    const adminComment = prompt(`Enter comment for ${status} request:`) || "";

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/remote/${id}/${status}`,
        { comment: adminComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRemoteWorkRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === id
            ? { ...request, status, comment: adminComment }
            : request
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="min-h-screen p-6">
      <BackToTopButton />
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-200">
        Admin Dashboard
      </h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-200">
              Leave Requests
            </h2>
            {leaveRequests.length === 0 ? (
              <p className="text-gray-200">No leave requests yet.</p>
            ) : (
              <div className="grid gap-4 ">
                {leaveRequests.map((request) => (
                  <div
                    key={request._id}
                    className="bg-dives p-4 rounded-lg shadow"
                  >
                    <p>
                      <strong>User:</strong>{" "}
                      {request.userId ? request.userId.name : "N/A"}
                    </p>
                    <p>
                      <strong>Type:</strong> {request.leaveType}
                    </p>
                    <p>
                      <strong>Start Date:</strong>{" "}
                      {new Date(request.startDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>End Date:</strong>{" "}
                      {new Date(request.endDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Reason:</strong> {request.reason || "N/A"}
                    </p>
                    <p>
                      <strong>Status:</strong> {request.status}
                    </p>
                    {request.status === "pending" && (
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() =>
                            handleLeaveStatus(request._id, "approve")
                          }
                          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleLeaveStatus(request._id, "reject")
                          }
                          className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-200">
              Remote Work Requests
            </h2>
            {remoteWorkRequests.length === 0 ? (
              <p className="text-gray-200">No remote work requests yet.</p>
            ) : (
              <div className="grid gap-4">
                {remoteWorkRequests.map((request) => (
                  <div
                    key={request._id}
                    className="bg-dives p-4 rounded-lg shadow"
                  >
                    <p>
                      <strong>User:</strong>{" "}
                      {request.userId ? request.userId.name : "N/A"}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(request.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Reason:</strong> {request.reason}
                    </p>
                    <p>
                      <strong>Status:</strong> {request.status}
                    </p>
                    {request.status === "pending" && (
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() =>
                            handleRemoteStatus(request._id, "approve")
                          }
                          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleRemoteStatus(request._id, "reject")
                          }
                          className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
