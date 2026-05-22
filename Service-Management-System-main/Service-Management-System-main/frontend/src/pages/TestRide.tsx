import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import DatePicker from "react-datepicker";

import "react-phone-input-2/lib/style.css";
import "react-datepicker/dist/react-datepicker.css";

/* ================= LOCAL DATA ================= */

const bangaloreAreas = [
  { name: "Whitefield", area: "East Bangalore", pincode: "560066" },
  { name: "Indiranagar", area: "Central Bangalore", pincode: "560038" },
  { name: "Koramangala", area: "South Bangalore", pincode: "560034" },
  { name: "BTM Layout", area: "South Bangalore", pincode: "560076" },
  { name: "Marathahalli", area: "East Bangalore", pincode: "560037" },
  { name: "Electronic City", area: "South Bangalore", pincode: "560100" },
  { name: "Yelahanka", area: "North Bangalore", pincode: "560064" },
  { name: "Hebbal", area: "North Bangalore", pincode: "560024" },
  { name: "Jayanagar", area: "South Bangalore", pincode: "560041" },
  { name: "HSR Layout", area: "South-East Bangalore", pincode: "560102" },
];

/* ================= TYPES ================= */

interface FormData {
  bike: string;
  location: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  lat?: number;
  lng?: number;
}

interface Place {
  display_name: string;
  full_address?: string;
  lat?: number;
  lon?: number;
  type?: "local" | "pincode" | "api";
}

/* ================= COMPONENT ================= */

