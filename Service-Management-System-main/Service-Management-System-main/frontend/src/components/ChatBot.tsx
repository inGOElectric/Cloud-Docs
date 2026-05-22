import { useState, useEffect, useRef } from "react";
import { X, RotateCcw, MessageCircle } from "lucide-react";
import axios from "axios";
import logo from "../assets/logo.png";

const VEHICLE_PARTS = [
  "Battery",
  "Brakes",
  "Display",
  "Body",
  "Carrier",
  "Chassis",
  "Rust",
  "Wheels",
  "Foot Board",
  "All Switches",
  "Lights & Indicators",
  "Solenoid",
  "Mudguards",
  "Charger",
];

const SERVICE_TYPES = [
  { label: "General Service", value: "GENERAL" },
  { label: "General Complaint", value: "COMPLAINT" },
  { label: "Battery Complaint", value: "BATTERY" },
  { label: "Charger Complaint", value: "CHARGER" },
  { label: "Paid Service with Repairable Complaints", value: "PAID_SERVICE_REPAIRABLE" },
  { label: "Paid Service with Warranty Replacement", value: "PAID_SERVICE_WARRANTY" },
  { label: "Spares Parts Dispatch", value: "SPARES_DISPATCH" },
];

type Message = {
  sender: "bot" | "user";
  text: string;
  time?: string;
  options?: { label: string; action: () => void }[];
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState("idle");

  const [formData, setFormData] = useState({
  // 🔹 TEST RIDE
  name: "",
  phone: "",
  email: "",
  address:"",
  location: "",
  bike: "",
  date: "",
  slot: "",

  // 🔹 SERVICE
  issue: "",
  vehicleNumber: "",
  part: "",
  serviceType: "",
  serviceDate: "",
  serviceSlot: "",
});

  useEffect(() => {
    resetChat();
  }, []);

  useEffect(() => {
    if (!hasOpened) {
      const timer = setTimeout(() => {
        setOpen(true);
        setHasOpened(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [hasOpened]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (msg: Message) => {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [...prev, { ...msg, time }]);
  };

  const addOptionsMessage = (text: string, options: any[]) => {
    setMessages((prev) => [...prev, { sender: "bot", text, options }]);
  };

  const handleOptionClick = (label: string, action: () => void) => {
    // disable old options
    setMessages(prev =>
  prev.map((m, i) =>
    i === prev.length - 1 ? { ...m, options: undefined } : m
  )
);

    addMessage({ sender: "user", text: label });
    action();
  };

  // 🔥 NEW ENTRY FLOW
  const resetChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "Hi! what would you like to do ?:",
        options: [
          { label: "💼 Sales", action: handleSales },
          { label: "🔧 Service", action: handleService },
        ],
      },
    ]);

    setStep("idle");

   setFormData({
  // 🔹 TEST RIDE
  name: "",
  phone: "",
  email: "",
  address:"",
  location: "",
  bike: "",
  date: "",
  slot: "",

  // 🔹 SERVICE
  issue: "",
  vehicleNumber: "",
  part: "",
  serviceType: "",
  serviceDate: "",
  serviceSlot: "",
});
  };

  // 🔹 SALES FLOW
  function handleSales() {
    addOptionsMessage("💼 Sales Options:", [
      { label: "🚗 Book Test Ride", action: startBooking },
      { label: "📄 Brochure & Specs", action: handleBikeInfo },
      {
        label: "📞 Speak to Sales",
        action: () => {
          addMessage({
            sender: "bot",
            text: "📞 Call Sales: +91 70199 08703",
          });
        },
      },
    ]);
  }

  // 🔹 SERVICE FLOW
  function handleService() {
    addOptionsMessage("🔧 Service Options:", [
      {
        label: "🔧 Bike Issue",
        action: () => {
          setStep("service_issue");
          addMessage({
            sender: "bot",
            text: "Please describe your issue.",
          });
        },
      },
      {
        label: "📍 Locate Service Center",
        action: () => {
          addMessage({
            sender: "bot",
            text: "📍 Service Center: Bangalore (update later)",
          });
        },
      },
      {
        label: "📞 Speak to Service",
        action: () => {
          addMessage({
            sender: "bot",
            text: "📞 Call Service: +91 82172 54248",
          });
        },
      },
    ]);
  }

 const openBrochure = () => {
  window.open("/brochures/flee-brochure.pdf", "_blank");

  addOptionsMessage("What would you like to do next?", [
    { label: "⬇️ Download Brochure", action: downloadBrochure },
    { label: "🚗 Book Test Ride", action: startBooking },
  ]);
};
  const downloadBrochure = () => {
  const link = document.createElement("a");
  link.href = "/brochures/flee-brochure.pdf";
  link.download = "Flee-Brochure.pdf";
  link.click();

  addOptionsMessage("What would you like to do next?", [
    { label: "📄 View Brochure", action: openBrochure },
    { label: "🚗 Book Test Ride", action: startBooking },
  ]);
};
  function handleBikeInfo() {
    addMessage({
      sender: "bot",
      text: `🚀 Flee High Speed • Range: 120 km • Top Speed: 75 km/h
⚡ Flee Low Speed • Range: 90 km • Top Speed: 60 km/h`,
    });

    addOptionsMessage("What would you like to do?", [
      { label: "📄 View Brochure", action: openBrochure },
      { label: "⬇️ Download Brochure", action: downloadBrochure },
      { label: "🚗 Book Test Ride", action: startBooking },
    ]);
  }

  function startBooking() {
    setStep("name");
    addMessage({ sender: "bot", text: "Great! What is your name?" });
  }
  

 const handleUserFlow = async (message: string) => {
    
  if (step === "service_issue") {
  setFormData((p) => ({ ...p, issue: message }));

  setStep("service_vehicle");

  addMessage({
    sender: "bot",
    text: "Enter your vehicle number",
  });

  return;
}

  if (step === "service_vehicle") {
  try {
   const res = await axios.get(
  `http://localhost:4000/api/public/vehicles/${message}`
);

    setFormData((p) => ({ ...p, vehicleNumber: message }));

    setStep("service_part");

    addOptionsMessage(
      "Select vehicle part:",
      VEHICLE_PARTS.map((part) => ({
        label: part,
        action: () => selectPart(part),
      }))
    );

  } catch (err) {
    addMessage({
      sender: "bot",
      text: "❌ Vehicle not found",
    });

    addOptionsMessage("What would you like to do?", [
      {
        label: "📍 Locate Service Center",
        action: () =>
          addMessage({
            sender: "bot",
            text: "Visit nearest service center.",
          }),
      },
      {
        label: "📞 Speak to Service",
        action: () =>
          addMessage({
            sender: "bot",
            text: "📞 +91 82172 54248",
          }),
      },
    ]);

    setStep("service_vehicle"); 
  }

  return;
}
if (step === "service_date") {
  // ✅ validate date
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(message)) {
    addMessage({
      sender: "bot",
      text: "❌ Please use format DD/MM/YYYY",
    });
    return;
  }

  // ✅ CREATE UPDATED OBJECT (IMPORTANT FIX)
  const updated = {
    ...formData,
    serviceDate: message,
  };

  // ✅ SET STATE
  setFormData(updated);

  // ✅ MOVE STEP
  setStep("service_slot");

  // ✅ PASS UPDATED DATA FOR NEXT STEP (CRITICAL)
  addOptionsMessage("Select time slot:", [
    {
      label: "10:30 AM-12 PM",
      action: () => selectServiceSlot("10:30 AM-12 PM", updated),
    },
    {
      label: "2:00 PM-3:00 PM",
      action: () => selectServiceSlot("2:00 PM-3:00 PM", updated),
    },
    {
      label: "3:00-5:00 PM",
      action: () => selectServiceSlot("3:00-5:00 PM", updated),
    },
  ]);

  return;
}

//** TEST RIDE FLOW */

if (step === "name") {
  setFormData((p) => ({ ...p, name: message }));
  setStep("phone");
  addMessage({ sender: "bot", text: "Enter your phone number" });
  return;
}

if (step === "phone") {
  if (!/^[6-9]\d{9}$/.test(message)) {
    addMessage({ sender: "bot", text: "❌ Enter valid phone number" });
    return;
  }

  setFormData((p) => ({ ...p, phone: message }));
  setStep("email");
  addMessage({ sender: "bot", text: "Enter your email" });
  return;
}

/* ================= EMAIL ================= */
if (step === "email") {
  if (message && !/^\S+@\S+\.\S+$/.test(message)) {
    addMessage({ sender: "bot", text: "❌ Invalid email" });
    return;
  }

  setFormData((p) => ({ ...p, email: message }));
  setStep("address"); // ✅ NEW STEP

  addMessage({
    sender: "bot",
    text: "🏠 Enter your address (building, street, area, PIN code)",
  });

  return;
}

/* ================= ADDRESS ================= */
if (step === "address") {
  if (!message.trim()) {
    addMessage({
      sender: "bot",
      text: "❌ Address cannot be empty",
    });
    return;
  }

  setFormData((p) => ({ ...p, address: message }));

  setStep("bike");

  addOptionsMessage("Select a bike:", [
    { label: "Flee High Speed", action: () => selectBike("Flee High Speed") },
    { label: "Flee Low Speed", action: () => selectBike("Flee Low Speed") },
  ]);

  return;
}
/* ================= DATE ================= */
if (step === "date") {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(message)) {
    addMessage({ sender: "bot", text: "❌ Use format DD/MM/YYYY" });
    return;
  }

  const updated = { ...formData, date: message };

  setFormData(updated);
  setStep("slot");

  addOptionsMessage("Select a time slot:", [
    { label: "11:00 AM", action: () => selectSlot("11:00 AM", updated) },
    { label: "12:00 PM", action: () => selectSlot("12:00 PM", updated) },
    { label: "1:00 PM", action: () => selectSlot("1:00 PM", updated) },
  ]);

  return;
}

 }

  //** SERVICE FLOW HELPER FUNCTIONS */

  const selectPart = (part: string) => {
  setFormData((p) => ({ ...p, part }));

  setStep("service_type");

  addOptionsMessage(
    "Select service type:",
    SERVICE_TYPES.map((type) => ({
     label: type.label,
      action: () => selectServiceType(type),
    }))
  );
};

