import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../api/client";

export default function CustomerBookingDetail() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, []);

  const fetchDetail = async () => {
    try {
      const res = await client.get(
        `/service-bookings/customer/detail/${bookingId}`
      );
      setBooking(res.data);
    } catch (err) {
      console.error("Failed to load booking detail:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-white bg-[#01263B] min-h-screen">
        Loading...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-6 text-white bg-[#01263B] min-h-screen">
        Booking not found
      </div>
    );
  }

  const workLogs = booking.jobCard?.workLogs || [];

  const technicianName =
    workLogs.length > 0
      ? workLogs[0].technicianName
      : "Not assigned yet";

  return (
    <div className="p-6 text-white bg-[#01263B] min-h-screen">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-600 px-3 py-1 rounded"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-4">
        Service Work Details
      </h2>

      {/* ================= BASIC INFO ================= */}

      <div className="bg-[#0A3A55] p-4 rounded mb-6">
        <p><strong>Status:</strong> {booking.status}</p>

        <p><strong>Service Type:</strong> {booking.serviceType}</p>

        <p>
          <strong>Date:</strong>{" "}
          {booking.preferredDate
            ? new Date(booking.preferredDate).toLocaleDateString("en-GB")
            : "-"}
        </p>

        <p>
          <strong>Technician:</strong> {technicianName}
        </p>
      </div>

      {/* ================= WORK TIMELINE ================= */}

      <h3 className="text-lg font-semibold mb-3">
        Work Timeline
      </h3>

      {workLogs.length === 0 && (
        <p className="text-gray-400">
          Work has not started yet.
        </p>
      )}

      {workLogs.map((log) => (
        <div
          key={log.id}
          className="bg-[#0A3A55] p-4 rounded mb-3"
        >

          <p>
            <strong>Task:</strong> {log.taskName}
          </p>

          <p>
            <strong>Technician:</strong>{" "}
            {log.technicianName || "Unknown"}
          </p>

          {log.description && (
            <p>
              <strong>Description:</strong> {log.description}
            </p>
          )}

          <p>
            <strong>Status:</strong> {log.status}
          </p>

          <p>
            <strong>Started:</strong>{" "}
            {log.startedAt
              ? new Date(log.startedAt).toLocaleString("en-GB")
              : "-"}
          </p>

          {log.completedAt && (
            <p>
              <strong>Completed:</strong>{" "}
              {new Date(log.completedAt).toLocaleString("en-GB")}
            </p>
          )}

        </div>
      ))}

      {/* ================= WORK PROOF MEDIA ================= */}

{(booking.jobCard?.media?.length > 0 || booking.media?.length > 0) && (
  <>
    <h3 className="text-lg font-semibold mt-6 mb-3">
      Work Proof
    </h3>

    <div className="grid grid-cols-1 gap-4">

      {/* JobCard Media */}
{booking.jobCard?.media?.map((m) =>
  m.fileType === "image" ? (
    <img
      key={`job-${m.id}`}
      src={`http://localhost:4000${m.fileUrl}`}
      alt="Work proof"
      className="rounded shadow"
    />
  ) : (
    <video key={`job-${m.id}`} controls className="rounded shadow">
      <source src={`http://localhost:4000${m.fileUrl}`} />
    </video>
  )
)}{/* ServiceBooking Media */}
{booking.media?.map((m) =>
  m.fileType === "image" ? (
    <img
      key={`booking-${m.id}`}
      src={`http://localhost:4000${m.fileUrl}`}
      alt="Booking proof"
      className="rounded shadow max-h-[400px] w-auto object-contain mx-auto"
    />
  ) : (
    <video key={`booking-${m.id}`} controls className="rounded shadow">
      <source src={`http://localhost:4000${m.fileUrl}`} />
    </video>
  )
)}
    </div>
  </>
)}

    </div>
  );
}