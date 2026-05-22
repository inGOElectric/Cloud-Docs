import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";

export default function TechnicianDashboard() {
  const navigate = useNavigate();

  const [technicians, setTechnicians] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [availableBookings, setAvailableBookings] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD TECHNICIANS ================= */
  useEffect(() => {
    loadTechnicians();
  }, []);

  const loadTechnicians = async () => {
    try {
      const { data } = await client.get("/technicians");
      setTechnicians(data);
    } catch (error) {
      console.error("Failed to load technicians:", error);
    }
  };

  /* ================= LOAD AVAILABLE BOOKINGS ================= */
  const loadAvailableBookings = async () => {
    try {
      const { data } = await client.get("/technicians/available");
      setAvailableBookings(data);
    } catch (error) {
      console.error("Failed to load available bookings:", error);
    }
  };

  /* ================= LOAD CLAIMED BOOKINGS ================= */
  const loadClaimedBookings = async (techId) => {
    try {
      const { data } = await client.get(
        `/technicians/${techId}/claimed`
      );
      setMyJobs(data);
    } catch (error) {
      console.error("Failed to load claimed bookings:", error);
    }
  };

  /* ================= SELECT TECHNICIAN ================= */
  const handleSelectTechnician = async (tech) => {
    localStorage.setItem("technicianName", tech.name);

    setSelectedTech(tech);
    setLoading(true);

    await Promise.all([
      loadAvailableBookings(),
      loadClaimedBookings(tech.id),
    ]);

    setLoading(false);
  };

  /* ================= CLAIM BOOKING ================= */
  const handleClaimBooking = async (bookingId) => {
    try {
      await client.put(
        `/technicians/claim/${bookingId}/${selectedTech.id}`
      );

      navigate(`/dashboard/technician/job/${bookingId}`);
    } catch (error) {
      console.error("Failed to claim booking:", error);
    }
  };

  /* ================= GO BACK ================= */
  const handleBack = () => {
    setSelectedTech(null);
    setAvailableBookings([]);
    setMyJobs([]);
  };

  /* ================= FILTER JOBS ================= */
  const claimedJobs = myJobs.filter(
    (job) => job.status === "CLAIMED"
  );

  const inProgressJobs = myJobs.filter(
    (job) => job.status === "IN_PROGRESS"
  );

  const completedJobs = myJobs.filter(
    (job) => job.status === "COMPLETED"
  );

  /* ================= RENDER ================= */
  return (
    <div className="p-6 min-h-screen text-white bg-[#01263B]">
      <h1 className="text-4xl font-bold mb-6">
        Technician Dashboard
      </h1>

      {/* ================= SELECT TECHNICIAN ================= */}
      {!selectedTech && (
        <>
          <h2 className="text-3xl font-semibold mb-4">
            Select Technician
          </h2>

          <div className="grid grid-cols-2 gap-6 font-bold text-2xl">
            {technicians.map((tech) => (
              <div
                key={tech.id}
                onClick={() => handleSelectTechnician(tech)}
                className="cursor-pointer p-4 rounded-2xl bg-[#0A3A55] hover:bg-cyan-600 transition"
              >
                {tech.name}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ================= TECHNICIAN VIEW ================= */}
      {selectedTech && (
        <>
          <button
            onClick={handleBack}
            className="mb-4 bg-gray-600 px-3 py-1 rounded hover:bg-gray-500"
          >
            ← Back
          </button>

          <h2 className="text-xl font-bold mb-4">
            {selectedTech.name}
          </h2>

          {loading && (
            <p className="text-cyan-400 mb-4">
              Loading bookings...
            </p>
          )}

          {/* ================= AVAILABLE BOOKINGS ================= */}
          <h3 className="text-lg font-semibold mb-3">
            Available Bookings
          </h3>

          {availableBookings.length === 0 ? (
            <p className="text-gray-400 mb-4">
              No available bookings
            </p>
          ) : (
            availableBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-[#0A3A55] p-4 mb-3 rounded flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>{booking.customer?.name}</strong>
                  </p>

                  <p className="text-sm text-gray-300">
                    {booking.vehiclePart} | {booking.serviceType}
                  </p>

                  <p className="text-sm text-gray-400">
                    {new Date(
                      booking.preferredDate
                    ).toLocaleDateString()}{" "}
                    | {booking.timeSlot}
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleClaimBooking(booking.id)
                  }
                  className="bg-cyan-600 px-3 py-1 rounded hover:bg-cyan-500"
                >
                  Take Job
                </button>
              </div>
            ))
          )}

          {/* ================= CLAIMED ================= */}
          <Section title="Claimed (Not Started)" color="blue">
            {claimedJobs.length === 0
              ? "No claimed jobs"
              : claimedJobs.map((job) => (
                  <JobCard key={job.id} job={job} navigate={navigate} />
                ))}
          </Section>

          {/* ================= IN PROGRESS ================= */}
          <Section title="In Progress" color="yellow">
            {inProgressJobs.length === 0
              ? "No active work"
              : inProgressJobs.map((job) => (
                  <JobCard key={job.id} job={job} navigate={navigate} />
                ))}
          </Section>

          {/* ================= COMPLETED ================= */}
          <Section title="Completed Jobs" color="green">
            {completedJobs.length === 0
              ? "No completed jobs"
              : completedJobs.map((job) => (
                  <JobCard key={job.id} job={job} navigate={navigate} />
                ))}
          </Section>
        </>
      )}
    </div>
  );
}

/* ================= SECTION COMPONENT ================= */
function Section({ title, children, color }) {
  const colors = {
    blue: "text-blue-400",
    yellow: "text-yellow-400",
    green: "text-green-400",
  };

  return (
    <div className="mt-6">
      <h3 className={`text-lg font-semibold mb-3 ${colors[color]}`}>
        {title}
      </h3>

      {typeof children === "string" ? (
        <p className="text-gray-400">{children}</p>
      ) : (
        <div className="space-y-3">{children}</div>
      )}
    </div>
  );
}

/* ================= JOB CARD ================= */
function JobCard({ job, navigate }) {
  return (
    <div className="bg-[#0A3A55] p-4 rounded flex justify-between items-center">
      <div>
        <p>
          <strong>{job.customer?.name}</strong>
        </p>

        <p className="text-sm text-gray-300">
          {job.vehiclePart} | {job.serviceType}
        </p>

        <p
          className={`text-sm ${
            job.status === "COMPLETED"
              ? "text-green-400"
              : job.status === "IN_PROGRESS"
              ? "text-yellow-400"
              : "text-cyan-400"
          }`}
        >
          Status: {job.status}
        </p>
      </div>

      <button
        onClick={() =>
          navigate(`/dashboard/technician/job/${job.id}`)
        }
        className={`px-3 py-1 rounded ${
          job.status === "IN_PROGRESS"
            ? "bg-yellow-600 hover:bg-yellow-500"
            : job.status === "COMPLETED"
            ? "bg-green-700 hover:bg-green-600"
            : "bg-cyan-600 hover:bg-cyan-500"
        }`}
      >
        {job.status === "IN_PROGRESS"
          ? "Resume Work"
          : job.status === "COMPLETED"
          ? "View / Edit"
          : "Start Work"}
      </button>
    </div>
  );
}