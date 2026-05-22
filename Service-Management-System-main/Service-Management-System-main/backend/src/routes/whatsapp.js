import express from "express";
import dotenv from "dotenv";
import twilio from "twilio";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { sendWhatsAppMessage } from "../utils/sendWhatsApp.js";

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const router = express.Router();
const prisma = new PrismaClient();
const MessagingResponse = twilio.twiml.MessagingResponse;

/* =========================
   🧠 SESSION STORE
========================= */
const sessions = {};

/* =========================
   📦 SAVE VIA CONTROLLER (FIXED)
========================= */
async function saveBookingAPI(phone, data) {
  try {
    console.log("📤 Sending booking to backend...");

    // ✅ FORMAT PHONE (same as website)
    const digits = phone.replace(/\D/g, "").slice(-10);
    const formattedPhone = `+91 ${digits.slice(0, 5)}-${digits.slice(5)}`;

    // ✅ FORMAT DATE (FIXED - NO TIMEZONE ISSUE)
const [dd, mm, yyyy] = data.date.split("/");

const formattedDate = new Date(
  Date.UTC(yyyy, mm - 1, dd)
).toISOString();
    const response = await axios.post(
      "http://localhost:4000/api/public/service-bookings",
      {
        mobileNumber: formattedPhone, 
        vehicleNumber: data.vehicle,
        vehiclePart: data.part.toUpperCase().replace(/ /g, "_"),
        serviceType: mapServiceType(data.service),
        preferredDate: formattedDate, 
        timeSlot: data.time,
       notes: `${data.issue} | Vehicle: ${data.vehicle} | WhatsApp`,
      }
    );

    console.log("✅ RESPONSE:", response.data);

    return {
      success: true,
      data: response.data,
    };

  } catch (err) {
    console.log("====== BACKEND ERROR ======");
    console.log(err.response?.data);

    return {
      success: false,
      message: err.response?.data?.error || "Something went wrong",
    };
  }
}

/* =========================
   🧠 HELPERS
========================= */
function mapServiceType(service) {
  const map = {
    "General Complaint": "GENERAL",
    "Battery Complaint": "BATTERY",
    "Charger Complaint": "CHARGER",
    "Paid Service with Repairable Complaints": "PAID_SERVICE_REPAIRABLE",
    "Paid Service with Warranty Replacement": "PAID_SERVICE_WARRANTY",
    "Spares Parts Dispatch": "SPARES_DISPATCH",
  };

  return map[service] || "";
}

