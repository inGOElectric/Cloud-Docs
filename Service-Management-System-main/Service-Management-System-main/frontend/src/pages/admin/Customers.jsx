import { useEffect, useState } from "react";
import client from "../../api/client";

export default function Customers() {

  const [customers, setCustomers] = useState([]);
  const [offset, setOffset] = useState(0);
  const [viewAll, setViewAll] = useState(false);

  const limit = 50;

  useEffect(() => {
    fetchCustomers();
  }, [offset, viewAll]);

  const fetchCustomers = async () => {
    try {

      const url = viewAll
        ? "/customers"
        : `/customers?limit=${limit}&offset=${offset}`;

      const res = await client.get(url);

      setCustomers(Array.isArray(res.data) ? res.data : []);

    } catch (error) {
      console.error("Failed to load customers:", error);
      setCustomers([]);
    }
  };

  const toggleViewAll = () => {
    setViewAll(!viewAll);
    setOffset(0);
  };

  return (
    <div className="admin-card">

      <div className="admin-header flex justify-between items-center">

        <h2 className="admin-heading">Customers</h2>

        <button
          onClick={toggleViewAll}
          className="admin-button"
        >
          {viewAll ? "Show Paginated" : "View All"}
        </button>

      </div>

      <table className="admin-table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Address</th>
            <th>Vehicles</th>
            <th>Job Cards</th>
            <th>Bookings</th>
          </tr>
        </thead>

        <tbody>

          {customers.length === 0 ? (
            <tr>
              <td colSpan={8}>No customers found</td>
            </tr>
          ) : (
            customers.map((c) => (
              <tr key={c.id}>

                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.mobileNumber}</td>
                <td>{c.email}</td>
                <td>{c.address}</td>

                <td>{c._count?.vehicles || 0}</td>
                <td>{c._count?.jobCards || 0}</td>
                <td>{c._count?.serviceBookings || 0}</td>

              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>
  );
}