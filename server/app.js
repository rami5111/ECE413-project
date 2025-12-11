// server/app.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const authRoutes = require('./authRoutes');
const measurementRoutes = require('./measurementRoutes');

dotenv.config(); // يقرأ الإعدادات من ملف .env

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middlewares =====
app.use(cors());
app.use(express.json());

// ===== Database =====
connectDB();

// ===== Test route =====
app.get('/', (req, res) => {
  res.json({ message: 'HeartTrack 413 API is working ✅' });
});

// ===== API routes =====
app.use('/api/auth', authRoutes);
app.use('/api/measurements', measurementRoutes);

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
