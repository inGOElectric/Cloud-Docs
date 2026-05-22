import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookService() {

  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    vehiclePart: "",
    serviceType: "GENERAL",
    timeSlot: "",
    notes: ""
  });

  const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "notes") {
    const limited = value.slice(0, 50); // ✂️ cut to 50 chars

    setForm((prev) => ({
      ...prev,
      [name]: limited,
    }));
    return;
  }

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  /* =========================
     SUBMIT BOOKING
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.vehiclePart || !selectedDate || !form.timeSlot) {
      alert("Please fill all required fields");
      return;
    }

    try {

      setSubmitting(true);

     await client.post("/service-bookings/me/service-bookings", {
        vehiclePart: form.vehiclePart,
        serviceType: form.serviceType,
        preferredDate: selectedDate.toISOString(),   // backend safe
        timeSlot: form.timeSlot,
        notes: form.notes
      });

      alert("Service booked successfully");

      navigate("/dashboard");

    } catch (err) {

      const message =
        err.response?.data?.error || "Failed to book service";

      alert(message);

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#01263B] py-12 px-4">

      <div className="max-w-2xl mx-auto bg-white p-10 rounded-xl border border-gray-200 shadow-xl">

        <h1 className="text-xl font-semibold mb-1">
          Book a Service
        </h1>

        <p className="text-sm text-gray-600 mb-5">
          Choose vehicle part, preferred date and time slot
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* VEHICLE PART */}

          <div>
            <label className="block text-sm font-medium mb-1">
              Select Vehicle Part *
            </label>

            <select
              name="vehiclePart"
              value={form.vehiclePart}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select vehicle part</option>
              <option value="BATTERY">Battery</option>
              <option value="BRAKES">Brakes</option>
              <option value="DISPLAY">Display</option>
              <option value="BODY">Body</option>
              <option value="CARRIER">Carrier</option>
              <option value="CHASSIS">Chassis</option>
              <option value="RUST">Rust</option>
              <option value="WHEELS">Wheels</option>
              <option value="FOOT_BOARD">Foot Board</option>
              <option value="SWITCHES">All Switches</option>
              <option value="LIGHTS">Lights & Indicators</option>
              <option value="SOLENOID">Solenoid</option>
              <option value="MUDGUARDS">Mudguards</option>
              <option value="CHARGER">Charger</option>
            </select>
          </div>

          {/* SERVICE TYPE */}

          <div>
            <label className="block text-sm font-medium mb-1">
              Service Type
            </label>

            <select
              name="serviceType"
              value={form.serviceType}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="GENERAL">General Service</option>
              <option value="COMPLAINT">General Complaint</option>
              <option value="BATTERY">Battery Complaint</option>
              <option value="CHARGER">Charger Complaint</option>
              <option value="PAID_SERVICE_REPAIRABLE">
                Paid Service with Repairable Complaints
              </option>
              <option value="PAID_SERVICE_WARRANTY">
                Paid Service with Warranty Replacement
              </option>
              <option value="SPARES_DISPATCH">
                Spares Parts Dispatch
              </option>
            </select>
          </div>

          {/* DATE */}

          <div>
            <label className="block text-sm font-medium mb-1">
              Preferred Date *
            </label>

            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              placeholderText="Select date"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* TIME SLOT */}

          <div>
            <label className="block text-sm font-medium mb-1">
              Time Slot *
            </label>

            <select
              name="timeSlot"
              value={form.timeSlot}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Choose time slot</option>
              <option value="10:30–12 PM">10:30–12 PM</option>
              <option value="2–3 PM">2–3 PM</option>
              <option value="3–5 PM">3–5 PM</option>
            </select>
          </div>

          {/* NOTES */}

          <div>
            <label className="block text-sm font-medium mb-1">
              Additional Notes (optional)
            </label>

            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              {form.notes?.length || 0} / 50 characters
            </p>
          </div>

          {/* BUTTONS */}

          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-5 py-2 rounded disabled:opacity-60"
            >
              {submitting ? "Booking..." : "Book Service"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}