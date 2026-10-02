const router = require("express").Router();
const Order = require("../models/Order");
const { auth, adminOnly } = require("../middleware/auth");

// logged in user's orders
router.get("/my", auth, async (req, res) => {
  res.json(await Order.find({ user: req.user.id }).sort({ createdAt: -1 }));
});

// all orders for admin
router.get("/", auth, adminOnly, async (req, res) => {
  res.json(await Order.find().populate("user", "name email").sort({ createdAt: -1 }));
});

module.exports = router;
