"use client";

import { FormEvent, useState } from "react";
import { submitRefund } from "@/lib/api";
import { RefundResponse } from "@/types/refund";

export default function RefundForm() {
    const [email, setEmail] = useState("");
    const [order_id, setOrderId] = useState("");
    const [reason, setReason] = useState("");
    const [response, setResponse] = useState<RefundResponse | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const result = await submitRefund({
            email,
            order_id,
            reason,
        });

        setResponse(result);

const existingRequests = JSON.parse(
  localStorage.getItem("refundRequests") || "[]"
);

existingRequests.unshift({
  email,
  order: order_id,
  status: result.status,
  message: result.message,
  logs: result.logs,
  timestamp: new Date().toLocaleString(),
});

localStorage.setItem(
  "refundRequests",
  JSON.stringify(existingRequests)
);
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    className="w-full border rounded-lg p-3"
                    type="email"
                    placeholder="Customer Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    className="w-full border rounded-lg p-3"
                    placeholder="Order ID"
                    value={order_id}
                    onChange={(e) => setOrderId(e.target.value)}
                />

                <textarea
                    className="w-full border rounded-lg p-3"
                    placeholder="Reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />

                <button
                    type="submit"
                    className="w-full bg-black text-white p-3 rounded-lg"
                >
                    Submit Refund Request
                </button>
            </form>

            {response && (
                <div className="mt-6 border rounded-lg p-4 bg-white">
                    <div className="mb-3">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${response.status === "success"
                                    ? "bg-green-100 text-green-700"
                                    : response.status === "denied"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }`}
                        >
                            {response.status.toUpperCase()}
                        </span>
                    </div>

                    <p className="font-medium mb-4">
                        {response.message}
                    </p>

                </div>
            )}
        </div>
    );
}