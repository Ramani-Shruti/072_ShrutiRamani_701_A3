const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });
  if (await User.findOne({ email })) return res.status(400).json({ message: "Email already registered" });
  await User.create({ name, email, password: await bcrypt.hash(password, 10) });
  res.json({ message: "Registered, please login" });
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, name: user.name, role: user.role });
});

module.exports = router;
