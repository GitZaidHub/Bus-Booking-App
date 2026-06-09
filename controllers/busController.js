const Bus = require("../models/Bus");

exports.createBus = async (req, res) => {
  try {
    const bus = await Bus.create(req.body);

    res.status(201).json(bus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};