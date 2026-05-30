"use client";
import { useEffect, useState } from "react";
const defaultRequests = [
    { id: "REQ-1023", customer: "Alice Smith", order: "ORD001", amount: "$550.00", status: "Approved", submitted: "2h ago" },
    { id: "REQ-1024", customer: "Bob Johnson", order: "ORD010", amount: "$1,800.00", status: "Escalated", submitted: "4h ago" },
    { id: "REQ-1025", customer: "Charlie Davis", order: "ORD003", amount: "$45.99", status: "Denied", submitted: "6h ago" },
    { id: "REQ-1026", customer: "Diana Prince", order: "ORD005", amount: "$299.99", status: "Approved", submitted: "9h ago" },
    { id: "REQ-1027", customer: "Edward Norton", order: "ORD014", amount: "$129.99", status: "Pending", submitted: "12h ago" },
    { id: "REQ-1028", customer: "Fiona Gallagher", order: "ORD007", amount: "$850.00", status: "Approved", submitted: "1d ago" },
];

const activity = [
    { time: "Just now", text: "Refund request REQ-1028 approved by AI agent." },
    { time: "30m ago", text: "Order ORD010 flagged for escalation due to high value." },
    { time: "1h ago", text: "Agent executed final validation on REQ-1024." },
    { time: "3h ago", text: "New refund request submitted for ORD005." },
    { time: "5h ago", text: "Denied request REQ-1025 due to final sale policy." },
];


const statusStyles: Record<string, string> = {
    Approved: "bg-emerald-100 text-emerald-700",
    Denied: "bg-rose-100 text-rose-700",
    Escalated: "bg-amber-100 text-amber-700",
    Pending: "bg-slate-100 text-slate-700",
};

export default function AdminPage() {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [requests, setRequests] = useState<any[]>([]);
    const latestRequest = requests[0];
    const recentActivity = requests.flatMap((request: any) =>
        (request.logs || []).map((log: any) => ({
            time: request.submitted,
            text: typeof log === "string" ? log : log.message,
        }))
    ).slice(0, 10);
    const stats = {
        total: requests.length,
        approved: requests.filter((item) => item.status === "Approved" ||
      item.status === "Success").length,
        denied: requests.filter((item) => item.status === "Denied").length,
        escalated: requests.filter((item) => item.status === "Escalated").length,
    };
    useEffect(() => {
  const isAdmin = localStorage.getItem("adminAuth");

  if (isAdmin === "true") {
    setAuthenticated(true);
  }

  const stored = localStorage.getItem("refundRequests");

        if (stored) {
            try {
                const parsed = JSON.parse(stored);

                const formatted = parsed.map(
                    (item: any, index: number) => ({
                        id: `REQ-${3000 + index}`,
                        customer: item.email,
                        order: item.order,
                        amount: "-",
                        status:
                            item.status.charAt(0).toUpperCase() +
                            item.status.slice(1),
                        submitted: item.timestamp,
                        logs: item.logs || [],
                    })
                );

                setRequests(formatted);
            } catch (error) {
                console.error(error);
            }
            } else {
  setRequests([]);
        }
    }, []);
    if (!authenticated) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-4">
                        Admin Login
                    </h1>

                    <input
                        type="password"
                        placeholder="Enter admin password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded-lg p-3 mb-4"
                    />

                    <button
                        onClick={() => {
                            if (password === "admin123") {
                                localStorage.setItem("adminAuth", "true");
                                setAuthenticated(true);
                            } else {
                                alert("Wrong password");
                            }
                        }}
                        className="w-full bg-black text-white p-3 rounded-lg"
                    >
                        Login
                    </button>
                </div>
            </main>
        );
    }
    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-6">
  <h1 className="text-3xl font-bold">
    AI Refund Agent Dashboard
  </h1>

  <div className="flex gap-3">
  <a
    href="/"
    className="bg-black text-white px-4 py-2 rounded-lg"
  >
    Customer Portal
  </a>

  <button
    onClick={() => {
      if (confirm("Clear all refund history?")) {
        localStorage.removeItem("refundRequests");
        location.reload();
      }
    }}
    className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
  >
    Clear History
  </button>

  <button
    onClick={() => {
      if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("adminAuth");
        location.reload();
      }
    }}
    className="bg-red-500 text-white px-4 py-2 rounded-lg"
  >
    Logout
  </button>
</div>
</div>
{latestRequest && (
  <div className="bg-white rounded-lg shadow p-6 mb-6">
    <h2 className="text-xl font-semibold mb-4">
      Latest AI Decision
    </h2>

    <div className="space-y-2">
      <p>
        <strong>Customer:</strong> {latestRequest.customer}
      </p>

      <p>
        <strong>Order:</strong> {latestRequest.order}
      </p>

      <p>
        <strong>Status:</strong> {latestRequest.status}
      </p>

      <p>
        <strong>Time:</strong> {latestRequest.submitted}
      </p>
    </div>
  </div>
)}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-500">Total Requests</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-500">Approved</p>
                    <p className="text-2xl font-bold text-green-600">
                        {stats.approved}
                    </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-500">Denied</p>
                    <p className="text-2xl font-bold text-red-600">
                        {stats.denied}
                    </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-500">Escalated</p>
                    <p className="text-2xl font-bold text-yellow-600">
                        {stats.escalated}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Recent Requests
                </h2>

                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-2">Customer</th>
                            <th className="text-left py-2">Order</th>
                            <th className="text-left py-2">Status</th>
                            <th className="text-left py-2">Submitted</th>
                        </tr>
                    </thead>

                    <tbody>
                        {requests.map((request) => (
                            <tr key={request.id} className="border-b">
                                <td className="py-3">{request.customer}</td>
                                <td>{request.order}</td>
                                <td>
                                    <span
                                        className={`px-2 py-1 rounded text-xs ${statusStyles[request.status] ||
                                            "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {request.status}
                                    </span>
                                </td>
                                <td>{request.submitted}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="bg-white rounded-lg shadow p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">
                    Recent Agent Activity
                </h2>

                <div className="space-y-3">
                    {recentActivity.map((item, index) => (
                        <div
                            key={index}
                            className="border-l-4 border-blue-500 pl-3 py-2"
                        >
                            <div className="font-medium">
                                {item.text}
                            </div>

                            <div className="text-xs text-gray-400">
                                {item.time}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}