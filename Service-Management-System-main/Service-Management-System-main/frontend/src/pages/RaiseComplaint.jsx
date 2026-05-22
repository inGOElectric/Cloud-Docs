import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import client from "../api/client";

export default function RaiseComplaint() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const jobCardId = searchParams.get("jobCardId");

  const [category, setCategory] = useState("Battery");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    await client.post("/customers/me/complaints", {
      jobCardId: Number(jobCardId),
      category,
      description,
    });

    // ✅ MUST MATCH App.jsx ROUTE
    navigate("/dashboard");
  } catch (err) {
    console.error("Raise complaint failed:", err);
    setError("Failed to raise complaint. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-xl mx-auto p-6 bg-white border rounded">
      <h1 className="text-xl font-bold mb-4">Raise Complaint</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold">Job Card ID</label>
          <input
            value={jobCardId || ""}
            disabled
            className="border p-2 w-full bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">
            Complaint Category
          </label>
          <select
            className="border p-2 w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Battery">Battery</option>
            <option value="Charger">Charger</option>
            <option value="Brakes">Brakes</option>
            <option value="Suspension">Suspension</option>
            <option value="Electronics">Electronics</option>
            <option value="Display">Display</option>
            <option value="Power">Power</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold">Description</label>
          <textarea
            className="border p-2 w-full"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
}
