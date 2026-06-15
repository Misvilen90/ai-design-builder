const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Generate a signed JWT for the given user id.
 */
function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

/**
 * POST /api/auth/register
 * Create a new member account.
 */
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Create user (role defaults to "member")
    const user = await User.create({ name, email, password });

    const token = signToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("[Auth] Register error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error during registration.",
    });
  }
}

/**
 * POST /api/auth/login
 * Authenticate with email & password, receive JWT.
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    // Find user and explicitly select password field
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = signToken(user._id);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("[Auth] Login error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error during login.",
    });
  }
}

/**
 * GET /api/auth/me
 * Return the currently authenticated user's profile.
 * Requires requireAuth middleware.
 */
async function getMe(req, res) {
  try {
    return res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        createdAt: req.user.createdAt,
      },
    });
  } catch (err) {
    console.error("[Auth] getMe error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
}

/**
 * GET /api/auth/users   (admin only)
 * List all registered users.
 */
async function getUsers(req, res) {
  try {
    const users = await User.find().select("name email role createdAt");
    return res.json({ success: true, users });
  } catch (err) {
    console.error("[Auth] getUsers error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
}

module.exports = { register, login, getMe, getUsers };
