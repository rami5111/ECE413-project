// server/app.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const authRoutes = require('./authRoutes');
// لو بعدين فعلت الراوتات الثانية:
// const deviceRoutes = require('./deviceRoutes');
// const measurementRoutes = require('./measurementRoutes');

dotenv.config(); // يقرأ الإعدادات من ملف .env

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());

// اتصال بقاعدة البيانات
connectDB();

// test route
app.get('/', (req, res) => {
  res.json({ message: 'HeartTrack 413 API is working ✅' });
});

// routes
app.use('/api/auth', authRoutes);
// app.use('/api/devices', deviceRoutes);
// app.use('/api/measurements', measurementRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
