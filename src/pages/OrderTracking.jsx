import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, X } from "lucide-react";

export default function OrderTracking() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [toast, setToast] = useState({ show: false, message: "" });

  const fetchOrders = async () => {
    const res = await axios.get(
      "http://localhost:4000/orders?_sort=created_at&_order=desc"
    );
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ||
      o.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });


  const updateStatus = async (id, status) => {
    await axios.patch(`http://localhost:4000/orders/${id}`, { status });
    fetchOrders();

    if (selected?.id === id) {
      setSelected({ ...selected, status });
    }

    setToast({ show: true, message: "Order status has been updated successfully." });

    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000);
  };

  return (
    <div className="text-black">

      {/* PAGE HEADER */}
      <h2 className="text-3xl font-semibold mb-1">Order Tracking</h2>
      <p className="text-gray-600 mb-6">Monitor and manage all customer orders</p>

      <div className="grid grid-cols-2 gap-6">

      {/* LEFT SIDE LIST */}
<div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">

  {/* SEARCH + FILTER */}
  <div className="flex gap-3 mb-4">
    {/* Search */}
    <div className="flex items-center gap-2 border border-gray-300 bg-gray-50 rounded-xl px-3 py-2 flex-1">
      <Search className="text-gray-500 w-5 h-5" />
      <input
        type="text"
        placeholder="Search orders..."
        className="w-full bg-transparent outline-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    {/* Status Filter */}
    <select
      className="border border-gray-300 rounded-xl px-3 py-2 text-gray-700"
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option>All</option>
      <option>pending</option>
      <option>processing</option>
      <option>shipped</option>
      <option>delivered</option>
    </select>
  </div>

  {/* Scrollbox only for orders*/}
  <div className="max-h-[450px] overflow-y-auto overflow-x-auto scrollbar-hide rounded-lg">

    <table className="w-full text-sm">
      <thead className="bg-gray-50 sticky top-0 z-10">
        <tr className="text-gray-600 border-b">
          <th className="py-3 px-3 text-left">Order #</th>
          <th className="text-left px-3">Customer</th>
          <th className="text-left px-3">Status</th>
          <th className="text-left px-3">Amount</th>
        </tr>
      </thead>

      <tbody>
        {filteredOrders.map((o) => (
          <tr
            key={o.id}
            onClick={() => setSelected(o)}
            className="border-b cursor-pointer hover:bg-gray-100 transition"
          >
            <td className="py-3 px-3">{o.id}</td>
            <td className="px-3">{o.customer}</td>
            <td className="px-3">
              <span
                className={`
                  px-3 py-1 rounded-md text-xs
                  ${
                    o.status === "shipped"
                      ? "bg-blue-600 text-white"
                      : o.status === "processing"
                      ? "bg-gray-300"
                      : "bg-gray-200"
                  }
                `}
              >
                {o.status}
              </span>
            </td>
            <td className="px-3">${Number(o.amount).toFixed(2)}</td>
          </tr>
        ))}

        {filteredOrders.length === 0 && (
          <tr>
            <td className="py-6 text-center text-gray-500" colSpan="4">
              No orders found.
            </td>
          </tr>
        )}
      </tbody>
    </table>

  </div>
</div>


        {/* RIGHT SIDE DETAILS*/}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          {!selected ? (
            <p className="text-gray-500 py-10 text-center">
              Select an order to view details.
            </p>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-4">📦 Order Details</h3>

              <div className="space-y-3 text-sm">
                <Detail label="Order Number" value={selected.id} />
                <Detail label="Customer" value={selected.customer} />
                <Detail label="Merchant" value={selected.merchant} />
                <Detail
                  label="Status"
                  value={
                    <span className="bg-gray-200 px-3 py-1 rounded-md text-sm">
                      {selected.status}
                    </span>
                  }
                />
                <Detail
                  label="Total Amount"
                  value={<span className="text-lg font-bold">${selected.amount}</span>}
                />
                <Detail label="Items" value={`${selected.items?.length || 0} items`} />
                <Detail label="Created" value={selected.created_at} />
              </div>

              {/* Update Status */}
              <button
                className="bg-blue-700 text-white px-6 py-3 rounded-lg w-full mt-6 flex items-center justify-center gap-2"
                onClick={() => {
                  const next =
                    selected.status === "processing"
                      ? "shipped"
                      : selected.status === "shipped"
                      ? "delivered"
                      : "delivered";

                  updateStatus(selected.id, next);
                }}
              >
                Update Status →
              </button>
            </>
          )}
        </div>
      </div>

      {/* TOAST  */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 bg-white shadow-xl border border-gray-200 rounded-lg px-5 py-4 animate-fadeIn flex items-start gap-3 w-80">
          <div>
            <p className="font-semibold text-gray-900">Order Updated</p>
            <p className="text-gray-600 text-sm">{toast.message}</p>
          </div>

          <button onClick={() => setToast({ show: false, message: "" })}>
            <X className="w-5 h-5 text-gray-400 hover:text-black" />
          </button>
        </div>
      )}
    </div>
  );
}

{/* SMALL REUSABLE COMPONENT */}
function Detail({ label, value }) {
  return (
    <div>
      <p className="text-gray-600">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
