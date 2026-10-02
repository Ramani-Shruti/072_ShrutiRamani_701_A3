const { Sequelize } = require("sequelize");

// SQLite = database is just a file, no server needed
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./students.sqlite",
  logging: false,
});

// To use MySQL instead (npm install mysql2):
// const sequelize = new Sequelize("studentdb", "root", "password", { host: "localhost", dialect: "mysql" });

module.exports = sequelize;
