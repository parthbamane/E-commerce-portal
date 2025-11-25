import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../providers/AuthProvider";

export default function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    merchants: 0,
    pendingMerchants: 0,
    orders: 0,
    revenue: 0,
    tickets: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const merchants = (await axios.get("http://localhost:4000/merchants")).data;
      const orders = (await axios.get("http://localhost:4000/orders?_sort=created_at&_order=desc")).data;
      const tickets = (await axios.get("http://localhost:4000/tickets")).data;

      let revenue = orders.reduce((sum, o) => sum + Number(o.amount || 0), 0);

      setStats({
        merchants: merchants.length,
        pendingMerchants: merchants.filter((m) => m.status === "pending").length,
        orders: orders.length,
        revenue,
        tickets: tickets.filter((t) => t.status === "open").length,
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-10">

      {/* Header */}
      <h2 className="text-3xl font-bold tracking-tight text-gray-800">
        Dashboard Overview
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
        <StatCard title="Total Merchants" value={stats.merchants} color="sky" />
        <StatCard title="Pending Merchants" value={stats.pendingMerchants} color="yellow" />
        <StatCard title="Total Orders" value={stats.orders} color="indigo" />
        <StatCard title="Open Tickets" value={stats.tickets} color="rose" />
        <StatCard title="Revenue" value={`$${stats.revenue.toFixed(2)}`} color="emerald" />
      </div>

 {/* RECENT ORDERS*/}
<div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">

  <div className="flex items-center justify-between mb-4">
    <h3 className="text-xl font-semibold text-gray-800">Recent Orders</h3>

    <a
      href="/orders"
      className="text-blue-600 text-sm hover:underline font-medium"
    >
      View all →
    </a>
  </div>

  <table className="w-full text-sm">
    <thead>
      <tr className="text-gray-500 border-b">
        <th className="text-left py-2">Order #</th>
        <th className="text-left py-2">Customer</th>
        <th className="text-left py-2">Amount</th>
        <th className="text-left py-2">Status</th>
      </tr>
    </thead>

    <tbody>
      {recentOrders.slice(0, 3).map((o) => (
        <tr
          key={o.id}
          className="border-b last:border-none hover:bg-gray-50 transition"
        >
          <td className="py-3 font-medium text-gray-800">{o.id}</td>

          <td className="py-3 text-gray-800">
            {o.customer || "Unknown"}
          </td>

          <td className="py-3 font-semibold text-gray-900">
            ${Number(o.amount || 0).toFixed(2)}
          </td>

          <td className="py-3">
            <span
              className={`
                px-3 py-1 rounded-full text-xs font-semibold
                ${
                  o.status === "delivered"
                    ? "bg-emerald-100 text-emerald-700"
                    : o.status === "shipped"
                    ? "bg-blue-100 text-blue-700"
                    : o.status === "processing"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-200 text-gray-700"
                }
              `}
            >
              {o.status}
            </span>
          </td>
        </tr>
      ))}

      {recentOrders.length === 0 && (
        <tr>
          <td colSpan="4" className="text-center py-6 text-gray-500">
            No recent orders found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          Quick Actions
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <QuickLink to="/orders" label="View Orders" />
          <QuickLink to="/merchants" label="Merchant Onboarding" />
          <QuickLink to="/tickets" label="Support Tickets" />
          <QuickLink to="/reconciliation" label="Reconciliation" />
        </div>
      </div>
    </div>
    
  );
}


{/*STAT CARD COMPONENT*/}

function StatCard({ title, value, color }) {
  const colors = {
    sky: "from-sky-400/10 to-sky-400/30 text-sky-700 border-sky-200",
    yellow: "from-yellow-400/10 to-yellow-400/30 text-yellow-700 border-yellow-200",
    indigo: "from-indigo-400/10 to-indigo-400/30 text-indigo-700 border-indigo-200",
    rose: "from-rose-400/10 to-rose-400/30 text-rose-700 border-rose-200",
    emerald: "from-emerald-400/10 to-emerald-400/30 text-emerald-700 border-emerald-200",
  };

  return (
    <div
      className={`
        p-5 rounded-xl shadow-sm border bg-linear-to-br
        ${colors[color]}
      `}
    >
      <div className="text-sm font-medium">{title}</div>
      <div className="text-3xl font-bold mt-1">{value}</div>
    </div>
  );
}


{/*QUICK LINK BUTTON*/}


function QuickLink({ to, label }) {
  return (
    <a
      href={to}
      className="
        p-4 bg-white rounded-lg shadow border border-gray-200 
        text-center text-gray-700 font-medium hover:bg-gray-50 hover:shadow-md
        transition-all
      "
    >
      {label}
    </a>
  );
}
