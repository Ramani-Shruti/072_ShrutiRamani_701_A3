const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { body, validationResult } = require("express-validator");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// multer setup - save files in uploads folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1000) + "-" + file.originalname);
  },
});

// only allow images
function fileFilter(req, file, cb) {
  const allowed = ["image/jpeg", "image/png", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    req.fileError = "Only jpg, png and gif images are allowed";
    cb(null, false);
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
});

const uploadFields = upload.fields([
  { name: "profilePic", maxCount: 1 },
  { name: "otherPics", maxCount: 5 },
]);

// validation rules
const rules = [
  body("username").trim().notEmpty().withMessage("Username is required")
    .isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
  body("email").isEmail().withMessage("Enter a valid email"),
  body("gender").notEmpty().withMessage("Select gender"),
  body("hobbies").custom((value) => {
    if (!value || value.length === 0) {
      throw new Error("Select at least one hobby");
    }
    return true;
  }),
];

// delete uploaded files if form has errors
function removeFiles(files) {
  if (!files) return;
  Object.values(files).flat().forEach((f) => {
    fs.unlink(f.path, () => {});
  });
}

app.get("/", (req, res) => {
  res.render("register", { errors: [], old: {} });
});

app.post("/register", (req, res) => {
  uploadFields(req, res, async (err) => {
    let errors = [];
    if (err) {
      // multer error like file too large / too many files
      errors.push({ msg: "Upload error: " + err.message });
    }

    // run express-validator after multer has parsed the body
    for (const rule of rules) {
      await rule.run(req);
    }
    const result = validationResult(req);
    errors = errors.concat(result.array());

    if (req.fileError) errors.push({ msg: req.fileError });

    const files = req.files || {};
    if (!files.profilePic) errors.push({ msg: "Profile picture is required" });
    if (!files.otherPics) errors.push({ msg: "Upload at least one other picture" });

    // make hobbies always an array
    let hobbies = req.body.hobbies || [];
    if (!Array.isArray(hobbies)) hobbies = [hobbies];
    req.body.hobbies = hobbies;

    if (errors.length > 0) {
      removeFiles(req.files);
      return res.render("register", { errors: errors, old: req.body });
    }

    const user = {
      username: req.body.username,
      email: req.body.email,
      gender: req.body.gender,
      hobbies: hobbies,
      profilePic: files.profilePic[0].filename,
      otherPics: files.otherPics.map((f) => f.filename),
    };
    res.render("result", { user: user });
  });
});

// download route
app.get("/download/:name", (req, res) => {
  const fileName = path.basename(req.params.name); // avoid ../ tricks
  const filePath = path.join(__dirname, "uploads", fileName);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }
  res.download(filePath);
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
