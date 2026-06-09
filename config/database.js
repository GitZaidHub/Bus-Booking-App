const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "bus_booking_db",
  "root",
  "password",
  {
    host: "localhost",
    dialect: "mysql"
  }
);

module.exports = sequelize;