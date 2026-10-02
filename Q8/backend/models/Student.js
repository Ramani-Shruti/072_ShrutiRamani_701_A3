const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Student = sequelize.define("Student", {
  rollNo: { type: DataTypes.INTEGER, allowNull: false, unique: { msg: "Roll No already exists" } },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: { msg: "Email is not valid" } } },
  course: { type: DataTypes.STRING },
  marks: {
    type: DataTypes.INTEGER,
    validate: {
      min: { args: [0], msg: "Marks must be 0 to 100" },
      max: { args: [100], msg: "Marks must be 0 to 100" },
    },
  },
});

module.exports = Student;
