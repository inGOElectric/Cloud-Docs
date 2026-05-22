import pkg from "@prisma/client";
const { PrismaClient } = pkg;


export const prismaMiddleware = async (req, res, next) => {
  try {
    const prisma = new PrismaClient();

    req.prisma = prisma;

    res.on("finish", async () => {
      await prisma.$disconnect();
    });

    next();
  } catch (err) {
    console.error("Prisma middleware error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
};
