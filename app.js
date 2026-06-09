const express = require("express");
const sequelize = require("./config/database");

const User = require("./models/User");
const Bus = require("./models/Bus");
const Booking = require("./models/Booking");

const app = express();

app.use(express.json());

/* User ↔ Booking */
User.hasMany(Booking);
Booking.belongsTo(User);

/* Bus ↔ Booking */
Bus.hasMany(Booking);
Booking.belongsTo(Bus);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database Synced");
  })
  .catch(err => console.log(err));