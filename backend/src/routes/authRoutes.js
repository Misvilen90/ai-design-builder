const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected routes
router.get("/me", requireAuth, authController.getMe);

// Admin-only routes
router.get("/users", requireAuth, requireAdmin, authController.getUsers);

module.exports = router;
