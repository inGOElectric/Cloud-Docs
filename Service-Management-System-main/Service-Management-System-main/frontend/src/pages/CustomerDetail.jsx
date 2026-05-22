import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import client from "../api/client";

export default function CustomerDetail() {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [jobCards, setJobCards] = useState([]); // ✅ MUST be []
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const load = async () => {
    try {
      const customerRes = await client.get(`/customers/${id}`);
      const jobCardsRes = await client.get(`/customers/${id}/job-cards`);

      setCustomer(customerRes.data);

      setJobCards(
        Array.isArray(jobCardsRes.data?.data)
          ? jobCardsRes.data.data
          : []
      );
    } catch (err) {
      setError("Failed to load customer details");
    } finally {
      setLoading(false);
    }
  };

  load();
}, [id]);
;

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!customer) return <div className="p-6">Customer not found</div>;

  return (
  <div className="admin-card">
    <div className="admin-header">
      <h2 className="admin-heading">{customer.name}</h2>
      <p className="admin-subheading">
        {customer.mobileNumber}
      </p>
    </div>

    <h2 className="admin-heading" style={{ fontSize: "24px" }}>
  Job Card History
</h2>

    {jobCards.length === 0 ? (
      <p className="admin-text">No job cards found.</p>
    ) : (
      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Job Card #</th>
              <th>Vehicle</th>
              <th>Service Type</th>
              <th>Service Date/Time</th>
              <th>Status</th>
              <th>Odometer</th>
              <th>Battery Voltage</th>
              <th>Admin/Advisor Remark</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {jobCards.map((jc) => (
              <tr key={jc.id}>
                <td style={{ whiteSpace: "nowrap" }}>
                  {jc.jobCardNumber}
                </td>

                <td>{jc.vehicle?.model || "-"}</td>
                <td>{jc.serviceType}</td>

                <td>
                  {jc.serviceInDatetime
                    ? new Date(jc.serviceInDatetime).toLocaleString()
                    : "-"}
                </td>

                <td>
                  <span
                    className={
                      jc.status === "OPEN"
                        ? "admin-badge admin-badge-open"
                        : "admin-badge admin-badge-closed"
                    }
                  >
                    {jc.status}
                  </span>
                </td>

                <td>{jc.odometer ?? "-"}</td>
                <td>{jc.batteryVoltage ?? "-"}</td>

                <td style={{ maxWidth: "220px" }}>
                  {jc.remarks ||
                    jc.adminRemark ||
                    jc.advisorRemark ||
                    "-"}
                </td>

                <td>
                  {jc.createdAt
                    ? new Date(jc.createdAt).toLocaleString()
                    : "-"}
                </td>

                <td className="admin-actions">
                  <Link to={`/job-cards/${jc.id}`}>
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
}