import { useEffect, useState } from "react";
import axios from "axios";

type Slot = {
  time: string;
  isBooked: boolean;
};

type DaySlots = {
  id: number;
  date: string;
  slots: Slot[];
};

export default function SlotAvailability() {
  const [slotsData, setSlotsData] = useState<DaySlots[]>([]);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/test-rides");

        const formatted = res.data.map((day: any, index: number) => ({
          id: index,
          date: new Date(day.date).toDateString(),
          slots: day.slots.map((slot: any) => ({
            time: slot.time,
            isBooked: slot.isBooked,
          })),
        }));

        setSlotsData(formatted);
      } catch (error) {
        console.error("Failed to load slots:", error);
      }
    };

    fetchSlots();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Available Slots
        </h2>

        <div className="space-y-8">
          {slotsData.map((day: DaySlots) => (
            <div key={day.id} className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {day.date}
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {day.slots.map((slot: Slot, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg text-center font-medium transition ${
                      !slot.isBooked
                        ? "bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {slot.time}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-600 mt-8">
          Click on an available slot to book your service appointment
        </p>
      </div>
    </section>
  );
}