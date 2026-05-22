import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getJobCard } from "../api/jobCards";
import JobCardMedia from "../components/JobCardMedia";
import "./JobCardDetail.css";

export default function JobCardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jobCard, setJobCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getJobCard(id);
        setJobCard(res.data);
      } catch (err) {
        console.error("Job card fetch failed", err);
        setError("Failed to load job card");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <div className="jobcard-page">Loading…</div>;
  if (error) return <div className="jobcard-page">{error}</div>;
  if (!jobCard) return <div className="jobcard-page">Not found</div>;

 return (
  <div className="admin-card">

    {/* ================= HEADER ================= */}
    <div className="admin-header" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <button
        className="admin-button admin-button-primary"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h2 className="admin-heading" style={{ margin: 0 }}>
        Job Card {jobCard.jobCardNumber}
      </h2>

      <span
        className={
          jobCard.status === "OPEN"
            ? "admin-badge admin-badge-open"
            : "admin-badge admin-badge-closed"
        }
      >
        {jobCard.status}
      </span>
    </div>

{/* ================= JOB CARD SUMMARY ================= */}
<div className="admin-form-section">
  <div className="admin-form-grid-4">

    <div className="admin-form-group">
      <label>Service Type</label>
      <div className="admin-text">
        {jobCard.serviceType}
      </div>
    </div>

    <div className="admin-form-group">
      <label>Service In</label>
      <div className="admin-text">
        {jobCard.serviceInDatetime
          ? new Date(jobCard.serviceInDatetime).toLocaleString()
          : "-"}
      </div>
    </div>

    <div className="admin-form-group">
      <label>Customer</label>
      <Link
        to={`/customers/${jobCard.customer?.id}`}
        className="admin-text"
        style={{ textDecoration: "underline" }}
      >
        {jobCard.customer?.name}
      </Link>
    </div>

    <div className="admin-form-group">
      <label>Mobile</label>
      <div className="admin-text">
        {jobCard.customer?.mobileNumber}
      </div>
    </div>

    <div className="admin-form-group">
      <label>Model</label>
      <div className="admin-text">
        {jobCard.vehicle?.model}
      </div>
    </div>

    <div className="admin-form-group">
      <label>VIN</label>
      <div className="admin-text">
        {jobCard.vehicle?.vinNumber}
      </div>
    </div>

  </div>
</div>

    {/* ================= COMPLAINTS ================= */}
    {jobCard.complaints?.length > 0 && (
  <div className="jobcard-white-section">
    <h3 className="section-title">Complaint Details</h3>

    <table className="jobcard-table">
      <thead>
        <tr>
          <th>Complaint Ref</th>
          <th>Category</th>
          <th>Description</th>
          <th>Raised</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {jobCard.complaints.map((c) => (
          <tr key={c.id}>
            <td className="mono">CMP-{c.id}</td>
            <td>{c.category}</td>
            <td>{c.description}</td>
            <td>
              {new Date(c.createdAt).toLocaleDateString()}
            </td>
            <td>
              <span
                className={
                  c.status === "OPEN"
                    ? "status-badge open"
                    : "status-badge closed"
                }
              >
                {c.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

    {/* ================= INSPECTIONS ================= */}
    {jobCard.inspections?.length > 0 && (
      <div className="admin-form-section">
        <h3>Inspection Details</h3>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Result</th>
              <th>Notes</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {jobCard.inspections.map((i) => (
              <tr key={i.id}>
                <td>{i.type || "-"}</td>
                <td>{i.result || "-"}</td>
                <td>{i.notes || "-"}</td>
                <td>
                  {i.createdAt
                    ? new Date(i.createdAt).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {/* ================= PARTS ================= */}
    {jobCard.parts?.length > 0 && (
      <div className="admin-form-section">
        <h3>Parts Replacement</h3>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Part</th>
              <th>Qty</th>
              <th>Notes</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {jobCard.parts.map((p) => (
              <tr key={p.id}>
                <td>{p.partName || "-"}</td>
                <td>{p.quantity || "-"}</td>
                <td>{p.notes || "-"}</td>
                <td>
                  {p.createdAt
                    ? new Date(p.createdAt).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {/* ================= WORK LOGS ================= */}
    {jobCard.workLogs?.length > 0 && (
  <div className="jobcard-white-section">
    <h3 className="section-title">Work Logs</h3>

    <table className="jobcard-table">
      <thead>
        <tr>
          <th>Task</th>
          <th>Technician</th>
          <th>Status</th>
          <th>Started</th>
          <th>Completed</th>
        </tr>
      </thead>

      <tbody>
        {jobCard.workLogs.map((w) => (
          <tr key={w.id}>
            <td>{w.taskName}</td>
            <td>{w.technicianName}</td>
            <td>
              <span
                className={
                  w.status === "COMPLETED"
                    ? "status-badge closed"
                    : "status-badge open"
                }
              >
                {w.status}
              </span>
            </td>
            <td>
              {w.startedAt
                ? new Date(w.startedAt).toLocaleString()
                : "-"}
            </td>
            <td>
              {w.completedAt
                ? new Date(w.completedAt).toLocaleString()
                : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

    {/* ================= MEDIA ================= */}
    <div className="jobcard-white-section">
  <h3>Media</h3>
      <JobCardMedia
        jobCardId={jobCard.id}
        media={jobCard.media}
      />
    </div>

  </div>
);
}