function formatDate(dateStr) {
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`;
}
function convertToISO(dateStr) {
  const [day, month, year] = dateStr.split("/");

  const date = new Date(year, month - 1, day);

  if (isNaN(date)) {
    throw new Error("Invalid date format");
  }

  return date;
}
  const BROCHURE_URL =
  "https://drive.google.com/uc?export=download&id=164J_EfoWnGKxOVSltXW-76H-BCWO9os1";
/* =========================
   🤖 CHATBOT LOGIC
========================= */
async function processMessage(phone, message) {
  message = String(message || "").toLowerCase().trim();

// ✅ GLOBAL EXIT HANDLER
if (["exit", "cancel", "stop"].includes(message)) {
  delete sessions[phone];
  return "❌ Conversation ended.\n\nType 'hi' to start again.";
}

if (message === "menu") {
  sessions[phone] = {
    state: "main_choice",
    data: {},
  };

  return `Hi! What would you like to do?

1️ Sales
2️ Service`;
}
  if (!sessions[phone]) {
    sessions[phone] = {
      state: "main_menu",
      data: {},
    };
  }

  const session = sessions[phone];
  const data = session.data;

  console.log("STATE:", session.state, "| MESSAGE:", message);

  try {

    /* =========================
   🏁 MAIN MENU
========================= */
if (session.state === "main_menu") {

  if (
    message.startsWith("hi") ||
    message.startsWith("hello") ||
    message === "start"
  ) {
    session.state = "main_choice";

    return `Hi! What would you like to do?

1️ Sales
2️ Service`;
  }

  return "Type 'hi' to start";
}


/* =========================
   🔘 MAIN CHOICE
========================= */
if (session.state === "main_choice") {

  if (message === "sales") message = "1";
  if (message === "service") message = "2";

  /* ===== SALES ===== */
  if (message === "1") {
    session.state = "sales_menu";

   return `💼 Sales Options:

1️ Book Test Ride
2️ Get Brochure
3️ Speak to Sales`;
  }

  /* ===== SERVICE ===== */
  if (message === "2") {
    session.state = "service_menu";

    return `🔧 Service Options:

1️ Bike Issue
2️ Locate Service Center
3️ Speak to Service`;
  }

  return "❌ Please choose 1 or 2";
}

/* =========================
   💼 SALES MENU 
========================= */
if (session.state === "sales_menu") {

  if (message === "1") {
    session.state = "test_ride_bike";

    return `🏍️ Select Bike:

1️ Flee High Speed
2️ Flee Low Speed`;
  }

  if (message === "2") {
    return {
      type: "media",
      body: "📄 Here is our brochure"
    };
  }

  if (message === "3") {
    return "📞 Call Sales: +91 70199 08703";
  }

  return `❌ Please choose:

1️ Book Test Ride
2️ Get Brochure
3️ Speak to Sales`;
}

/* =========================
   🔧 SERVICE FLOW (CLEAN)
========================= */

if (session.state === "service_menu") {

  if (message === "1") {
    session.state = "service_issue";
    return "Please describe your issue.";
  }

  if (message === "2") {
    return "📍 Service Center: Bangalore";
  }

  if (message === "3") {
    return "📞 Call Service: +91 82172 54248";
  }

  return "❌ Choose 1, 2 or 3";
}


/* =========================
   🔧 ISSUE
========================= */
if (session.state === "service_issue") {

  data.issue = message;

  session.state = "vehicle_number";

  return "🚗 Enter your vehicle number";
}


/* =========================
   🚗 VEHICLE (VALIDATE)
========================= */
if (session.state === "vehicle_number") {

  const vehicleInput = message.toUpperCase().trim();

  try {
    const res = await axios.get(`http://localhost:4000/api/public/vehicles/${vehicleInput}`);

    if (!res.data) {
      return "❌ Vehicle not found. Please enter a valid vehicle number.";
    }

    data.vehicle = vehicleInput;

    session.state = "vehicle_part";

    return `Select affected part:

1️ Battery
2️ Brakes
3️ Display
4️ Body
5️ Carrier
6️ Chassis
7️ Rust
8️ Wheels
9️ Foot Board
10 All Switches
11️ Lights & Indicators
12️ Solenoid
13️ Mudguards
14️ Charger`;

  } catch (err) {
    return "❌ Vehicle not found. Please enter a valid vehicle number.";
  }
}


/* =========================
   🔧 PART
========================= */
if (session.state === "vehicle_part") {

  const parts = {
    "1": "Battery",
    "2": "Brakes",
    "3": "Display",
    "4": "Body",
    "5": "Carrier",
    "6": "Chassis",
    "7": "Rust",
    "8": "Wheels",
    "9": "Foot Board",
    "10": "All Switches",
    "11": "Lights & Indicators",
    "12": "Solenoid",
    "13": "Mudguards",
    "14": "Charger",
  };

  const selectedPart = parts[message];

  if (!selectedPart) {
    return "❌ Invalid choice. Select 1–14";
  }

  data.part = selectedPart;

  session.state = "service_type";

  return `🔧 Select service type:

1️ General Service
2️ General Complaint
3️ Battery Complaint
4️ Charger Complaint
5️ Paid Service with Repairable Complaints
6️ Paid Service with Warranty Replacement
7️ Spares Parts Dispatch`;
}


