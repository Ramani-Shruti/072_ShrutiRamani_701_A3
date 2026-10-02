const mongoose = require("mongoose");

// 2 level category:
// parent = null      -> main category (e.g. Electronics)
// parent = <cat id>  -> sub category  (e.g. Mobiles under Electronics)
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
});

module.exports = mongoose.model("Category", categorySchema);
