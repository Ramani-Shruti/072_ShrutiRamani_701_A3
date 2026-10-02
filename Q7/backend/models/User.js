const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  // cart is saved inside user document
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      qty: { type: Number, default: 1 },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
