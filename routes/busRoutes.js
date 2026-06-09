const express = require("express");
const router = express.Router();

const busController = require("../controllers/busController");
const bookingController = require("../controllers/bookingController");

router.post("/", busController.createBus);

router.get(
  "/:id/bookings",
  bookingController.getBusBookings
);

module.exports = router;