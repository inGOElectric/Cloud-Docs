import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../../api/client";

export default function TechnicianJobDetail() {

  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  /* ================= FETCH BOOKING ================= */

  useEffect(() => {
    fetchDetail();
  }, [bookingId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);

      const res = await client.get(`/technicians/booking/${bookingId}`);

      setBooking(res.data);

      const activeLog = res.data?.jobCard?.workLogs?.find(
        (log) => log.status === "IN_PROGRESS"
      );

      if (activeLog?.startedAt) {
        const seconds =
          Math.floor((new Date() - new Date(activeLog.startedAt)) / 1000);

        setTimer(seconds);
      }

    } catch (err) {
      console.error("Failed to fetch booking:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= TIMER ================= */

  useEffect(() => {

    let interval;

    if (booking?.status === "IN_PROGRESS") {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);

  }, [booking]);

  /* ================= START WORK ================= */

  const handleStart = async () => {
  if (!taskName) {
    alert("Task name is required");
    return;
  }

  try {
    const jobCardId = booking?.jobCard?.id;

    if (!jobCardId) {
      alert("JobCard not found");
      return;
    }

    // ✅ GET TECHNICIAN FROM LOCAL STORAGE
    const technicianName = localStorage.getItem("technicianName");

    // ✅ VALIDATION
    if (!technicianName) {
      alert("Please select technician first");
      return;
    }

    console.log("SENDING DATA:", { taskName, description, technicianName });

    // 1️⃣ Create Work Log
    await client.post(`/work-logs/job-cards/${jobCardId}/work-log`, {
      taskName,
      description,
      technicianName   
    });

    // 2️⃣ TRY updating backend (may fail)
    try {
      await client.put(`/technicians/start/${bookingId}`);
    } catch (err) {
      console.warn("Start API failed — using frontend fallback");
    }

    // 3️⃣ UI UPDATE
    setBooking((prev) => ({
      ...prev,
      status: "IN_PROGRESS"
    }));

    // 4️⃣ Refresh
    fetchDetail();

  } catch (err) {
    console.error("Start failed:", err);
  }
};

/* ================= COMPLETE WORK ================= */
const handleComplete = async () => {
  try {
    const jobCardId = booking?.jobCard?.id;

    if (!jobCardId) {
      alert("JobCard not found");
      return;
    }

    // 1️⃣ Get latest work log (last active one)
    const logs = booking?.jobCard?.workLogs || [];

    if (logs.length === 0) {
      alert("No work log found");
      return;
    }

    const latestLog = logs[0]; // assuming latest is first

    // 2️⃣ Complete that work log
    await client.patch(`/work-logs/work-log/${latestLog.id}/complete`);

    // 3️⃣ Update booking status
    await client.put(`/technicians/complete/${bookingId}`);

    // 4️⃣ Refresh UI
    fetchDetail();

  } catch (err) {
    console.error("Complete failed:", err);
    alert("Failed to complete work");
  }
};
  /* ================= UPLOAD MEDIA ================= */

  const handleUpload = async () => {

    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    try {

      setUploading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);

      await client.post(
        `/technicians/service-bookings/${bookingId}/media`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Media uploaded successfully");

      setSelectedFile(null);

      fetchDetail();

    } catch (err) {

      console.error("Upload failed:", err);

      alert("Upload failed");

    } finally {

      setUploading(false);

    }
  };

  /* ================= DELETE MEDIA ================= */

  const handleDeleteMedia = async (mediaId) => {

    if (!window.confirm("Delete this media?")) return;

    try {

      await client.delete(`/technicians/service-media/${mediaId}`);

      fetchDetail();

    } catch (err) {

      console.error("Delete failed:", err);

      alert("Delete failed");

    }
  };

  const getMediaUrl = (m) => {
  const raw = m.fileUrl || m.filePath;

  if (!raw) return "";

  // if already full URL
  if (raw.startsWith("http")) {
    return raw;
  }

  // if relative path
  return `http://localhost:4000${raw}`;
};

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="p-6 text-white bg-[#01263B] min-h-screen">
        Loading...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-6 text-red-400 bg-[#01263B] min-h-screen">
        Booking not found
      </div>
    );
  }

  const mediaList =
    booking?.media ||
    booking?.jobCard?.media ||
    [];

  /* ================= UI ================= */

  return (

    <div className="p-6 text-white bg-[#01263B] min-h-screen">

      {/* BACK BUTTON */}

      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-gray-600 px-4 py-2 rounded hover:bg-gray-500"
      >
        ← Back
      </button>

      {/* TITLE */}

      <h2 className="text-3xl font-bold mb-6">
        Service Details
      </h2>

      {/* BOOKING INFO */}

      <div className="bg-[#0A3A55] p-5 rounded mb-6 border border-gray-700">

        <p><strong>Customer:</strong> {booking.customer?.name}</p>

        <p><strong>Service Type:</strong> {booking.serviceType}</p>

        <p><strong>Status:</strong> {booking.status}</p>

      </div>

      {/* ================= ACTION SECTION ================= */}

      {booking.status !== "COMPLETED" && (

        <div className="bg-[#0A3A55] p-6 rounded mb-6 border border-gray-700">

          {booking.status === "CLAIMED" && (

            <>

              <label className="block text-gray-300 mb-1">
                Task Name
              </label>

              <input
                type="text"
                placeholder="Enter task name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full p-3 mb-4 bg-[#01263B] border border-gray-600 text-white rounded focus:outline-none focus:border-cyan-400"
              />

              <label className="block text-gray-300 mb-1">
                Description
              </label>

              <textarea
                placeholder="Describe the issue or work done"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 mb-4 bg-[#01263B] border border-gray-600 text-white rounded focus:outline-none focus:border-cyan-400"
              />

              <button
                onClick={handleStart}
                className="bg-cyan-600 px-6 py-2 rounded hover:bg-cyan-500"
              >
                Start Work
              </button>

            </>
          )}

          {booking.status === "IN_PROGRESS" && (

            <>

              <p className="mb-4 text-cyan-400 text-lg">
                Elapsed Time: {timer}s
              </p>

              <button
                onClick={handleComplete}
                className="bg-green-600 px-6 py-2 rounded hover:bg-green-500"
              >
                Complete Work
              </button>

            </>
          )}

        </div>

      )}

      {/* COMPLETED */}

      {booking.status === "COMPLETED" && (

        <div className="bg-green-800 p-5 rounded border border-green-600">
          Work Completed ✔ (Locked)
        </div>

      )}

      {/* ================= WORK HISTORY ================= */}

<h3 className="text-xl font-semibold mt-8 mb-4">
  Work History
</h3>

{booking.jobCard?.workLogs?.length === 0 && (
  <p className="text-gray-400">
    No work history yet
  </p>
)}

{booking.jobCard?.workLogs?.map((log) => (

  <div
    key={log.id}
    className="bg-[#0A3A55] p-4 rounded mb-3 border border-gray-700"
  >

    <p className="font-semibold text-lg">
      {log.taskName}
    </p>

    {/* ✅ ADD THIS */}
    <p>Description: {log.description || "No description"}</p>

    {/* ✅ ADD THIS */}
    <p>Technician: {log.technicianName || "Unknown"}</p>

    <p>Status: {log.status}</p>

    <p>
      Started: {new Date(log.startedAt).toLocaleString()}
    </p>

    {log.completedAt && (
      <p>
        Completed: {new Date(log.completedAt).toLocaleString()}
      </p>
    )}

  </div>

))}

      {/* ================= UPLOAD MEDIA ================= */}

      {(booking.status === "IN_PROGRESS" ||
        booking.status === "COMPLETED") && (

        <div className="bg-[#0A3A55] p-6 rounded mt-8 border border-gray-700">

          <h3 className="text-xl font-semibold mb-4">
            Upload Work Media
          </h3>

          <label className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2 rounded cursor-pointer">

            Choose File

            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="hidden"
            />

          </label>

          {selectedFile && (

            <p className="mt-3 text-gray-300">
              Selected: {selectedFile.name}
            </p>

          )}

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="ml-4 bg-blue-600 px-5 py-2 rounded hover:bg-blue-500"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>

        </div>

      )}

      {mediaList.map((m) => {
  const url = getMediaUrl(m);
  const lower = url.toLowerCase();

  let content;

  if (
    lower.endsWith(".mp4") ||
    lower.endsWith(".mov") ||
    lower.endsWith(".webm")
  ) {
    content = (
      <video
        src={url}
        controls
        className="rounded w-full h-auto object-contain"
      />
    );
  } else if (
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".png") ||
    lower.endsWith(".webp") ||
    lower.endsWith(".gif")
  ) {
    content = (
  <div className="flex justify-center">
    <img
      src={url}
      alt="Work proof"
      className="rounded max-h-[400px] w-auto object-contain"
    />
  </div>
);
  } else {
    content = (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-gray-800 p-4 rounded text-center"
      >
        📎 Open File
      </a>
    );
  }

  return (
    <div key={m.id} className="relative">

      {content}

      <button
        onClick={() => handleDeleteMedia(m.id)}
        className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-xs px-2 py-1 rounded"
      >
        Delete
      </button>

    </div>
  );
})}
    </div>

  );
}