import jwt from "jsonwebtoken";

/* ================= AUTHENTICATE ================= */
export const authenticate = (req, res, next) => {
  // ✅ SAFE PUBLIC ROUTE BYPASS (FINAL FIX)
  const publicPaths = ["/api/whatsapp", "/api/chat"];

  const isPublic = publicPaths.some((route) =>
    req.originalUrl.startsWith(route) ||
    req.baseUrl?.startsWith(route) ||
    req.path?.startsWith(route)
  );

  if (isPublic) {
    return next();
  }

  const authHeader = req.headers.authorization;

  // 🔐 Check token presence
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authorization token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    const userId = decoded.id ?? decoded.customerId;

    if (!userId || !decoded.role) {
      return res.status(401).json({
        error: "Invalid token payload",
      });
    }

    // ✅ Attach normalized user
    req.user = {
      ...decoded,
      id: decoded.id || decoded.customerId
    };
    
    next();
  } catch (err) {
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
};

/* ================= AUTHORIZE ROLES ================= */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    // ✅ ADMIN bypass
    if (req.user.role === "ADMIN") {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    next();
  };
};