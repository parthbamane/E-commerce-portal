import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, X, Upload } from "lucide-react";

export default function MerchantOnboarding() {
  const [merchants, setMerchants] = useState([]);
  const [search, setSearch] = useState("");


  const [openWizard, setOpenWizard] = useState(false);
  const [step, setStep] = useState(1);


  const [form, setForm] = useState({
    businessName: "",
    businessType: "",
    businessAddress: "",
    taxId: "",

    contactName: "",
    contactEmail: "",
    contactPhone: "",

    documents: {
      idProof: null,
      businessLicense: null,
    },
  });

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    const res = await axios.get(
      "http://localhost:4000/merchants?_sort=created_at&_order=desc"
    );
    setMerchants(res.data);
  };

  const updateStatus = async (id, status) => {
    await axios.patch(`http://localhost:4000/merchants/${id}`, { status });
    fetchList();
  };

  const filtered = merchants.filter((m) =>
    m.businessName?.toLowerCase().includes(search.toLowerCase())
  );


  const submitMerchant = async () => {
    await axios.post("http://localhost:4000/merchants", {
      ...form,
      status: "pending",
      created_at: new Date().toISOString().slice(0, 10),
    });


    setForm({
      businessName: "",
      businessType: "",
      businessAddress: "",
      taxId: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      documents: { idProof: null, businessLicense: null },
    });
    setStep(1);
    setOpenWizard(false);
    fetchList();
  };


  const handleFile = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({
      ...form,
      documents: { ...form.documents, [key]: file.name },
    });
  };

  return (
    <div className="text-black">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Merchant Onboarding</h2>

        <button
          onClick={() => setOpenWizard(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          + Add Merchant
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center gap-2 border border-gray-300 bg-gray-50 rounded-xl px-4 py-3">
          <Search className="text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search merchants..."
            className="w-full outline-none bg-transparent text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
    {/* TABLE */}
<div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">

  {/* Scroll only inside table */}
  <div className="max-h-[450px] overflow-y-scroll overflow-x-auto scrollbar-hide">

    <table className="w-full table-auto">
      <thead className="bg-gray-50 sticky top-0 z-10">
        <tr className="text-left text-sm text-gray-700 border-b">
          <th className="py-3 px-3">Business Name</th>
          <th className="py-3 px-3">Type</th>
          <th className="py-3 px-3">Status</th>
          <th className="py-3 px-3 text-right">Action</th>
        </tr>
      </thead>

      <tbody className="text-black">
        {filtered.map((m) => (
          <tr
            key={m.id}
            className="border-b hover:bg-gray-50 transition"
          >
            <td className="py-3 px-3 font-medium">
              {m.businessName || m.name}
            </td>

            <td className="py-3 px-3 capitalize">
              {m.businessType || "—"}
            </td>

            <td className="py-3 px-3">
              <span
                className={`px-3 py-1 rounded text-xs ${
                  m.status === "active"
                    ? "bg-green-600 text-white"
                    : m.status === "rejected"
                    ? "bg-red-600 text-white"
                    : "bg-gray-300 text-gray-800"
                }`}
              >
                {m.status}
              </span>
            </td>

            <td className="py-3 px-3 text-right">
              <button
                onClick={() => updateStatus(m.id, "active")}
                className="text-sm mr-2 px-3 py-1 bg-blue-600 text-white rounded"
              >
                Approve
              </button>

              <button
                onClick={() => updateStatus(m.id, "rejected")}
                className="text-sm px-3 py-1 bg-gray-300 rounded"
              >
                Reject
              </button>
            </td>
          </tr>
        ))}

        {filtered.length === 0 && (
          <tr>
            <td
              colSpan="4"
              className="text-center py-6 text-gray-500 italic"
            >
              No merchants found.
            </td>
          </tr>
        )}
      </tbody>
    </table>

  </div>
</div>


      {/* WIZARD MODAL */}
      {openWizard && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[750px] p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">


            <button
              onClick={() => setOpenWizard(false)}
              className="absolute top-4 right-4"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            {/* Title */}
            <h3 className="text-xl font-semibold mb-1">
              {step === 1 && "Business Info"}
              {step === 2 && "Contact Details"}
              {step === 3 && "Documentation"}
              {step === 4 && "Review & Submit"}
            </h3>
            <p className="text-gray-500 mb-6">Step {step} of 4</p>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4">

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Business Name *
                  </label>
                  <input
                    className="w-full border rounded-lg p-3"
                    value={form.businessName}
                    onChange={(e) =>
                      setForm({ ...form, businessName: e.target.value })
                    }
                    placeholder="Enter your business name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Business Type *
                  </label>
                  <select
                    className="w-full border rounded-lg p-3"
                    value={form.businessType}
                    onChange={(e) =>
                      setForm({ ...form, businessType: e.target.value })
                    }
                  >
                    <option value="">Select business type</option>
                    <option value="retail">Retail</option>
                    <option value="services">Services</option>
                    <option value="online">Online</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Business Address
                  </label>
                  <textarea
                    className="w-full border rounded-lg p-3"
                    rows="2"
                    value={form.businessAddress}
                    onChange={(e) =>
                      setForm({ ...form, businessAddress: e.target.value })
                    }
                    placeholder="Enter your business address"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Tax ID / Registration Number
                  </label>
                  <input
                    className="w-full border rounded-lg p-3"
                    value={form.taxId}
                    onChange={(e) => setForm({ ...form, taxId: e.target.value })}
                    placeholder="Enter tax ID"
                  />
                </div>

                <button
                  disabled={!form.businessName || !form.businessType}
                  onClick={() => setStep(2)}
                  className={`px-5 py-2 rounded mt-4 float-right
    ${!form.businessName || !form.businessType
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 text-white"}`}
                >
                  Next →
                </button>

              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-4">

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Contact Name *
                  </label>
                  <input
                    className="w-full border rounded-lg p-3"
                    value={form.contactName}
                    onChange={(e) =>
                      setForm({ ...form, contactName: e.target.value })
                    }
                    placeholder="Enter contact person name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Email *
                  </label>
                  <input
                    className="w-full border rounded-lg p-3"
                    value={form.contactEmail}
                    onChange={(e) =>
                      setForm({ ...form, contactEmail: e.target.value })
                    }
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    className="w-full border rounded-lg p-3"
                    value={form.contactPhone}
                    onChange={(e) =>
                      setForm({ ...form, contactPhone: e.target.value })
                    }
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    className="px-4 py-2 border rounded"
                    onClick={() => setStep(1)}
                  >
                    ← Back
                  </button>
                  <button
                    disabled={!form.contactName || !form.contactEmail}
                    className={`px-4 py-2 rounded
    ${!form.contactName || !form.contactEmail
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-600 text-white"}`}
                    onClick={() => {
                      if (form.contactName && form.contactEmail) setStep(3);
                    }}
                  >
                    Next →
                  </button>

                </div>
              </div>
            )}

            {/* STEP 3  */}
            {step === 3 && (
              <div className="space-y-6">

                {/* ID PROOF */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Government ID Proof
                  </label>

                  <label className="w-full border rounded-lg p-3 flex items-center gap-3 cursor-pointer bg-gray-50">
                    <Upload className="w-5 h-5 text-gray-600" />
                    <span>
                      {form.documents.idProof
                        ? form.documents.idProof
                        : "Upload ID Proof"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFile(e, "idProof")}
                    />
                  </label>
                </div>

                {/* BUSINESS LICENSE */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Business License
                  </label>

                  <label className="w-full border rounded-lg p-3 flex items-center gap-3 cursor-pointer bg-gray-50">
                    <Upload className="w-5 h-5 text-gray-600" />
                    <span>
                      {form.documents.businessLicense
                        ? form.documents.businessLicense
                        : "Upload Business License"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFile(e, "businessLicense")}
                    />
                  </label>
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    className="px-4 py-2 border rounded"
                    onClick={() => setStep(2)}
                  >
                    ← Back
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={() => setStep(4)}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4  */}
            {step === 4 && (
              <div className="space-y-6">

                <h3 className="text-gray-800 font-semibold text-lg">
                  Review Information
                </h3>

                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <p><strong>Business Name:</strong> {form.businessName}</p>
                  <p><strong>Type:</strong> {form.businessType}</p>
                  <p><strong>Address:</strong> {form.businessAddress}</p>
                  <p><strong>Tax ID:</strong> {form.taxId}</p>
                  <p><strong>Contact Name:</strong> {form.contactName}</p>
                  <p><strong>Email:</strong> {form.contactEmail}</p>
                  <p><strong>Phone:</strong> {form.contactPhone}</p>
                  <p><strong>ID Proof:</strong> {form.documents.idProof}</p>
                  <p>
                    <strong>Business License:</strong>{" "}
                    {form.documents.businessLicense}
                  </p>
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    className="px-4 py-2 border rounded"
                    onClick={() => setStep(3)}
                  >
                    ← Back
                  </button>

                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded"
                    onClick={submitMerchant}
                  >
                    Submit Merchant
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
