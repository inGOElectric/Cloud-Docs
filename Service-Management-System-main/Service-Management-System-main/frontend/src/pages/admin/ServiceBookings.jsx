import { useEffect, useState } from "react";
import client from "../../api/client";

export default function ServiceBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await client.get("/service-bookings");
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load service bookings", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="admin-text">Loading service bookings…</p>;

  return (
    <div className="admin-card">
      <div className="admin-header">
        <h2 className="admin-heading">Service Bookings</h2>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Vehicle Part</th>
            <th>Service Type</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan={6}>No service bookings</td>
            </tr>
          ) : (
            bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.customer?.name || "-"}</td>
                <td>{b.vehiclePart}</td>
                <td>{b.serviceType}</td>
                <td>{new Date(b.preferredDate).toLocaleDateString()}</td>
                <td>{b.timeSlot}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}