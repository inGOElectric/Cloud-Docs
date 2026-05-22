import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useServiceComplaints } from "../hooks/useServiceComplaints";

export default function AddComplaint() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { submitComplaint } = useServiceComplaints();

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Battery");
  const [workType, setWorkType] = useState("PAID");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setError("");
      setLoading(true);
      await submitComplaint(id, { description, category, workType });
      alert("Complaint saved");
      navigate(`/job-cards/${id}`);
    } catch (err) {
      console.error("Complaint error:", err.response?.data || err.message);
      setError("Failed to save complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Add Service Complaint</h2>
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

      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          className="border p-2 w-full rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Battery">Battery</option>
          <option value="Brakes">Brakes</option>
          <option value="Suspension">Suspension</option>
          <option value="Charger">Charger</option>
          <option value="Electronics">Electronics</option>
          <option value="Display">Display</option>
          <option value="Power">Power</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Work Type</label>
        <select
          className="border p-2 w-full rounded"
          value={workType}
          onChange={(e) => setWorkType(e.target.value)}
        >
          <option value="PAID">Paid</option>
          <option value="COMPLAINT">Complaint</option>
          <option value="WARRANTY">Warranty</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          className="border p-2 w-full rounded"
          placeholder="Describe the issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <button
          onClick={handleSubmit}
          disabled={loading || !description.trim()}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400 flex-1"
        >
          {loading ? "Saving..." : "Save Complaint"}
        </button>
        <button
          onClick={() => navigate(`/job-cards/${id}`)}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
