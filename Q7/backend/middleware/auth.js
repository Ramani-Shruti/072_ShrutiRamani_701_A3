const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Please login" });
  try {
    req.user = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET); // { id, role }
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin only" });
  next();
}

module.exports = { auth, adminOnly };
