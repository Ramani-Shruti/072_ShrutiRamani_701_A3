const router = require("express").Router();
const Category = require("../models/Category");
const Product = require("../models/Product");
const { auth, adminOnly } = require("../middleware/auth");

// returns main categories with their sub categories inside
router.get("/", async (req, res) => {
  const all = await Category.find();
  const tree = all
    .filter((c) => !c.parent)
    .map((main) => ({
      _id: main._id,
      name: main.name,
      subs: all.filter((s) => String(s.parent) === String(main._id)),
    }));
  res.json(tree);
});

router.post("/", auth, adminOnly, async (req, res) => {
  if (!req.body.name) return res.status(400).json({ message: "Name required" });
  const cat = await Category.create({ name: req.body.name, parent: req.body.parent || null });
  res.json(cat);
});

router.put("/:id", auth, adminOnly, async (req, res) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
  res.json(cat);
});

router.delete("/:id", auth, adminOnly, async (req, res) => {
  // do not delete if it has sub categories or products
  const subs = await Category.countDocuments({ parent: req.params.id });
  const prods = await Product.countDocuments({ category: req.params.id });
  if (subs > 0 || prods > 0) {
    return res.status(400).json({ message: "Remove its sub categories / products first" });
  }
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
