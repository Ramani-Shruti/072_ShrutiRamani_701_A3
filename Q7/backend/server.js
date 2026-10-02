require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/products", require("./routes/products"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/orders", require("./routes/orders"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    // create admin account first time
    if (!(await User.findOne({ role: "admin" }))) {
      await User.create({
        name: "Admin",
        email: "admin@shop.com",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
      });
      console.log("Admin created -> admin@shop.com / admin123");
    }
  })
  .catch((err) => console.log("MongoDB error:", err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("API running on http://localhost:" + PORT));