export default function TestRide() {

  const routerLocation = useLocation();
  const navigate = useNavigate();
  const selectedBike = (routerLocation.state as any)?.bike || "";

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [formData, setFormData] = useState<FormData>({
    bike: selectedBike,
    location: "",
    date: "",
    time: "",
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* ================= SMART SEARCH ================= */

  const searchLocation = (value: string) => {

    setQuery(value);

    if (searchTimeout) clearTimeout(searchTimeout);

    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeout = setTimeout(async () => {

      try {

        /* ===== LOCAL SEARCH ===== */
        const localResults = bangaloreAreas
          .filter(area =>
            area.name.toLowerCase().includes(value.toLowerCase())
          )
          .map(area => ({
            display_name: area.name,
            full_address: `${area.area} – ${area.pincode}`,
            type: "local" as const
          }));


        /* ===== PINCODE SEARCH ===== */
        const isPincode = /^\d{4,6}$/.test(value);

        let pincodeResults: Place[] = [];

        if (isPincode) {
          pincodeResults = bangaloreAreas
            .filter(area => area.pincode.startsWith(value))
            .map(area => ({
              display_name: area.name,
              full_address: `${area.area} – ${area.pincode}`,
              type: "pincode"
            }));
        }


        /* ===== PHOTON FALLBACK ===== */
        let apiResults: Place[] = [];

        if (localResults.length < 5) {

          const res = await fetch(
            `https://photon.komoot.io/api/?q=${encodeURIComponent(value)}&limit=6&lat=12.9716&lon=77.5946`
          );

          const data = await res.json();

          apiResults = data.features
            .filter((item: any) =>
              item.properties.state?.toLowerCase().includes("karnataka") ||
              item.properties.city?.toLowerCase().includes("bangalore")
            )
            .map((item: any) => {

              const p = item.properties;

              const name = p.name || "";
              const house = p.housenumber || "";
              const street = p.street || "";
              const suburb = p.suburb || p.district || "";
              const city = p.city || "Bangalore";
              const postcode = p.postcode || "";

              const title = [
                name,
                house && street ? `${house} ${street}` : street
              ]
                .filter(Boolean)
                .join(", ");

              const subtitle = [
                suburb,
                city,
                postcode ? `- ${postcode}` : ""
              ]
                .filter(Boolean)
                .join(", ");

              return {
                display_name: title || suburb || city,
                full_address: subtitle,
                lat: item.geometry.coordinates[1],
                lon: item.geometry.coordinates[0],
                type: "api"
              };
            });
        }


        /* ===== MERGE ===== */
        const finalResults = [
          ...pincodeResults,
          ...localResults,
          ...apiResults
        ].slice(0, 6);

        setSuggestions(finalResults);
        setShowSuggestions(true);

      } catch (err) {
        console.error("Search error:", err);
      }

    }, 250);

    setSearchTimeout(timeout);
  };

  /* ================= BOOK ================= */

  const handleConfirm = async () => {

    try {

      setLoading(true);

      await axios.post("http://localhost:4000/api/test-rides", {
        bikeName: formData.bike,
        location: formData.location,
        date: formData.date,
        timeSlot: formData.time,
        fullName: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        lat: formData.lat,
        lng: formData.lng,
      });

      alert("Test Ride Booked Successfully ✅");
      navigate("/");

    } catch (error: any) {

      alert(
        error?.response?.data?.message ||
        "Booking failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  /* ================= DATA ================= */

  const bikes = [
  {
    name: "Flee-low-speed",
    image: "/bikes/flee-low-speed/default.png",
  },
  {
    name: "Flee-high-speed",
    image: "/bikes/flee-high-speed/default.png",
  }
];
  const locations = ["Bangalore", "Goa"];

  /* ================= UI ================= */

  return (

    <div className="min-h-screen bg-black flex justify-center items-start py-16 px-6">

      <div className="w-full max-w-6xl bg-[#0f172a] rounded-xl p-10 grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT */}
        <div>

          <h2 className="text-xl font-semibold mb-6 text-white">Select Bike</h2>

          <div className="grid grid-cols-2 gap-6 mb-8">

            {bikes.map((bike) => (
              <div
                key={bike.name}
                onClick={() => setFormData({ ...formData, bike: bike.name })}
                className={`cursor-pointer bg-gray-800 rounded-xl p-5 border transition hover:scale-105 ${
                  formData.bike === bike.name
                    ? "border-blue-500"
                    : "border-gray-700 hover:border-gray-500"
                }`}
              >
                <img src={bike.image} className="w-full h-32 object-contain mb-3" />
                <p className="text-center text-white text-sm">{bike.name}</p>
              </div>
            ))}

          </div>

          <h2 className="text-lg font-semibold mb-3 text-white">Location</h2>

          <div className="flex gap-3">

            {locations.map((loc) => (
              <button
                key={loc}
                onClick={() => setFormData({ ...formData, location: loc })}
                className={`px-5 py-2 rounded-lg text-sm ${
                  formData.location === loc
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                {loc}
              </button>
            ))}

          </div>

        </div>

        {/* RIGHT */}
        <div>

          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => {
              setSelectedDate(date);
              if (date) {
                setFormData({
                  ...formData,
                  date: date.toISOString().split("T")[0]
                });
              }
            }}
            minDate={new Date()}
            placeholderText="Select Date"
            className="w-full p-3 mb-4 bg-gray-800 text-white rounded-lg"
          />

          <select
  value={formData.time}
  onChange={(e) =>
    setFormData({ ...formData, time: e.target.value })
  }
  className="w-full p-3 bg-gray-800 border border-gray-700 text-white rounded-lg mb-6"
>
  <option value="">Select Time Slot</option>
  <option>11:00 AM</option>
  <option>12:00 PM</option>
  <option>1:00 PM</option>
</select>

          <h2 className="text-lg font-semibold mb-4 text-white">
  Your Details
</h2>

<input
  placeholder="Full Name"
  value={formData.name}
  onChange={(e) =>
    setFormData({ ...formData, name: e.target.value })
  }
  className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 text-white rounded-lg"
/>

<PhoneInput
  country={"in"}
  value={formData.phone}
  onChange={(phone) =>
    setFormData({ ...formData, phone })
  }
  inputStyle={{
    width: "100%",
    backgroundColor: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "8px",
    color: "white",
  }}
/>

<input
  type="email"
  placeholder="Email Address"
  value={formData.email}
  onChange={(e) =>
    setFormData({ ...formData, email: e.target.value })
  }
  className="w-full p-3 mt-4 mb-6 bg-gray-800 border border-gray-700 text-white rounded-lg"
/>

<input
            type="text"
            placeholder="Search Bangalore building, street, area, or PIN code"
            value={query}
            onChange={(e) => searchLocation(e.target.value)}
            className="w-full p-3 bg-white text-black rounded-lg"
          />

          {/* Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="bg-white mt-2 rounded-lg shadow max-h-60 overflow-y-auto">

              {suggestions.map((place, i) => (
                <div
                  key={i}
                  onClick={() => {

                    const full = `${place.display_name}, ${place.full_address || ""}`;

                    setQuery(full);

                    setFormData({
                      ...formData,
                      address: full,
                      lat: place.lat,
                      lng: place.lon
                    });

                    setShowSuggestions(false);
                  }}
                  className="p-3 hover:bg-blue-100 cursor-pointer border-b"
                >
                  <p className="font-medium">{place.display_name}</p>
                  <p className="text-xs text-gray-600">{place.full_address}</p>
                </div>
              ))}

            </div>
          )}

          <button
            onClick={handleConfirm}
            className="w-full mt-6 py-3 bg-green-600 text-white rounded-lg"
          >
            Confirm Booking
          </button>

        </div>

      </div>

    </div>
  );
}