/* =========================
   🔧 SERVICE TYPE
========================= */
if (session.state === "service_type") {

  const types = {
    "1": "GENERAL_SERVICE",
    "2": "GENERAL_COMPLAINT",
    "3": "BATTERY_COMPLAINT",
    "4": "CHARGER_COMPLAINT",
    "5": "PAID_SERVICE_REPAIR",
    "6": "PAID_SERVICE_WARRANTY",
    "7": "SPARES_PARTS_DISPATCH",
  };

  const labels = {
    "1": "General Service",
    "2": "General Complaint",
    "3": "Battery Complaint",
    "4": "Charger Complaint",
    "5": "Paid Service with Repairable Complaints",
    "6": "Paid Service with Warranty Replacement",
    "7": "Spares Parts Dispatch",
  };

  const selectedType = types[message];

  if (!selectedType) {
    return "❌ Select 1–7";
  }

  data.serviceType = selectedType;
  data.serviceLabel = labels[message];

  session.state = "service_date";

  return "📅 Enter preferred date (DD/MM/YYYY)";
}


/* =========================
   📅 DATE
========================= */
if (session.state === "service_date") {

  data.date = message;

  data.location =
    "3/2, Magrath Road, Richmond Town, Bengaluru – 560025";

  session.state = "service_time";

  return `🏢 Service Location:
3/2, Magrath Road, Richmond Town, Bengaluru

⏰ Choose time slot:
1. 10:30–12 AM
2. 2–3 PM
3. 3–5 PM`;
}


/* =========================
   ⏰ TIME + BOOKING
========================= */
if (session.state === "service_time") {

  const slots = {
    "1": "10:30–12 AM",
    "2": "2–3 PM",
    "3": "3–5 PM",
  };

  if (!slots[message]) {
    return "❌ Choose 1, 2 or 3";
  }

  data.time = slots[message];

 data.time = slots[message];

// 👉 MOVE TO CONFIRM STEP
session.state = "service_confirm";

return `Please confirm your Service Booking:

Vehicle: ${data.vehicle}
Issue: ${data.issue}
Part: ${data.part}
Service: ${data.serviceLabel}
Date: ${data.date}
Time: ${data.time}
Location: ${data.location}

Reply YES to confirm or NO to cancel`;
}
/* =========================
   ✅ SERVICE CONFIRMATION
========================= */
if (session.state === "service_confirm") {

  if (message === "yes") {

    const result = await saveBookingAPI(phone, data);

    if (!result.success) {
      return `❌ ${result.message}`;
    }

    delete sessions[phone];

    return `✅ Service Booked!

Vehicle: ${data.vehicle}
Issue: ${data.issue}
Part: ${data.part}
Service: ${data.serviceLabel}
Date: ${data.date}
Time: ${data.time}
Location: ${data.location}`;
  }

  if (message === "no") {
    delete sessions[phone];
    return "❌ Booking cancelled. Type 'hi' to restart.";
  }

  return "Please reply YES or NO.";
}

/* ===== TEST RIDE FLOW ===== */

// STEP 1 — ENTRY (from guest menu)
if (session.state === "guest_menu" && message === "3") {
  session.state = "test_ride_bike";

  return `🏍️ Select Bike:

1️ Flee Low Speed
2️ Flee High Speed`;
}

// STEP 2 — BIKE
if (session.state === "test_ride_bike") {

  const bikes = {
    "1": "Flee Low Speed",
    "2": "Flee High Speed",
  };

  if (!bikes[message]) return "❌ Select 1 or 2";

  data.bike = bikes[message];
  session.state = "test_ride_location";

  return `📍 Select Location:

1️ Bangalore
2️ Goa`;
}

// STEP 3 — LOCATION
if (session.state === "test_ride_location") {

  const locations = {
    "1": "Bangalore",
    "2": "Goa",
  };

  if (!locations[message]) return "❌ Select 1 or 2";

  data.location = locations[message];
  session.state = "test_ride_date";

  return "📅 Enter preferred date (DD/MM/YYYY)";
}

