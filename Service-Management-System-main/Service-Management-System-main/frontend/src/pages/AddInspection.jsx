import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useVehicleInspection } from "../hooks/useVehicleInspection";

const COMPONENTS = ["brakes", "lights", "tires", "battery"];

export default function AddInspection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { submitInspection, fetchInspection } = useVehicleInspection();

  const [form, setForm] = useState({
    brakes: "OK",
    lights: "OK",
    tires: "OK",
    battery: "OK",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInspection(id)
      .then((items) => {
        if (Array.isArray(items)) {
          const mapped = {};
          for (const item of items) {
            mapped[item.componentName.toLowerCase()] = item.condition;
          }
          setForm((prev) => ({ ...prev, ...mapped }));
        }
      })
      .catch((err) => {
        console.error("Load inspection error:", err);
      });
  }, [id]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setError("");
      setLoading(true);
      const payload = COMPONENTS.map((c) => ({
        componentName: c.charAt(0).toUpperCase() + c.slice(1),
        condition: form[c],
      }));

      await submitInspection(id, payload);
      alert("Inspection saved");
      navigate(`/job-cards/${id}`);
    } catch (err) {
      console.error("Inspection error:", err);
      setError("Failed to save inspection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Vehicle Inspection</h2>
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

      {COMPONENTS.map((item) => (
        <div key={item} className="flex justify-between items-center">
          <label className="capitalize font-medium">{item}</label>
          <select
            value={form[item]}
            onChange={(e) => handleChange(item, e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="OK">OK</option>
            <option value="NOT_OK">Not OK</option>
            <option value="DAMAGE">Damaged</option>
          </select>
        </div>
      ))}

      <textarea
        className="border p-2 w-full rounded"
        placeholder="Remarks (optional)"
        value={form.remarks || ""}
        onChange={(e) => handleChange("remarks", e.target.value)}
      />

      <div className="flex gap-2 pt-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 flex-1"
        >
          {loading ? "Saving..." : "Save Inspection"}
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
