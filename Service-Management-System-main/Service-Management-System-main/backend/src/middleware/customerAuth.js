import jwt from "jsonwebtoken";

export const requireCustomer = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔐 Ensure this is a CUSTOMER token
    if (decoded.role !== "CUSTOMER" || !decoded.customerId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // 🔥 THIS IS THE FIX
    req.user = {
      id: decoded.customerId, // <-- normalize
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error("Customer auth error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};
