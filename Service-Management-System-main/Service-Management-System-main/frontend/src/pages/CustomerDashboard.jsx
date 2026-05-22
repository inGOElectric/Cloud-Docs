import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../hooks/useAuth";
import { Pencil } from "lucide-react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export default function CustomerDashboard() {

const { user, loading } = useAuth();
const navigate = useNavigate();

const [vehicles, setVehicles] = useState([]);
const [jobCards, setJobCards] = useState([]);
const [serviceBookings, setServiceBookings] = useState([]);
const [loadingJobs, setLoadingJobs] = useState(true);
const [loadingBookings, setLoadingBookings] = useState(true);
const [error, setError] = useState("");
const [profile, setProfile] = useState(null);
const [completedCrop, setCompletedCrop] = useState(null);
const imgRef = useRef(null);
const [bikeImage, setBikeImage] = useState("");
const fileInputRef = useRef(null);

const [crop, setCrop] = useState({
  unit: "%",
  width: 95,
  height: 90,
  x: 2,
  y: 5,
});
const [showCropper, setShowCropper] = useState(false);
const [imageSrc, setImageSrc] = useState(null);

useEffect(() => {
if (!loading && !user) {
navigate("/login/customer", { replace: true });
}
}, [loading, user, navigate]);

useEffect(() => {
  if (loading || !user) return;

  const loadVehicles = async () => {
    try {
      const res = await client.get("/customers/me/vehicles");

      console.log("USER:", user);                     
      console.log("VEHICLES RESPONSE:", res.data);    

      setVehicles(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load vehicles:", err);
    }
  };

  loadVehicles();
}, [loading, user]);

useEffect(() => {
if (loading || !user) return;


const loadJobCards = async () => {
  try {
    const res = await client.get("/customers/me/job-cards");
    setJobCards(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.error(err);
    setError("Failed to load job cards");
  } finally {
    setLoadingJobs(false);
  }
};

loadJobCards();


}, [loading, user]);

useEffect(() => {
if (loading || !user) return;


const loadServiceBookings = async () => {
  try {
    const res = await client.get("/customers/me/service-bookings");

    const bookingsData =
      Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

    setServiceBookings(bookingsData);
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingBookings(false);
  }
};

loadServiceBookings();

}, [loading, user]);

useEffect(() => {
if (loading || !user) return;


const loadProfile = async () => {
  try {
    const res = await client.get("/customers/me");
    setProfile(res.data);
  } catch (err) {
    console.error("Failed to load profile:", err);
  }
};

loadProfile();

}, [loading, user]);

if (loading || !user) return null;

const primaryVehicle = vehicles[0];

useEffect(() => {
  if (!user) return;

  const savedImage = localStorage.getItem(`bikeImage_${user.id}`);
  if (savedImage) {
    setBikeImage(savedImage);
  }
}, [user]);

const getBikeImage = (model) => {
if (!model) return "/bikes/flee-b1/default.png";
return `/bikes/flee-${model.toLowerCase()}/default.png`;
};

const handleBikeImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    setImageSrc(reader.result);
    setShowCropper(true);
  };

  reader.readAsDataURL(file);
};

const getCroppedImg = async (imageSrc, crop) => {
  if (!crop || !crop.width || !crop.height) return null;

  const image = new Image();
  image.src = imageSrc;

  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const displayedWidth = imgRef.current.width;
  const displayedHeight = imgRef.current.height;

  const scaleX = image.naturalWidth / displayedWidth;
  const scaleY = image.naturalHeight / displayedHeight;

  const pixelCrop = {
    x: crop.x * scaleX,
    y: crop.y * scaleY,
    width: crop.width * scaleX,
    height: crop.height * scaleY,
  };

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL("image/jpeg", 1);
};

const saveCrop = async () => {
  if (!completedCrop || !completedCrop.width || !completedCrop.height) {
    alert("Please select crop area");
    return;
  }

  const croppedImage = await getCroppedImg(imageSrc, completedCrop);

  setBikeImage(croppedImage);

  // ✅ SAVE
  localStorage.setItem(`bikeImage_${user.id}`, croppedImage);
  setShowCropper(false);
};

const statusColors = {
OPEN: "bg-yellow-100 text-yellow-800",
IN_PROGRESS: "bg-blue-100 text-blue-800",
CLOSED: "bg-green-100 text-green-800",
};

