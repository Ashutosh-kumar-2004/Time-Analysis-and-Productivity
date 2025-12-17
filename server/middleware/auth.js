import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  // Bypass auth for OPTIONS requests (CORS preflight)
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default protect;