const selectServiceType = (type: any) => {
  setFormData((p) => ({
    ...p,
    serviceType: type.value,        
    serviceTypeLabel: type.label,   
  }));

  setStep("service_date");

  addMessage({
    sender: "bot",
    text: "Enter preferred date (DD/MM/YYYY)",
  });
};

const selectServiceSlot = (slot: string, currentData?: any) => {
  const base = currentData || formData;

const updated = {
  ...base,
  serviceSlot: slot,
};

  // ✅ update state
  setFormData(updated);
  setStep("confirm");

  // ✅ show summary
  addMessage({
    sender: "bot",
    text: `📋 Booking Summary:
🚗 Vehicle: ${updated.vehicleNumber}
🔧 Part: ${updated.part}
📄 Type: ${updated.serviceTypeLabel}
📅 Date: ${updated.serviceDate}
⏰ Time: ${slot}`,
  });

  // ✅ IMPORTANT: pass updated, NOT formData
  addOptionsMessage("Confirm service request?", [
    {
      label: "✅ Confirm",
      action: () => submitService(updated), 
    },
  ]);
};
const submitService = async (data: any) => {
  console.log("FINAL DATA:", data);

  try {
    const [dd, mm, yyyy] = data.serviceDate.split("/");

    // ✅ FIXED (IMPORTANT)
    const formattedDate = new Date(`${yyyy}-${mm}-${dd}`).toISOString();

    await axios.post(
      "http://localhost:4000/api/public/service-bookings",
      {
        vehicleNumber: data.vehicleNumber,
        vehiclePart: data.part,
        serviceType: data.serviceType,
        preferredDate: formattedDate, 
        timeSlot: data.serviceSlot,
        notes: data.issue || "Website Bot",
      }
    );

    addMessage({
      sender: "bot",
      text: "✅ Service request submitted successfully!",
    });

    setStep("idle");

  } catch (err: any) {
    console.log("ERROR:", err.response?.data); 

    const msg =
      err.response?.data?.error ||
      "❌ Failed to create service booking";

    addMessage({
      sender: "bot",
      text: msg,
    });

    setStep("service_slot");

    addOptionsMessage("Select another time slot:", [
      { label: "10:30-12 PM", action: () => selectServiceSlot("10:30-12 PM") },
      { label: "2:00-3:00 PM", action: () => selectServiceSlot("2:00-3:00 PM") },
      { label: "3:00-5:00 PM", action: () => selectServiceSlot("3:00-5:00 PM") },
    ]);
  }
};
//* ================= TEST RIDE HELPER FUNCTIONS ================= */

