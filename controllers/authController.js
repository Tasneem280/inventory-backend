const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// =======================
// ✅ REGISTER
// =======================
const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existing = await User.findOne({ username });

    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashed,
      role: req.body.role || "Staff"
    });

    await user.save();

    return res.status(201).json({
      message: "User registered successfully",
    });

  } catch (err) {
    return res.status(500).json({ error: "Registration failed" });
  }
};

// =======================
// ✅ LOGIN
// =======================
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT secret missing" });
    }

    const token = jwt.sign(
      { 
        id: user._id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      },
      message: "Login successful",
    });

  } catch (err) {
    return res.status(500).json({ error: "Login failed" });
  }
};

module.exports = {
  register,
  login
};
