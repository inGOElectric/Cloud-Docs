import prisma from "../../prisma/client.js";

/**
 * Upload media for a job card
 * POST /api/job-cards/:jobCardId/media
 */
export const uploadJobCardMedia = async (req, res) => {
  try {
    const jobCardId = Number(req.params.jobCardId);

    if (!jobCardId || Number.isNaN(jobCardId)) {
      return res.status(400).json({ error: "Invalid job card ID" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    const fileType = req.file.mimetype.startsWith("image")
      ? "IMAGE"
      : req.file.mimetype.startsWith("video")
      ? "VIDEO"
      : null;

    if (!fileType) {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    const context = req.body.context || "GENERAL";

    const media = await prisma.jobCardMedia.create({
      data: {
        jobCardId,
        fileUrl: `/uploads/job-cards/${jobCardId}/${req.file.filename}`,
        fileType,
        context,
      },
    });

    res.status(201).json(media);
  } catch (error) {
    console.error("Upload media failed:", error);
    res.status(500).json({ error: "Upload failed" });
  }
};

/**
 * Get all media for a job card
 * GET /api/job-cards/:jobCardId/media
 */
export const getJobCardMedia = async (req, res) => {
  try {
    const jobCardId = Number(req.params.jobCardId);

    if (!jobCardId || Number.isNaN(jobCardId)) {
      return res.status(400).json({ error: "Invalid job card ID" });
    }

    const media = await prisma.jobCardMedia.findMany({
      where: { jobCardId },
      orderBy: { uploadedAt: "desc" }, // ✅ FIXED
    });

    res.json(media);
  } catch (error) {
    console.error("Fetch media failed:", error);
    res.status(500).json({ error: "Failed to fetch media" });
  }
};

/**
 * Get single media item
 * GET /api/job-cards/:jobCardId/media/:mediaId
 */
export const getJobCardMediaById = async (req, res) => {
  try {
    const jobCardId = Number(req.params.jobCardId);
    const mediaId = Number(req.params.mediaId);

    if (
      !jobCardId ||
      !mediaId ||
      Number.isNaN(jobCardId) ||
      Number.isNaN(mediaId)
    ) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const media = await prisma.jobCardMedia.findUnique({
      where: { id: mediaId },
    });

    if (!media || media.jobCardId !== jobCardId) {
      return res.status(404).json({ error: "Media not found" });
    }

    res.json(media);
  } catch (error) {
    console.error("Fetch single media failed:", error);
    res.status(500).json({ error: "Failed to fetch media" });
  }
};
