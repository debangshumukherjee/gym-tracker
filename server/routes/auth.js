/** @format */

const express = require("express");
const router = express.Router();

// Import Controllers
const {
  register,
  loginUser,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  verifyEmailChange,
  updateWeight,
  initiateDeleteAccount,
  confirmDeleteAccount,
} = require("../controllers/authController");

// Import Middleware
const { protect } = require("../middleware/authMiddleware");

// -----------------------------------------------------------------------------
// PUBLIC ROUTES (No Authentication Required)
// -----------------------------------------------------------------------------

// Registration & Login
router.post("/register", register);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

// Password Management
router.post("/forgotpassword", forgotPassword); // Request OTP
router.put("/resetpassword", resetPassword); // Reset using OTP

// -----------------------------------------------------------------------------
// PROTECTED ROUTES (Requires Valid JWT Token)
// -----------------------------------------------------------------------------

// User Profile
router.get("/me", protect, getMe); // Fetch current user data
router.put("/profile", protect, updateProfile); // Update profile details

// Email & Weight Management
router.post("/verify-email-change", protect, verifyEmailChange);
router.post("/weight", protect, updateWeight); // Log daily weight

// Account Deletion Flow
router.post("/delete-initiate", protect, initiateDeleteAccount); // Step 1: Send OTP
router.post("/delete-confirm", protect, confirmDeleteAccount); // Step 2: Confirm & Delete

module.exports = router;
