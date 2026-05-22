import { useEffect, useState } from "react";
import client from "../../api/client";

export default function SlotsAvailability() {
  const [slots, setSlots] = useState([]);
  const [testRideHistory, setTestRideHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const today = new Date();

      const twoMonthsLater = new Date();
      twoMonthsLater.setMonth(today.getMonth() + 2);

      const res = await client.get("/test-rides/slots-range", {
        params: {
          startDate: today.toISOString(),
          endDate: twoMonthsLater.toISOString(),
        },
      });

      setSlots(res.data || []);

      const historyRes = await client.get("/test-rides");
      console.log("🔥 TEST RIDES API:", historyRes.data); // DEBUG

      const data = historyRes.data || [];

console.log("🔥 TEST RIDES API DATA:", data);

setTestRideHistory(data);
    } catch (err) {
      console.error("Failed to load slots:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOCAL DATE (UI SIDE)
  const formatLocalDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  // ✅ BACKEND DATE (NO SHIFT)
  const formatBackendDate = (date) => {
    if (!date) return "";
    return date.split("T")[0];
  };

  // ✅ STRONG TIME CLEANING (BULLETPROOF)
  const cleanTime = (time) => {
    if (!time) return "";

    return time
      .toString()
      .replace(/\s+/g, "") 
      .toUpperCase()       
      .replace(/^0/, "");  
  };

  // ✅ BUILD CONFIRMED SET (VERY FLEXIBLE)
  const confirmedSet = new Set();

  (testRideHistory || []).forEach((ride) => {
    // 🔥 HANDLE ANY POSSIBLE FIELD NAME
    const backendDate =
      ride.date ||
      ride.rideDate ||
      ride.bookingDate ||
      ride.createdAt;

    const backendTime =
      ride.timeSlot ||
      ride.slotTime ||
      ride.time ||
      ride.slot;

    const status = ride.status?.trim().toUpperCase();

    console.log("🔍 RIDE CHECK:", {
      backendDate,
      backendTime,
      status,
    });

    if (!backendDate || !backendTime) return;
    if (status === "CANCELLED") return;

    const key = `${formatBackendDate(backendDate)}_${cleanTime(
      backendTime
    )}`;

    console.log("✅ ADDING KEY:", key);

    confirmedSet.add(key);
  });

  console.log("🟢 FINAL BOOKED SET:", Array.from(confirmedSet));

  // ✅ GROUP BY MONTH
  const groupedByMonth = slots.reduce((acc, day) => {
    const date = new Date(day.date);

    const monthKey = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(day);

    return acc;
  }, {});

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#01263B] text-white flex items-center justify-center">
        Loading slots...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#01263B] text-white">
      <div className="w-full px-6 md:px-10 py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Test Ride Availability
        </h1>

        {Object.keys(groupedByMonth).length === 0 && (
          <p className="text-center text-gray-400">
            No slots available
          </p>
        )}

        {Object.entries(groupedByMonth).map(([month, days]) => (
          <div key={month} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b border-cyan-700 pb-2">
              {month}
            </h2>

            <div className="grid gap-6">
              {days.map((day) => {
                const localDate = formatLocalDate(day.date);

                return (
                  <div
                    key={day.date}
                    className="bg-[#0A3A55] rounded-xl p-5 shadow-lg"
                  >
                    <h3 className="font-semibold mb-4 text-cyan-300">
                      {new Date(day.date).toDateString()}
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {(day.slots || []).map((slot) => {
                        const slotKey = `${localDate}_${cleanTime(
                          slot.time
                        )}`;

                       const isBooked = slot.isBooked;
                        console.log("🧪 SLOT CHECK:", {
                          slotKey,
                          isBooked,
                        });

                        return (
                          <button
                            key={slot.time}
                            disabled={isBooked}
                            className={`
                              py-2 rounded-lg text-sm font-semibold border transition-all duration-200
                              ${
                                isBooked
                                  ? "bg-green-600 text-white border-green-700 cursor-not-allowed"
                                  : "bg-[#083147] text-white border-cyan-500 hover:bg-cyan-600 hover:scale-105"
                              }
                            `}
                          >
                            {slot.time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}