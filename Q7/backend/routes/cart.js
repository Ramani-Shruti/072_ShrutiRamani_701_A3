const router = require("express").Router();
const User = require("../models/User");
const Order = require("../models/Order");
const { auth } = require("../middleware/auth");

async function getCart(userId) {
  const user = await User.findById(userId).populate("cart.product");
  // skip items whose product was deleted by admin
  return user.cart.filter((i) => i.product);
}

router.get("/", auth, async (req, res) => {
  res.json(await getCart(req.user.id));
});

// add product (or increase qty if already in cart)
router.post("/add", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  const item = user.cart.find((i) => String(i.product) === req.body.productId);
  if (item) item.qty++;
  else user.cart.push({ product: req.body.productId, qty: 1 });
  await user.save();
  res.json(await getCart(req.user.id));
});

// change qty, qty 0 removes item
router.put("/:productId", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  const qty = Number(req.body.qty);
  if (qty <= 0) {
    user.cart = user.cart.filter((i) => String(i.product) !== req.params.productId);
  } else {
    const item = user.cart.find((i) => String(i.product) === req.params.productId);
    if (item) item.qty = qty;
  }
  await user.save();
  res.json(await getCart(req.user.id));
});

// place order from cart
router.post("/checkout", auth, async (req, res) => {
  const cart = await getCart(req.user.id);
  if (cart.length === 0) return res.status(400).json({ message: "Cart is empty" });
  const items = cart.map((i) => ({ name: i.product.name, price: i.product.price, qty: i.qty }));
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const order = await Order.create({ user: req.user.id, items, total });
  await User.findByIdAndUpdate(req.user.id, { cart: [] });
  res.json(order);
});

module.exports = router;
