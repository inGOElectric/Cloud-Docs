import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchParts, saveParts } from "../api/parts";

const emptyRow = {
  partName: "",
  partNumber: "",
  action: "REPLACE",
  warrantyApplicable: false,
};

export default function PartsReplacement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState([{ ...emptyRow }]);
  const [existing, setExisting] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadParts = async () => {
    try {
      const res = await fetchParts(id);
      setExisting(res.data || []);
    } catch (err) {
      console.error("Load parts error:", err);
      setError("Failed to load parts");
    }
  };

  useEffect(() => {
    loadParts();
  }, [id]);

  const updateRow = (i, key, value) => {
    const updated = [...rows];
    updated[i] = { ...updated[i], [key]: value };
    setRows(updated);
  };

  const addRow = () => setRows([...rows, { ...emptyRow }]);

  const removeRow = (i) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, idx) => idx !== i));
    }
  };

  const handleSubmit = async () => {
    const valid = rows.every((r) => r.partName && r.action);
    if (!valid) return alert("Fill all required fields");

    try {
      setLoading(true);
      setError("");
      await saveParts(id, rows);
      alert("Parts saved successfully");
      setRows([{ ...emptyRow }]);
      await loadParts();
      navigate(`/job-cards/${id}`);
    } catch (err) {
      console.error("Save parts error:", err);
      setError("Failed to save parts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Parts Replacement</h2>
        <button
          onClick={() => navigate(`/job-cards/${id}`)}
          className="text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {/* New Parts Form */}
      <div className="space-y-3 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold text-sm">Add New Parts</h3>
        {rows.map((r, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              className="border px-2 py-1 rounded flex-1"
              placeholder="Part Name"
              value={r.partName}
              onChange={(e) => updateRow(i, "partName", e.target.value)}
            />
            <input
              className="border px-2 py-1 rounded flex-1"
              placeholder="Part Number"
              value={r.partNumber}
              onChange={(e) => updateRow(i, "partNumber", e.target.value)}
            />
            <select
              className="border px-2 py-1 rounded"
              value={r.action}
              onChange={(e) => updateRow(i, "action", e.target.value)}
            >
              <option value="NEW">New</option>
              <option value="REPLACE">Replace</option>
              <option value="REFURBISHED">Refurbished</option>
            </select>
            <label className="flex items-center gap-1 whitespace-nowrap">
              <input
                type="checkbox"
                checked={r.warrantyApplicable}
                onChange={(e) =>
                  updateRow(i, "warrantyApplicable", e.target.checked)
                }
              />
              <span className="text-sm">Warranty</span>
            </label>
            {rows.length > 1 && (
              <button
                onClick={() => removeRow(i)}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={addRow}
          className="bg-gray-300 text-gray-800 px-3 py-2 rounded hover:bg-gray-400"
        >
          + Add Row
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Saving..." : "Save Parts"}
        </button>
        <button
          onClick={() => navigate(`/job-cards/${id}`)}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>

      {/* Existing Parts */}
      {existing.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 rounded">
          <h3 className="font-semibold mb-3">Previously Added Parts</h3>
          <ul className="space-y-2">
            {existing.map((p) => (
              <li key={p.id} className="flex justify-between items-center p-2 bg-white rounded border">
                <div>
                  <span className="font-medium">{p.partName}</span>
                  {p.partNumber && <span className="text-gray-600 ml-2">#{p.partNumber}</span>}
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {p.action}
                  </span>
                  {p.warrantyApplicable && (
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                      Warranty
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
