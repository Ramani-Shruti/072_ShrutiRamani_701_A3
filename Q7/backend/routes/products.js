const router = require("express").Router();
const multer = require("multer");
const Product = require("../models/Product");
const Category = require("../models/Category");
const { auth, adminOnly } = require("../middleware/auth");

const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
  }),
});

// list products, filter by ?sub=<subId> or ?main=<mainId>
router.get("/", async (req, res) => {
  let filter = {};
  if (req.query.sub) {
    filter.category = req.query.sub;
  } else if (req.query.main) {
    const subs = await Category.find({ parent: req.query.main });
    filter.category = { $in: subs.map((s) => s._id) };
  }
  const products = await Product.find(filter).populate("category");
  res.json(products);
});

router.post("/", auth, adminOnly, upload.single("image"), async (req, res) => {
  const { name, description, price, category } = req.body;
  if (!name || !price || !category) return res.status(400).json({ message: "Name, price, category required" });
  const p = await Product.create({
    name, description, price, category,
    image: req.file ? req.file.filename : "",
  });
  res.json(p);
});

router.put("/:id", auth, adminOnly, upload.single("image"), async (req, res) => {
  const data = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
  };
  if (req.file) data.image = req.file.filename;
  const p = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
  res.json(p);
});

router.delete("/:id", auth, adminOnly, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
