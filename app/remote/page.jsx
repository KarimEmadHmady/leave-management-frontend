"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image"; 
import BackToTopButton from "../components/BackToTopButton";

export default function RemoteWork() {
    const [requests, setRequests] = useState([]);
    const [date, setDate] = useState("");
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true); 
    const router = useRouter();

    useEffect(() => {
        const fetchRemoteRequests = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    router.push("/login");
                    return;
                }
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/remote/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRequests(res.data);
                setLoading(false); 
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch requests");
                setLoading(false); 
            }
        };
        fetchRemoteRequests();
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/remote`,
                { date, reason },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess("Remote work request submitted!");
            setRequests([res.data, ...requests]);
            setDate("");
            setReason("");
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit request");
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
                Remote Work Requests
            </h1>

            <div className="bg-dives p-6 rounded-lg shadow-lg mb-8 max-w-lg mx-auto">
                <h2 className="text-xl font-semibold mb-4 text-gray-200">
                    Request Remote Work
                </h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-200">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
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
                    <div className="flex justify-between items-center gap-2">
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                    >
                        Submit Request
                    </button>
                    <button
                        onClick={() => router.push("/")} // الذهاب إلى الصفحة الرئيسية
                        className="py-2 px-4 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-xl shadow-sm transition-all flex items-center gap-2"
                        >
                        Back
                    </button>
                    </div>
                </form>
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
                    <p className="text-gray-200 ml-4">Loading...</p>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-xl font-semibold mb-4 text-gray-200">
                        My Remote Work Days
                    </h2>
                    {requests.length === 0 ? (
                        <p className="text-gray-200">No remote work requests yet.</p>
                    ) : (
                        <div className="grid gap-4">
                            {requests.map((req) => (
                                <div
                                    key={req._id}
                                    className="bg-dives p-4 rounded-lg shadow text-gray-200"
                                >
                                    <p>
                                        <strong>Date:</strong>{" "}
                                        {new Date(req.date).toISOString().split("T")[0]}
                                    </p>
                                    <p>
                                        <strong>Reason:</strong> {req.reason || "N/A"}
                                    </p>
                                    <p>
                                        <strong>Status:</strong> {req.status}
                                    </p>
                                    {req.adminComment && (
                                        <p>
                                            <strong>HR Comment:</strong> {req.adminComment}
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
