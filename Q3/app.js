const express = require("express");
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const { createClient } = require("redis");

const app = express();
const PORT = 3000;

// connect to redis server
const redisClient = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });
redisClient.connect()
  .then(() => console.log("Connected to Redis"))
  .catch((err) => console.log("Redis error:", err.message));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// sessions are saved in redis with key prefix "sess:"
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 30 }, // 30 minutes
  })
);

// dummy users (no database for this practical)
const users = [
  { username: "admin", password: "admin123" },
  { username: "student", password: "student123" },
];

// middleware to protect routes
function isLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

app.get("/", (req, res) => {
  res.redirect(req.session.user ? "/dashboard" : "/login");
});

app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const found = users.find((u) => u.username === username && u.password === password);
  if (!found) {
    return res.render("login", { error: "Invalid username or password" });
  }
  req.session.user = found.username;
  req.session.visits = 0;
  res.redirect("/dashboard");
});

// protected route 1
app.get("/dashboard", isLoggedIn, (req, res) => {
  req.session.visits++;
  res.render("page", {
    title: "Dashboard",
    user: req.session.user,
    message: "You have opened protected pages " + req.session.visits + " times in this session.",
  });
});

// protected route 2
app.get("/profile", isLoggedIn, (req, res) => {
  req.session.visits++;
  res.render("page", {
    title: "Profile",
    user: req.session.user,
    message: "Session ID: " + req.sessionID,
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
