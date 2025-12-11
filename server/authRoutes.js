// server/authRoutes.js

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const user = new User({ email, name });
    await user.setPassword(password);
    await user.save();

    return res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Register error:', err);
    // نخلي الرسالة تطلع لك عشان نعرف لو فيه خطأ معيّن
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

module.exports = router;
