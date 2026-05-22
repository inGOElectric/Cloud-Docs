import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";

export default function TechnicianDetail() {
  const { id } = useParams();
  const [available, setAvailable] = useState([]);
  const [claimed, setClaimed] = useState([]);

  const fetchData = () => {
    client.get("/technicians/available").then(res => {
      setAvailable(res.data);
    });

    client.get(`/technicians/claimed/${id}`).then(res => {
      setClaimed(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const claimBooking = async (bookingId) => {
    await client.put(`/technicians/claim/${bookingId}/${id}`);
    fetchData();
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-lg font-bold mb-4">Available Bookings</h2>

      {available.map((b) => (
        <div key={b.id} className="bg-[#0A3A55] p-4 mb-3 rounded">
          <p>{b.customer.name} - {b.vehicle.model}</p>
          <button
            onClick={() => claimBooking(b.id)}
            className="mt-2 bg-cyan-600 px-3 py-1 rounded"
          >
            Take Job
          </button>
        </div>
      ))}

      <h2 className="text-lg font-bold mt-6 mb-4">My Active Jobs</h2>

      {claimed.map((b) => (
        <div key={b.id} className="bg-[#0A3A55] p-4 mb-3 rounded">
          <p>{b.customer.name} - {b.vehicle.model}</p>
        </div>
      ))}
    </div>
  );
}
