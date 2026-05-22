import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../../api/client";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      // 🔥 ADMIN: fetch ALL complaints
      const res = await client.get("/complaints/admin/all");
      setComplaints(res.data);
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading complaints...</p>;
  }

 return (
  <div className="admin-card">
    <div className="admin-header">
      <h2 className="admin-heading">Complaints</h2>
    </div>

    {complaints.length === 0 ? (
      <p className="admin-text">No complaints found</p>
    ) : (
      <table className="admin-table">
        <thead>
          <tr>
            <th>Complaint Ref</th>
            <th>Customer</th>
            <th>Job Card</th>
            <th>Category</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {complaints.map((c) => (
            <tr key={c.id}>
              <td>{`CMP-${String(c.id).padStart(3, "0")}`}</td>
              <td>{c.jobCard?.customer?.name || "N/A"}</td>
              <td>{c.jobCard?.jobCardNumber}</td>
              <td>{c.category}</td>
              <td>{c.description}</td>
              <td className="admin-actions">
                <Link to={`/job-cards/${c.jobCardId}`}>
                  View Job Card
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);
}