const selectLocation = (loc: string) => {
  setFormData((p) => ({ ...p, location: loc }));

  setStep("date");

  addMessage({
    sender: "bot",
    text: "📅 Enter preferred date (DD/MM/YYYY)",
  });
};

// ✅ THEN
const selectBike = (bike: string) => {
  setFormData((p) => ({ ...p, bike }));

  setStep("location");

  addOptionsMessage("📍 Select your location:", [
    { label: "Bangalore", action: () => selectLocation("Bangalore") },
    { label: "Goa", action: () => selectLocation("Goa") },
  ]);
};

  const selectSlot = (slot: string, currentData: any) => {
    const updated = { ...currentData, slot };

    setFormData(updated);
    setStep("confirm");

    addMessage({
      sender: "bot",
      text: `📋 Booking Summary:

👤 ${updated.name}
📞 ${updated.phone}
📧 ${updated.email || "N/A"}
${updated.address ? `🏠 ${updated.address}\n` : ""}
📍 ${updated.location}
🏍 ${updated.bike}
📅 ${updated.date}
⏰ ${slot}`,
    });

    addOptionsMessage("Confirm booking?", [
      { label: "✅ Confirm", action: () => confirmBooking(updated) },
      { label: "✏️ Edit", action: startBooking },
    ]);
  };

  const confirmBooking = async (data: any) => {
    const [dd, mm, yyyy] = data.date.split("/");
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    const digits = data.phone.replace(/\D/g, "");
    const formattedPhone = `+91 ${digits.slice(0, 5)}-${digits.slice(5)}`;

    try {
      await axios.post("http://localhost:4000/api/test-rides", {
        fullName: data.name,
        phone: formattedPhone,
        email: data.email || "",
        address: data.address || "",
        location: data.location || "Bangalore",
        bikeName: data.bike,
        date: formattedDate,
        timeSlot: data.slot,
      });

      addMessage({ sender: "bot", text: "✅ Booking confirmed!" });
      setStep("idle");
    }catch (err: any) {
  const errorMsg =
    err.response?.data?.message ||
    "❌ The slot is full choose the another one";

  // ✅ Show real backend message
  addMessage({
    sender: "bot",
    text: errorMsg,
  });

  // 🔥 Allow re-selection of slot
  setStep("slot");

  addOptionsMessage("⚠️ Slot is full. What would you like to do?", [
  { label: "🕒 Change Time", action: () => retryTimeSelection(data) },
  { label: "📅 Change Date", action: () => retryDateSelection() },
]);
function retryTimeSelection(data: any) {
  setStep("slot");

  addOptionsMessage("Select another time slot:", [
    { label: "11:00 AM", action: () => selectSlot("11:00 AM", data) },
    { label: "12:00 PM", action: () => selectSlot("12:00 PM", data) },
    { label: "1:00 PM", action: () => selectSlot("1:00 PM", data) },
  ]);
}
function retryDateSelection() {
  setStep("date");

  addMessage({
    sender: "bot",
    text: "Enter a new date (DD/MM/YYYY)",
  });
}
}
  };

  const sendMessage = () => {
  if (!input.trim()) return;

  const msg = input.toLowerCase();

  addMessage({ sender: "user", text: input });

  if (step !== "idle") {
    handleUserFlow(input);
  } else {
    // ✅ if user types "download brochure"
    if (msg.includes("download") && msg.includes("brochure")) {
      downloadBrochure();
    }

    // ✅ if user types "brochure"
    else if (msg.includes("brochure")) {
      openBrochure();
    }

    // ✅ if user types "book"
    else if (msg.includes("book")) {
      startBooking();
    }

    // ✅ fallback
    else {
      addOptionsMessage("Choose an option:", [
        { label: "🚗 Book Test Ride", action: startBooking },
        { label: "📄 Brochure & Specs", action: handleBikeInfo },
      ]);
    }
  }

  setInput("");
};

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg">
        <MessageCircle size={22} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[350px] h-[520px] bg-white shadow-xl rounded-xl flex flex-col">

      <div className="bg-black text-white flex justify-between items-center px-4 py-3">
        <div className="flex items-center gap-2">
          <img src={logo} className="w-7 h-7 rounded-full bg-black p-1" />
          <span className="text-sm font-semibold">FLEE Assistant</span>
        </div>

        <div className="flex gap-3">
          <button onClick={resetChat}><RotateCcw size={18} /></button>
          <button onClick={() => setOpen(false)}><X size={18} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((m, i) => (
  <div
    key={i}
    className={`flex ${
      m.sender === "user" ? "justify-end" : "justify-start"
    } items-starts gap-2`}
  >
    {/* ✅ BOT LOGO */}
    {m.sender === "bot" && (
      <img
  src={logo}
  alt="bot"
  className="w-7 h-7 rounded-full bg-black p-1 object-contain"
/>
    )}

    {/* MESSAGE + TIME */}
    <div className="flex flex-col max-w-[75%]">
      <div
        className={`px-4 py-3 rounded-lg text-sm whitespace-pre-line ${
          m.sender === "bot"
            ? "bg-gray-200"
            : "bg-blue-500 text-white"
        }`}
      >
        {m.text}
      </div>

      {/* ✅ TIME OUTSIDE */}
      {m.time && (
        <div
          className={`text-[10px] mt-1 ${
            m.sender === "user"
              ? "text-right text-gray-500"
              : "text-right text-gray-500"
          }`}
        >
          {m.time}
        </div>
      )}

      {/* OPTIONS */}
      {m.options && (
        <div className="flex flex-col gap-2 mt-2">
          {m.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(opt.label, opt.action)}
              className="bg-black text-white px-3 py-2 rounded-lg text-sm"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
))}
        <div ref={chatEndRef} />
      </div>

      <div className="border-t flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-3 outline-none"
          placeholder="Type message..."
        />
        <button onClick={sendMessage} className="bg-black text-white px-4">
          ➤
        </button>
      </div>
    </div>
  );
}