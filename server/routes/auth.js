/** @format */

const express = require("express");
const router = express.Router();

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

const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword", resetPassword);

router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

router.post("/verify-email-change", protect, verifyEmailChange);
router.post("/weight", protect, updateWeight);

router.post("/delete-initiate", protect, initiateDeleteAccount);
router.post("/delete-confirm", protect, confirmDeleteAccount);

module.exports = router;
