import prisma from "../../prisma/client.js";

/* ===============================
   GET WORK LOGS FOR A JOB CARD
================================ */
export const getWorkLogsByJobCard = async (req, res) => {
  try {
    const jobCardId = Number(req.params.id);

    const logs = await prisma.workLog.findMany({
      where: { jobCardId },
      orderBy: { createdAt: "desc" },
    });

    res.json(logs);

  } catch (error) {
    console.error("Fetch work logs failed:", error);
    res.status(500).json({ error: "Failed to fetch work logs" });
  }
};
/* ===============================
    CREATE WORK LOG 
================================ */
export const createWorkLog = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const jobCardId = Number(req.params.id);
    const { taskName, description, technicianName } = req.body;

    if (!taskName) {
      return res.status(400).json({
        error: "taskName is required"
      });
    }

    // ✅ USE FRONTEND VALUE ONLY
    if (!technicianName) {
      return res.status(400).json({
        error: "Technician name is required"
      });
    }

    const log = await prisma.workLog.create({
      data: {
        jobCardId,
        taskName,
        description: description || null,
        technicianName, // ✅ THIS IS THE FIX
        status: "IN_PROGRESS",
        startedAt: new Date()
      }
    });

    res.status(201).json(log);

  } catch (error) {
    console.error("Create work log failed:", error);
    res.status(500).json({ error: "Failed to create work log" });
  }
};
/* ===============================
   START WORK
================================ */
export const startWorkLog = async (req, res) => {
  try {

    const id = Number(req.params.id);

    const log = await prisma.workLog.update({
      where: { id },
      data: {
        status: "IN_PROGRESS",
        startedAt: new Date()
      }
    });

    res.json(log);

  } catch (error) {
    console.error("Start work log failed:", error);
    res.status(500).json({ error: "Failed to start work log" });
  }
};


/* ===============================
   COMPLETE WORK
================================ */
export const completeWorkLog = async (req, res) => {
  try {

    const id = Number(req.params.id);

    const log = await prisma.workLog.update({
      where: { id },
      data: {
        status: "COMPLETED",
        completedAt: new Date()
      }
    });

    res.json(log);

  } catch (error) {
    console.error("Complete work log failed:", error);
    res.status(500).json({ error: "Failed to complete work log" });
  }
};