return ( <div className="min-h-screen bg-[#01263B] text-white p-4 md:p-8">

  <h1 className="text-2xl md:text-4xl font-bold mb-6">
    Welcome back, <span className="text-cyan-400">{user.name}</span>
  </h1>

  {profile && (
    <div className="mb-6 text-sm md:text-xl text-gray-300 space-y-1">
      <p>Phone: {profile.mobileNumber || "-"}</p>
      <p>Email: {profile.email || "-"}</p>
      <p>Address: {profile.address || "-"}</p>
    </div>
  )}

  {primaryVehicle && (
    <div className="bg-[#0A3A55] p-4 md:p-6 rounded-xl mb-8 flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
      <div>
        <h2 className="text-2xl font-semibold mb-2">
          {primaryVehicle.model}
        </h2>

        <p className="text-gray-300">VIN: {primaryVehicle.vinNumber}</p>

        <p className="text-gray-300 text-xl">
          Registration: {primaryVehicle.registrationNumber || "-"}
        </p>

        <p className="text-gray-300 text-xl">
          Battery No: {primaryVehicle.batteryNumber || "-"}
        </p>

        <p className="text-gray-300 text-xl">
          Motor No: {primaryVehicle.motorNumber || "-"}
        </p>

        <p className="text-gray-300 text-xl">
          Charger No: {primaryVehicle.chargerNumber || "-"}
        </p>

        <p className="text-gray-300 text-xl">
          Warranty: {primaryVehicle.warrantyStatus || "-"}
        </p>
      </div>

      <div className="relative">

        <img
          src={bikeImage || getBikeImage(primaryVehicle.model)}
          alt="Bike"
         className="w-full max-w-[300px] md:max-w-[420px] rounded-2xl object-contain mx-auto"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute top-3 right-3 bg-black/70 hover:bg-cyan-500 p-2 rounded-full transition"
        >
          <Pencil size={18} className="text-white"/>
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleBikeImageUpload}
          className="hidden"
        />

      </div>

    </div>
  )}

  <button
    className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-lg mb-8 text-2xl font-semibold"
    onClick={() => navigate("/customer/book-service")}
  >
    + Book Service
  </button>

{/* ================= SERVICE BOOKINGS ================= */}

<h2 className="text-4xl font-semibold mb-4">Service Bookings</h2>

