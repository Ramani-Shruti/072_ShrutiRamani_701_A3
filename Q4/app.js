require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const Admin = require("./models/Admin");
const Employee = require("./models/Employee");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "erp_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/erpdb")
  .then(async () => {
    console.log("MongoDB connected");
    // create default admin first time
    const count = await Admin.countDocuments();
    if (count === 0) {
      const hash = await bcrypt.hash("admin123", 10);
      await Admin.create({ username: "admin", password: hash });
      console.log("Default admin created -> admin / admin123");
    }
  })
  .catch((err) => console.log("MongoDB error:", err.message));

// email setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendWelcomeMail(emp, plainPassword) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emp.email,
      subject: "Welcome to the company",
      text:
        "Hello " + emp.name + ",\n\n" +
        "Your employee account has been created.\n" +
        "Employee ID: " + emp.empId + "\n" +
        "Password: " + plainPassword + "\n\n" +
        "Basic Salary: " + emp.basicSalary + "\n" +
        "Net Salary: " + emp.netSalary + "\n\nRegards,\nHR",
    });
    console.log("Mail sent to " + emp.email);
  } catch (err) {
    console.log("Mail not sent:", err.message);
  }
}

function isAdmin(req, res, next) {
  if (req.session.admin) next();
  else res.redirect("/login");
}

// generate next emp id like EMP1001, EMP1002 ...
async function generateEmpId() {
  const last = await Employee.findOne().sort({ createdAt: -1 });
  if (!last) return "EMP1001";
  const num = parseInt(last.empId.replace("EMP", "")) + 1;
  return "EMP" + num;
}

function generatePassword() {
  return Math.random().toString(36).slice(-8);
}

// ---------- auth ----------
app.get("/", (req, res) => res.redirect("/employees"));

app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", async (req, res) => {
  const admin = await Admin.findOne({ username: req.body.username });
  if (!admin || !(await bcrypt.compare(req.body.password, admin.password))) {
    return res.render("login", { error: "Invalid username or password" });
  }
  req.session.admin = admin.username;
  res.redirect("/employees");
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

// ---------- employee CRUD ----------
app.get("/employees", isAdmin, async (req, res) => {
  const employees = await Employee.find().sort({ createdAt: 1 });
  res.render("employees", { employees: employees, admin: req.session.admin, msg: req.query.msg });
});

app.get("/employees/add", isAdmin, (req, res) => {
  res.render("form", { emp: {}, action: "/employees/add", title: "Add Employee" });
});

app.post("/employees/add", isAdmin, async (req, res) => {
  const plainPassword = generatePassword();
  const emp = new Employee({
    empId: await generateEmpId(),
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(plainPassword, 10),
    department: req.body.department,
    designation: req.body.designation,
    basicSalary: Number(req.body.basicSalary),
  });
  try {
    await emp.save();
  } catch (err) {
    return res.render("form", { emp: req.body, action: "/employees/add", title: "Add Employee", error: err.message });
  }
  sendWelcomeMail(emp, plainPassword);
  // showing password once to admin also (useful if mail is not configured)
  res.redirect("/employees?msg=" + encodeURIComponent("Added " + emp.empId + " with password " + plainPassword));
});

app.get("/employees/edit/:id", isAdmin, async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  res.render("form", { emp: emp, action: "/employees/edit/" + emp._id, title: "Edit Employee" });
});

app.post("/employees/edit/:id", isAdmin, async (req, res) => {
  await Employee.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    email: req.body.email,
    department: req.body.department,
    designation: req.body.designation,
    basicSalary: Number(req.body.basicSalary),
  });
  res.redirect("/employees?msg=Employee updated");
});

app.get("/employees/delete/:id", isAdmin, async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.redirect("/employees?msg=Employee deleted");
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
