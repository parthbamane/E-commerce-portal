import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, CheckCircle, X } from "lucide-react";

export default function Reconciliation() {
  const [recs, setRecs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedIds, setSelectedIds] = useState([]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const loadRecs = async () => {
    try {
      const r = await axios.get(
        "http://localhost:4000/reconciliations?_sort=date&_order=desc"
      );
      setRecs(r.data);
    } catch (err) {
      setError("Failed to load reconciliation records");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRecs();
  }, []);

  // Summary
  const unreconciledCount = recs.filter((r) => !r.reconciled).length;
  const totalAmount = recs.reduce((sum, r) => sum + Number(r.amount || 0), 0);

  // Search 
  const filtered = recs.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.transaction_id?.toLowerCase().includes(q) ||
      r.order_id?.toLowerCase().includes(q) ||
      r.method?.toLowerCase().includes(q) ||
      String(r.amount).includes(q) ||
      r.status?.toLowerCase().includes(q)
    );
  });

  // Toggle selection
  const toggleSelect = (id) => {
    const row = recs.find((r) => r.id === id);
    if (row.reconciled) return; 

    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  // Reconcile selected
  const reconcileSelected = async () => {
    for (const id of selectedIds) {
      await axios.patch(`http://localhost:4000/reconciliations/${id}`, {
        status: "balanced",
        reconciled: true,
      });
    }

    setToast({
      show: true,
      msg: `${selectedIds.length} transaction(s) have been reconciled successfully.`,
    });

    setSelectedIds([]);
    loadRecs();

    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  };

  if (loading) return <div>Loading reconciliation records...</div>;
  if (error) return <div className="text-red-600 p-4 font-medium">{error}</div>;

  return (
    <div className="text-black">

      {/* PAGE HEADER */}
      <h2 className="text-3xl font-semibold mb-1">Payment Reconciliation</h2>
      <p className="text-gray-600 mb-6">Manage and reconcile payment transactions</p>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        <SummaryCard title="Unreconciled" value={unreconciledCount} desc="Transactions pending" />
        <SummaryCard title="Total Amount" value={`$${totalAmount.toFixed(2)}`} desc="Total processed amount" />
        <SummaryCard title="Success Rate" value="98.4%" desc="Last 30 days" />
      </div>

      {/* TOP BAR */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3 border border-gray-300 bg-gray-50 rounded-xl px-4 py-2 w-1/2">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full bg-transparent outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {selectedIds.length > 0 && (
          <button
            onClick={reconcileSelected}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
          >
            Reconcile ({selectedIds.length})
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">

        <div
          className="
      max-h-[480px]
      overflow-y-scroll
      overflow-x-auto
      scrollbar-hide
      pr-2
    "
        >
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="text-gray-600 border-b text-left">
                <th className="py-3 px-3 w-10"></th>
                <th className="py-3 px-3">Transaction ID</th>
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Method</th>
                <th className="py-3 px-3">Reconciled</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50 transition">

                  {/* Checkbox */}
                  <td className="py-3 px-3">
                    <input
                      type="checkbox"
                      disabled={r.reconciled}
                      checked={selectedIds.includes(r.id)}
                      onChange={() => toggleSelect(r.id)}
                      className={`w-4 h-4 cursor-pointer ${r.reconciled ? "opacity-40 cursor-not-allowed" : ""
                        }`}
                    />
                  </td>

                  <td className="py-3 px-3">{r.transaction_id}</td>
                  <td className="py-3 px-3">{r.order_id}</td>

                  <td className="py-3 px-3 font-medium">
                    ${Number(r.amount).toFixed(2)}
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`px-3 py-1 rounded-md text-xs ${r.reconciled
                          ? "bg-blue-600 text-white"
                          : "bg-gray-300 text-gray-800"
                        }`}
                    >
                      {r.reconciled ? "Completed" : "Pending"}
                    </span>
                  </td>

                  <td className="py-3 px-3">{r.method}</td>

                  <td className="py-3 px-3">
                    {r.reconciled ? (
                      <CheckCircle className="text-green-500 w-5 h-5" />
                    ) : (
                      <div className="w-3 h-3 border border-gray-400 rounded-full"></div>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* TOAST */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 bg-white shadow-xl border border-gray-200 rounded-lg px-5 py-4 flex items-start gap-3 w-96">
          <div>
            <p className="font-semibold text-gray-900">Transactions Reconciled</p>
            <p className="text-gray-600 text-sm">{toast.msg}</p>
          </div>
          <button onClick={() => setToast({ show: false, msg: "" })}>
            <X className="w-5 h-5 text-gray-400 hover:text-black" />
          </button>
        </div>
      )}

    </div>
  );
}

{/* Summary Card */}
function SummaryCard({ title, value, desc }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-gray-400 text-xs mt-1">{desc}</p>
    </div>
  );
}
