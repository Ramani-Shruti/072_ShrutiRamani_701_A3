const express = require("express");
const cors = require("cors");
const sequelize = require("./db");
const Student = require("./models/Student");

const app = express();
app.use(cors());
app.use(express.json());

// error message from sequelize validation
function errMsg(err) {
  if (err.errors) return err.errors.map((e) => e.message).join(", ");
  return err.message;
}

// READ all
app.get("/api/students", async (req, res) => {
  const students = await Student.findAll({ order: [["rollNo", "ASC"]] });
  res.json(students);
});

// READ one
app.get("/api/students/:id", async (req, res) => {
  const s = await Student.findByPk(req.params.id);
  if (!s) return res.status(404).json({ message: "Student not found" });
  res.json(s);
});

// CREATE
app.post("/api/students", async (req, res) => {
  try {
    const s = await Student.create(req.body);
    res.status(201).json(s);
  } catch (err) {
    res.status(400).json({ message: errMsg(err) });
  }
});

// UPDATE
app.put("/api/students/:id", async (req, res) => {
  const s = await Student.findByPk(req.params.id);
  if (!s) return res.status(404).json({ message: "Student not found" });
  try {
    await s.update(req.body);
    res.json(s);
  } catch (err) {
    res.status(400).json({ message: errMsg(err) });
  }
});

// DELETE
app.delete("/api/students/:id", async (req, res) => {
  const count = await Student.destroy({ where: { id: req.params.id } });
  if (!count) return res.status(404).json({ message: "Student not found" });
  res.json({ message: "Deleted" });
});

// create table if not exists, then start server
sequelize.sync().then(() => {
  app.listen(5000, () => console.log("API running on http://localhost:5000"));
});
