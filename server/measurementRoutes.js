// server/measurementRoutes.js

const express = require('express');
const Measurement = require('./Measurement');
const requireAuth = require('./authMiddleware');

const router = express.Router();

// نطبق الـ auth على كل الراوتات في هذا الملف
router.use(requireAuth);

// POST /api/measurements
// يحفظ قياس واحد
router.post('/', async (req, res) => {
  try {
    const { heartRate, spo2 } = req.body;

    if (heartRate == null || spo2 == null) {
      return res
        .status(400)
        .json({ message: 'heartRate and spo2 are required' });
    }

    const measurement = await Measurement.create({
      userId: req.user.id,
      heartRate,
      spo2,
    });

    res.status(201).json(measurement);
  } catch (err) {
    console.error('Create measurement error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/measurements/daily
// يرجع قياسات آخر 24 ساعة لهذا المستخدم
router.get('/daily', async (req, res) => {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const measurements = await Measurement.find({
      userId: req.user.id,
      createdAt: { $gte: since },
    }).sort({ createdAt: 1 });

    res.json(measurements);
  } catch (err) {
    console.error('Daily measurements error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/measurements/weekly
// يرجع قياسات آخر 7 أيام لهذا المستخدم
router.get('/weekly', async (req, res) => {
  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const measurements = await Measurement.find({
      userId: req.user.id,
      createdAt: { $gte: since },
    }).sort({ createdAt: 1 });

    res.json(measurements);
  } catch (err) {
    console.error('Weekly measurements error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
