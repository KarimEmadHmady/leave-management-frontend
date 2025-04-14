"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BackToTopButton from "../components/BackToTopButton";

export default function Leaves() {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [leaveType, setLeaveType] = useState("annual");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchLeaveRequests = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
            router.push("/login");
            return;
            }
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/leaves/me`, {
            headers: { Authorization: `Bearer ${token}` },
            });
            setLeaveRequests(res.data);
            setLoading(false);
        } catch (err) {
            setError(
            err.response?.data?.message || "Failed to fetch leave requests"
            );
            setLoading(false);
        }
        };
        fetchLeaveRequests();
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/leaves`,
            { leaveType, startDate, endDate, reason },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess("Leave request submitted successfully!");
        setLeaveRequests([res.data.leaveRequest, ...leaveRequests]);
        setLeaveType("annual");
        setStartDate("");
        setEndDate("");
        setReason("");
        setError("");
        } catch (err) {
        setError(err.response?.data?.message || "Failed to submit leave request");
        }
    };

    return (
        <div className="min-h-screen p-6">
            <BackToTopButton />
        <div className="lines">
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-200">
            My Leave Requests
        </h1>

        <div className="bg-dives p-6 rounded-lg shadow-lg mb-8 max-w-lg mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">
            Request a Leave
            </h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-gray-200">Leave Type</label>
                <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full p-2 border rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <option className="bg-gray-800 text-white" value="annual">
                    Annual
                </option>
                <option className="bg-gray-800 text-white" value="sick">
                    Sick
                </option>
                <option className="bg-gray-800 text-white" value="unpaid">
                    Unpaid
                </option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-200">Start Date</label>
                <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
                required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-200">End Date</label>
                <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
                required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-200">Reason (Optional)</label>
                <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            >
                Submit Request
            </button>
            </form>
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
            <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">
                My Requests
            </h2>
            {leaveRequests.length === 0 ? (
                <p className="text-gray-200">No leave requests yet.</p>
            ) : (
                <div className="grid gap-4">
                {leaveRequests.map((request) => (
                    <div
                    key={request._id}
                    className="bg-dives p-4 rounded-lg shadow text-gray-200"
                    >
                    <p>
                        <strong>Type:</strong> {request.leaveType}
                    </p>
                    <p>
                        <strong>Start Date:</strong>{" "}
                        {new Date(request.startDate).toISOString().split("T")[0]}
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
                    {request.adminComment && (
                        <p>
                        <strong>HR Comment:</strong> {request.adminComment}
                        </p>
                    )}
                    </div>
                ))}
                </div>
            )}
            </div>
        )}
        </div>
    );
    }
