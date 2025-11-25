import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Search, ChevronDown } from "lucide-react";
import { useAuth } from "../providers/AuthProvider"; 

export default function Tickets() {
  const auth = useAuth?.() ?? { user: { id: "1", name: "Agent One" } };

  const [tickets, setTickets] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    subject: "",
    customer: "",
    merchant_id: "",
    priority: "Medium",
    category: "General",
  });


  const loadAll = async () => {
    setLoading(true);
    try {
      const [tRes, mRes, oRes] = await Promise.all([
        axios.get("http://localhost:4000/tickets?_sort=created_at&_order=desc"),
        axios.get("http://localhost:4000/merchants"),
        axios.get("http://localhost:4000/orders"),
      ]);
      setTickets(tRes.data || []);
      setMerchants(mRes.data || []);
      setOrders(oRes.data || []);
      setError(null);
    } catch (err) {
      console.error("Failed to load tickets:", err);
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);


  const getMerchantName = (merchant_id) => {
    const m = merchants.find((x) => String(x.id) === String(merchant_id));
    return m ? m.name || m.businessName || `Merchant ${merchant_id}` : `Merchant ${merchant_id}`;
  };


  const getCustomerName = (ticket) => {
    if (ticket.customer) return ticket.customer;
    if (ticket.order_id) {
      const ord = orders.find((o) => String(o.id) === String(ticket.order_id));
      if (ord) return ord.customer || ord.name || `Customer ${ord.id}`;
    }
    // fallback to merchant name if present
    if (ticket.merchant_id) return getMerchantName(ticket.merchant_id);
    return "—";
  };

  // status cycling: open -> in_progress -> resolved
  const nextStatus = (current) => {
    const c = String(current).toLowerCase();
    if (c === "open") return "in_progress";
    if (c === "in_progress") return "resolved";
    return "resolved";
  };

  const updateStatus = async (ticket) => {
    const ns = nextStatus(ticket.status);
    try {
      await axios.patch(`http://localhost:4000/tickets/${ticket.id}`, { status: ns });
      await loadAll();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const createTicket = async (e) => {
    e?.preventDefault();
    if (!createForm.subject.trim()) return;
    const payload = {
      subject: createForm.subject,
      customer: createForm.customer || "",
      merchant_id: createForm.merchant_id || (merchants[0] && merchants[0].id) || "",
      priority: createForm.priority,
      category: createForm.category,
      status: "open",
      assigned_to: auth.user?.id || null,
      created_at: new Date().toISOString().slice(0, 10),
    };

    try {
      await axios.post("http://localhost:4000/tickets", payload);
      setCreateForm({
        subject: "",
        customer: "",
        merchant_id: "",
        priority: "Medium",
        category: "General",
      });
      setCreateOpen(false);
      await loadAll();
    } catch (err) {
      console.error("Failed to create ticket:", err);
      setError("Failed to create ticket");
    }
  };


  const filtered = tickets.filter((t) => {
    const q = search.trim().toLowerCase();
    if (q) {
      const searchable =
        String(t.id || "").toLowerCase() +
        " " +
        String(t.subject || "").toLowerCase() +
        " " +
        String(t.customer || "").toLowerCase() +
        " " +
        String(t.category || "").toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    if (priorityFilter !== "All") {
      if ((t.priority || "Medium").toLowerCase() !== priorityFilter.toLowerCase()) return false;
    }
    return true;
  });

  if (loading) return <div className="p-6">Loading tickets...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;


  const priorityClass = (p) => {
    switch ((p || "Medium").toLowerCase()) {
      case "high":
        return "bg-red-700 text-white";
      case "low":
        return "bg-gray-200 text-gray-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  // styling for status
  const statusClass = (s) => {
    const st = String(s || "open").toLowerCase();
    if (st === "resolved") return "bg-blue-700 text-white";
    if (st === "in_progress") return "bg-gray-200 text-gray-800";
    return "bg-gray-200 text-gray-800";
  };

  return (
    <div className="text-black">
      {/* header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-3xl font-semibold">Support Tickets</h2>
          <p className="text-gray-600">Manage customer support requests</p>
        </div>

        <div className="flex items-center gap-3">
          {/* priority filter */}
          <div className="flex items-center gap-2">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              <option>All</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded"
          >
            <Plus className="w-4 h-4" /> Create Ticket
          </button>
        </div>
      </div>

      {/* search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-gray-300 bg-gray-50 rounded-xl px-4 py-2 flex-1">
            <Search className="text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tickets..."
              className="w-full bg-transparent outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* table */}
        <div className="mt-4 border border-gray-200 rounded-xl shadow-sm bg-white p-0">


          <div
            className="
      max-h-[480px]
      overflow-y-scroll
      overflow-x-auto
      scrollbar-hide
      px-2
    "
          >
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="text-gray-600 border-b">
                  <th className="py-3 text-left px-3">Ticket #</th>
                  <th className="py-3 text-left px-3">Title</th>
                  <th className="py-3 text-left px-3">Customer</th>
                  <th className="py-3 text-left px-3">Priority</th>
                  <th className="py-3 text-left px-3">Status</th>
                  <th className="py-3 text-left px-3">Category</th>
                  <th className="py-3 text-left"></th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((t) => {
                  const ticketId =
                    t.id ||
                    `TKT-${t.created_at?.replace(/-/g, "")}-${Math.floor(Math.random() * 900 + 100)}`;

                  return (
                    <tr
                      key={ticketId}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-3">{ticketId}</td>
                      <td className="py-3 px-3 font-medium">{t.subject}</td>
                      <td className="py-3 px-3">{getCustomerName(t)}</td>
                      <td className="py-3 px-3">
                        <span className={`px-3 py-1 rounded ${priorityClass(t.priority)}`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-3 py-1 rounded ${statusClass(t.status)}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">{t.category}</td>
                      <td className="py-3 text-right px-3">
                        <button
                          onClick={() => updateStatus(t)}
                          className="px-3 py-1 border rounded text-sm"
                        >
                          {t.status === "open"
                            ? "Start"
                            : t.status === "in_progress"
                              ? "Resolve"
                              : "Resolved"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>


      </div>

      {/*  Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg p-6 shadow-lg relative">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold">Create Ticket</h3>
              <button onClick={() => setCreateOpen(false)} className="text-gray-500">✕</button>
            </div>

            <form onSubmit={createTicket} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  required
                  value={createForm.subject}
                  onChange={(e) => setCreateForm((s) => ({ ...s, subject: e.target.value }))}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Payment not processing"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Customer</label>
                  <input
                    value={createForm.customer}
                    onChange={(e) => setCreateForm((s) => ({ ...s, customer: e.target.value }))}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Alice Johnson"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Merchant</label>
                  <select
                    value={createForm.merchant_id}
                    onChange={(e) => setCreateForm((s) => ({ ...s, merchant_id: e.target.value }))}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="">Select merchant</option>
                    {merchants.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name || m.businessName || `Merchant ${m.id}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    value={createForm.priority}
                    onChange={(e) => setCreateForm((s) => ({ ...s, priority: e.target.value }))}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm((s) => ({ ...s, category: e.target.value }))}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option>Payment</option>
                    <option>Order</option>
                    <option>Account</option>
                    <option>General</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">
                    Create Ticket
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
