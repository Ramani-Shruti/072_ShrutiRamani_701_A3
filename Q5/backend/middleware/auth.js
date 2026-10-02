const jwt = require("jsonwebtoken");

// checks "Authorization: Bearer <token>" header
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, please login" });
  }
  try {
    const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    req.empId = decoded.empId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = auth;
