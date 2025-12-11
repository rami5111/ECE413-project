// server/Measurement.js

const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  heartRate: {
    type: Number,
    required: true,
  },
  spo2: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Measurement = mongoose.model('Measurement', measurementSchema);

module.exports = Measurement;
