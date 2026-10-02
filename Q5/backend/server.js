require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("./models/Employee");
const Leave = require("./models/Leave");
const auth = require("./middleware/auth");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err.message));

// login with empId + password (created by admin in Q4)
app.post("/api/login", async (req, res) => {
  const { empId, password } = req.body;
  const emp = await Employee.findOne({ empId: empId });
  if (!emp) return res.status(400).json({ message: "Invalid Emp ID or password" });

  const match = await bcrypt.compare(password, emp.password);
  if (!match) return res.status(400).json({ message: "Invalid Emp ID or password" });

  const token = jwt.sign({ empId: emp.empId }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token: token, name: emp.name });
});

// Page 1 - profile
app.get("/api/profile", auth, async (req, res) => {
  const emp = await Employee.findOne({ empId: req.empId }).select("-password");
  if (!emp) return res.status(404).json({ message: "Employee not found" });
  res.json(emp.toJSON({ virtuals: true }));
});

// Page 2 - leave list
app.get("/api/leaves", auth, async (req, res) => {
  const leaves = await Leave.find({ empId: req.empId }).sort({ date: -1 });
  res.json(leaves);
});

// Page 2 - add leave
app.post("/api/leaves", auth, async (req, res) => {
  const { date, reason, grant } = req.body;
  if (!date || !reason) {
    return res.status(400).json({ message: "Date and reason are required" });
  }
  const leave = await Leave.create({ empId: req.empId, date, reason, grant: grant || "No" });
  res.json(leave);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("API running on http://localhost:" + PORT));
