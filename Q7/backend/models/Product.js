const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String, // file name in uploads folder
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // sub category
});

module.exports = mongoose.model("Product", productSchema);
