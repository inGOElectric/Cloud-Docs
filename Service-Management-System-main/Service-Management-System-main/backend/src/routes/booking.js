import express from "express";
import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/", async (req, res) => {
  const {
    phone,
    service_type,
    vehicle_number,
    date,
    location,
    time_slot,
    source
  } = req.body;

  try {
    const id = uuidv4();

    await pool.query(
      `INSERT INTO bookings 
      (id, phone, service_type, vehicle_number, date, location, time_slot, source)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [id, phone, service_type, vehicle_number, date, location, time_slot, source]
    );

    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "DB error" });
  }
});

export default router;