{loadingBookings ? (
  <p className="text-gray-300 mb-10">Loading...</p>
) : serviceBookings.length === 0 ? (
  <p className="text-gray-300 mb-10">No service bookings found.</p>
) : (
  <>

    {/* ================= DESKTOP TABLE ================= */}
    <div className="hidden md:block">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-black rounded-3xl overflow-hidden">

          <thead className="bg-gray-100 text-xs md:text-3xl font-bold">
            <tr>
              <th className="py-3 md:py-6 px-2 md:px-4 text-left text-sm md:text-5xl font-extrabold">Booking Ref</th>
              <th className="py-3 md:py-6 px-2 md:px-4 text-left text-sm md:text-5xl font-extrabold">Part</th>
              <th className="py-3 md:py-6 px-2 md:px-4 text-left text-sm md:text-5xl font-extrabold">Date</th>
              <th className="py-3 md:py-6 px-2 md:px-4 text-left text-sm md:text-5xl font-extrabold">Time</th>
              <th className="py-3 md:py-6 px-2 md:px-4 text-left text-sm md:text-5xl font-extrabold">Status</th>
              <th className="py-3 md:py-6 px-2 md:px-4 text-left text-sm md:text-5xl font-extrabold">Action</th>
            </tr>
          </thead>

          <tbody>
            {serviceBookings.map((b) => (
              <tr key={b.id} className="border-t text-xs md:text-lg hover:bg-gray-50">

                <td className="py-2 md:py-3 px-2 md:px-4 font-bold">SB-{b.id}</td>

                <td className="py-2 md:py-3 px-2 md:px-4">{b.vehiclePart}</td>

                <td className="py-2 md:py-3 px-2 md:px-4">
                  {new Date(b.preferredDate).toLocaleDateString()}
                </td>

                <td className="py-2 md:py-3 px-2 md:px-4">{b.timeSlot}</td>

                <td className="py-2 md:py-3 px-2 md:px-4 font-semibold">{b.status}</td>

                <td className="py-2 md:py-3 px-2 md:px-4">
                  <button
                    onClick={() =>
                      navigate(`/dashboard/customer/booking/${b.id}`)
                    }
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-2 md:px-3 py-1 rounded text-xs md:text-lg font-medium"
                  >
                    View Work
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>

    {/* ================= MOBILE CARDS ================= */}
    <div className="md:hidden flex flex-col gap-4 mt-4">

      {serviceBookings.map((b) => (
        <div
          key={b.id}
          className="bg-white text-black rounded-2xl p-4 shadow-md"
        >

          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">SB-{b.id}</h3>
            <span className="text-xs px-2 py-1 rounded bg-gray-100">
              {b.status}
            </span>
          </div>

          <p className="text-gray-700 font-medium mb-2">
            {b.vehiclePart}
          </p>

          <div className="text-sm text-gray-600 mb-3">
            📅 {new Date(b.preferredDate).toLocaleDateString()}
            <br />
            ⏰ {b.timeSlot}
          </div>

          <button
            onClick={() =>
              navigate(`/dashboard/customer/booking/${b.id}`)
            }
            className="w-full bg-cyan-600 text-white py-2 rounded-lg text-sm font-medium"
          >
            View Work
          </button>

        </div>
      ))}

    </div>

  </>
  )}
  {showCropper && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

    <div className="bg-gray-900 p-6 rounded-xl w-[800px] max-w-[95vw]">
      <div className="relative w-full h-[550px] flex items-center justify-center bg-black rounded-lg overflow-hidden">
        <ReactCrop
  crop={crop}
  onChange={(c) => setCrop(c)}
  onComplete={(c) => setCompletedCrop(c)}
>
  <img
  ref={imgRef}
  src={imageSrc}
  alt="Crop"
 className="max-h-[1500px] max-w-full object-contain"
/>
</ReactCrop>

</div>

      <div className="flex justify-between mt-4">

        <button
          onClick={() => setShowCropper(false)}
          className="px-4 py-2 bg-gray-700 rounded"
        >
          Cancel
        </button>

        <button
          onClick={saveCrop}
          className="px-4 py-2 bg-cyan-500 rounded"
        >
          Save
        </button>

      </div>

    </div>

  </div>
)}

  {/* ================= JOB CARDS ================= */}

<h2 className="text-3xl font-semibold mb-4">Job Cards</h2>

{loadingJobs ? (
  <p className="text-gray-300">Loading...</p>
) : jobCards.length === 0 ? (
  <p className="text-gray-300">No job cards found.</p>
) : (
  <>

    {/* ================= DESKTOP TABLE ================= */}
    <div className="hidden md:block">
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full bg-white text-black rounded-3xl overflow-hidden">

          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 md:py-6 px-2 md:px-4 text-left text-xs md:text-lg font-bold">Job Card #</th>
              <th className="py-3 md:py-6 px-2 md:px-4 text-left text-xs md:text-lg font-bold">Vehicle</th>
              <th className="py-3 md:py-6 px-2 md:px-4 text-left text-xs md:text-lg font-bold">Service Type</th>
              <th className="py-3 md:py-6 px-2 md:px-4 text-left text-xs md:text-lg font-bold">Odometer</th>
              <th className="py-3 md:py-6 px-2 md:px-4 text-left text-xs md:text-lg font-bold">Voltage</th>
              <th className="py-3 md:py-6 px-2 md:px-4 text-left text-xs md:text-lg font-bold">Status</th>
              <th className="py-3 md:py-6 px-2 md:px-4 text-left text-xs md:text-lg font-bold">Created</th>
              <th className="py-3 md:py-6 px-2 md:px-4 text-left text-xs md:text-lg font-bold">Action</th>
            </tr>
          </thead>

          <tbody>
            {jobCards.map((job) => (
              <tr key={job.id} className="border-t text-xs md:text-lg hover:bg-gray-50">

                <td className="px-2 md:px-4 py-2 md:py-3 font-bold whitespace-nowrap">
                  {job.jobCardNumber}
                </td>

                <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">
                  {job.vehicle?.model || "-"}
                </td>

                <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">
                  {job.serviceType}
                </td>

                <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">
                  {job.odometer ?? "-"}
                </td>

                <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">
                  {job.batteryVoltage ?? "-"}
                </td>

                <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded text-xs md:text-sm ${
                      statusColors[job.status] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {job.status}
                  </span>
                </td>

                <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">
                  {new Date(job.createdAt).toLocaleDateString()}
                </td>

                <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap space-x-2">

                  <Link
                    to={`/job-cards/${job.id}`}
                    className="text-blue-600 underline text-xs md:text-sm"
                  >
                    View
                  </Link>

                  <Link
                    to={`/customer/raise-complaint?jobCardId=${job.id}`}
                    className="text-red-600 underline text-xs md:text-sm"
                  >
                    Complaint
                  </Link>

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>

    {/* ================= MOBILE CARDS ================= */}
    <div className="md:hidden flex flex-col gap-4 mt-4">

      {jobCards.map((job) => (
        <div
          key={job.id}
          className="bg-white text-black rounded-2xl p-4 shadow-md"
        >

          {/* HEADER */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">{job.jobCardNumber}</h3>
            <span className="text-xs px-2 py-1 rounded bg-gray-100">
              {job.status}
            </span>
          </div>

          {/* VEHICLE */}
          <p className="text-gray-700 font-medium">
            {job.vehicle?.model || "-"}
          </p>

          {/* DETAILS */}
          <div className="text-sm text-gray-600 mt-2">
            Service: {job.serviceType} <br />
            Odometer: {job.odometer ?? "-"} <br />
            Voltage: {job.batteryVoltage ?? "-"}
          </div>

          {/* DATE */}
          <div className="text-xs text-gray-500 mt-2">
            📅 {new Date(job.createdAt).toLocaleDateString()}
          </div>

          {/* ACTIONS */}
          <div className="mt-3 flex gap-3">

            <Link
              to={`/job-cards/${job.id}`}
              className="flex-1 text-center bg-blue-600 text-white py-2 rounded text-sm"
            >
              View
            </Link>

            <Link
              to={`/customer/raise-complaint?jobCardId=${job.id}`}
              className="flex-1 text-center bg-red-600 text-white py-2 rounded text-sm"
            >
              Complaint
            </Link>

          </div>

        </div>
      ))}

    </div>

  </>
  )}

  {error && <p className="text-red-400 mt-6">{error}</p>}

</div>

);
}
