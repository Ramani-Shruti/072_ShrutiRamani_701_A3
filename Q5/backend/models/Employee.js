const mongoose = require("mongoose");
// same schema as Q4 because both use the same erpdb database

const employeeSchema = new mongoose.Schema(
  {
    empId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }, // bcrypt hash
    department: String,
    designation: String,
    basicSalary: { type: Number, required: true },
  },
  { timestamps: true }
);

// salary calculation (virtual fields, not stored in db)
// HRA = 20% of basic, DA = 10% of basic, PF = 12% of basic
employeeSchema.virtual("hra").get(function () {
  return Math.round(this.basicSalary * 0.2);
});
employeeSchema.virtual("da").get(function () {
  return Math.round(this.basicSalary * 0.1);
});
employeeSchema.virtual("pf").get(function () {
  return Math.round(this.basicSalary * 0.12);
});
employeeSchema.virtual("grossSalary").get(function () {
  return this.basicSalary + this.hra + this.da;
});
employeeSchema.virtual("netSalary").get(function () {
  return this.grossSalary - this.pf;
});

module.exports = mongoose.model("Employee", employeeSchema);
