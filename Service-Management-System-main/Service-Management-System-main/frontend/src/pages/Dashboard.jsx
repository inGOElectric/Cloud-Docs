import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { searchJobCards } from "../api/jobCards";

export default function Dashboard() {
  const [jobCards, setJobCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await searchJobCards("");
        setJobCards(res.data || []);
      } catch (err) {
        console.error("Dashboard load failed:", err);
        setError("Failed to load job cards");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>

      <Link
        to="/job-cards/new"
        className="inline-block mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        + Create Job Card
      </Link>

      {jobCards.length === 0 ? (
        <div className="text-gray-500">No job cards yet.</div>
      ) : (
        <ul className="space-y-2">
          {jobCards.map((j) => (
            <li
              key={j.id}
              className="border p-3 rounded flex justify-between items-center gap-4"
            >
              <Link
                to={`/job-cards/${j.id}`}
                className="flex-1 hover:text-blue-600 font-medium"
              >
                {j.jobCardNumber} — {j.status}
              </Link>

              <Link
                to={`/job-cards/${j.id}/inspection`}
                className="text-blue-600 underline text-sm"
              >
                Inspect
              </Link>

              <Link
                to={`/job-cards/${j.id}/complaints`}
                className="text-indigo-600 underline text-sm"
              >
                Complaints
              </Link>

              <Link
                to={`/job-cards/${j.id}/parts`}
                className="text-indigo-600 underline text-sm"
              >
                Parts
              </Link>

              <Link
                to={`/job-cards/${j.id}/work-log`}
                className="text-indigo-600 underline text-sm"
              >
                Work Log
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
