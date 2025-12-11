const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    // مؤقتاً خلينا ما نطلع من البرنامج عشان السيرفر يشتغل حتى لو ما ركّبت Mongo
    // process.exit(1);
  }
}

module.exports = connectDB;
