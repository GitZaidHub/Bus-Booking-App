const Booking = require("../models/Booking");
const User = require("../models/User");
const Bus = require("../models/Bus");

exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create({
      seatNumber: req.body.seatNumber,
      UserId: req.body.userId,
      BusId: req.body.busId
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: {
        UserId: req.params.id
      },
      include: [
        {
          model: Bus,
          attributes: ["busNumber"]
        }
      ]
    });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBusBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: {
        BusId: req.params.id
      },
      include: [
        {
          model: User,
          attributes: ["name", "email"]
        }
      ]
    });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};