// STEP 4 — DATE
if (session.state === "test_ride_date") {
  data.date = message;
  session.state = "test_ride_time";

  return `⏰ Select time slot:

1️ 11:00 AM
2️ 12:00 PM
3️ 1:00 PM`;
}

// STEP 5 — TIME
if (session.state === "test_ride_time") {

  const slots = {
  "1": "11:00 AM",
  "2": "12:00 PM",
  "3": "1:00 PM",
};

  if (!slots[message]) return "❌ Select 1–3";

  data.time = slots[message];
  session.state = "test_ride_name";

  return "👤 Enter your name";
}

// STEP 6 — NAME
if (session.state === "test_ride_name") {
  data.name = message;
  session.state = "test_ride_phone";

  return "📞 Enter your phone number";
}

// STEP 7 — PHONE
if (session.state === "test_ride_phone") {
  data.phone = message;
  session.state = "test_ride_email";

  return "📧 Enter your email";
}

// STEP 8 — EMAIL
if (session.state === "test_ride_email") {

  if (!message.includes("@")) {
    return "❌ Invalid email. Please enter a valid email.";
  }

  data.email = message;
  session.state = "test_ride_address";

  return "📍 Enter your address";
}


// STEP 9 — ADDRESS
if (session.state === "test_ride_address") {

  data.address = message;
  session.state = "test_ride_confirm";

  return `Please confirm your Test Ride:

Bike: ${data.bike}
Location: ${data.location}
Date: ${data.date}
Time: ${data.time}
Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email}
Address: ${data.address}

Reply YES to confirm or NO to cancel`;
}


// STEP 10 — CONFIRMATION
if (session.state === "test_ride_confirm") {
if (message.toLowerCase() === "yes") {

  try {
    await axios.post("http://localhost:4000/api/public/test-rides", {
      bikeName: data.bike,
      location: data.location,
      date: convertToISO(data.date),
      timeSlot: data.time,
      fullName: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address
    });

    console.log("✅ Test ride saved to DB");

  } catch (err) {
    console.error("❌ TEST RIDE SAVE ERROR:", err.response?.data);
    return "❌ Failed to save booking. Please try again.";
  }

  delete sessions[phone];

  return `✅ Test Ride Booked Successfully!

Bike: ${data.bike}
Location: ${data.location}
Date: ${data.date}
Time: ${data.time}

We will contact you shortly.`;
}
  if (message.toLowerCase() === "no") {

    delete sessions[phone];

    return "❌ Booking cancelled. Type 'hi' to restart.";
  }

  return "Please reply YES or NO.";
}
/* ===== TEST RIDE FLOW END ===== */

return "❌ Invalid input";

  } catch (error) {
    console.error("PROCESS MESSAGE ERROR:", error);
    return "❌ Something went wrong. Please try again.";
  }
}
/* =========================
   📩 TWILIO WEBHOOK
========================= */
router.post("/", async (req, res) => {
  try {
    const { Body, From } = req.body;

    const phone = From.replace("whatsapp:", "");
    console.log(`📩 ${phone}: ${Body}`);

    res.status(200).send("OK");

    const reply = await processMessage(phone, Body);

    console.log("REPLY:", reply);

    //const BROCHURE_URL =
    // "https://secular-mural-proclaim.ngrok-free.dev/uploads/flee-brochure.pdf";

    // ✅ MEDIA
    if (typeof reply === "object" && reply.type === "media") {
      await client.messages.create({
        from: "whatsapp:+14155238886",
        to: `whatsapp:${phone}`,
        body: reply.body || "File",
        mediaUrl: [BROCHURE_URL],
      });
    }

    // ✅ TEXT
    else {
      const cleanReply = String(reply)
        .replace(/\n+/g, "\n")
        .trim();

      await sendWhatsAppMessage(phone, cleanReply);
    }

  } catch (err) {
    console.error("🔥 ERROR:", err);
  }
});
export default router;