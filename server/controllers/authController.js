const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const prisma = new PrismaClient();

// --- HELPER FUNCTIONS ---

/**
 * Generates a JWT token for authenticated sessions.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

/**
 * Calculates age based on Date of Birth.
 */
const calculateAge = (dob) => {
  if (!dob) return null;
  const diff = Date.now() - new Date(dob).getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// --- CONTROLLERS ---

/**
 * 1. REGISTER USER
 * Creates a new user (unverified) and sends an OTP via email.
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password and generate OTP
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60000); // 10 minutes

    // Create User
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpires,
        isVerified: false,
      },
    });

    // Send Verification Email
    await sendEmail({ 
      to: email, 
      subject: 'Verify Your Gym Tracker Account', 
      text: `
        <div style="font-family: sans-serif; max-width: 500px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #2563eb;">Welcome to Gym Tracker!</h2>
          <p>Hi ${name},</p>
          <p>Please use the following code to verify your email address:</p>
          <div style="background: #f3f4f6; padding: 16px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1f2937;">${otp}</span>
          </div>
          <p style="font-size: 12px; color: #6b7280;">This code will expire in 10 minutes.</p>
        </div>
      ` 
    });

    res.status(201).json({ message: 'Registration successful. Please check your email for OTP.' });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * 2. VERIFY OTP (Registration)
 * Verifies the email address and activates the account.
 */
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Find user with matching OTP that hasn't expired
    const user = await prisma.user.findFirst({
      where: { email, otp, otpExpires: { gt: new Date() } }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Activate user
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, otp: null, otpExpires: null }
    });

    res.json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

/**
 * 3. RESEND OTP
 * Generates a new OTP for unverified users.
 */
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "Email already verified" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60000);

    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpires }
    });

    await sendEmail({
      to: email,
      subject: 'New Verification Code',
      text: `
        <div style="font-family: sans-serif; padding: 20px;">
           <h2>New Code Requested</h2>
           <p>Here is your new verification code:</p>
           <h1>${otp}</h1>
        </div>
      `
    });

    res.json({ message: "New OTP sent to your email!" });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ message: "Error resending OTP" });
  }
};

/**
 * 4. LOGIN USER
 * Authenticates user and returns JWT token.
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email address first.' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * 5. GET PROFILE
 * Returns user details, metrics, and weight history.
 */
exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { 
        id: true, name: true, email: true, createdAt: true, isVerified: true,
        dateOfBirth: true,
        height: true,
        currentWeight: true,
        gender: true,
        weightHistory: {
          orderBy: { date: 'asc' },
          take: 20
        }
      }
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      ...user,
      age: calculateAge(user.dateOfBirth)
    });
  } catch (error) {
    console.error("GetMe Error:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

/**
 * 6. UPDATE PROFILE
 * Updates basic user info (Name, DOB, Height, Gender).
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, dateOfBirth, height, gender } = req.body; 
    
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        height: height ? parseFloat(height) : undefined,
        gender
      }
    });

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Update failed" });
  }
};

/**
 * 7. VERIFY EMAIL CHANGE OTP
 * (Previously Missing Function)
 */
exports.verifyEmailChange = async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user.newEmail || !user.newEmailOtp) {
      return res.status(400).json({ message: "No pending email change found." });
    }

    if (user.newEmailOtp !== otp || new Date() > user.newEmailOtpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Commit Change
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email: user.newEmail,
        newEmail: null,
        newEmailOtp: null,
        newEmailOtpExpires: null
      },
      select: { id: true, name: true, email: true }
    });

    res.json({ message: "Email updated successfully!", user: updatedUser });

  } catch (error) {
    res.status(500).json({ message: "Error verifying email change" });
  }
};

/**
 * 8. LOG/UPDATE WEIGHT
 * Logs daily weight and updates current weight. Blocks future dates.
 */
exports.updateWeight = async (req, res) => {
  try {
    const { weight, date } = req.body;
    const userId = req.user.id;

    if (!weight) return res.status(400).json({ message: "Weight is required" });

    // Normalize Dates
    const targetDate = date ? new Date(date) : new Date();
    const today = new Date();
    targetDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (targetDate > today) {
      return res.status(400).json({ message: "You cannot log weight for a future date." });
    }

    const startOfDay = new Date(targetDate);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Upsert Logic (Update if exists, else Create)
    const existingEntry = await prisma.weightHistory.findFirst({
      where: {
        userId,
        date: { gte: startOfDay, lte: endOfDay }
      }
    });

    if (existingEntry) {
      await prisma.weightHistory.update({
        where: { id: existingEntry.id },
        data: { weight: parseFloat(weight) }
      });
    } else {
      await prisma.weightHistory.create({
        data: {
          userId,
          weight: parseFloat(weight),
          date: targetDate
        }
      });
    }

    // Update User's current weight based on the latest entry
    const latestEntry = await prisma.weightHistory.findFirst({
      where: { userId },
      orderBy: { date: 'desc' }
    });

    if (latestEntry) {
      await prisma.user.update({
        where: { id: userId },
        data: { currentWeight: latestEntry.weight }
      });
    }

    const history = await prisma.weightHistory.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
      take: 20
    });

    res.json({ 
      message: "Weight log updated", 
      currentWeight: latestEntry?.weight,
      weightHistory: history 
    });

  } catch (error) {
    console.error("Update Weight Error:", error);
    res.status(500).json({ message: "Error updating weight" });
  }
};

/**
 * 9. FORGOT PASSWORD
 * Sends an OTP to reset password.
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Return 404 so frontend can show specific error
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpires }
    });

    await sendEmail({
      to: user.email, 
      subject: '🔐 Password Reset OTP',
      text: `
        <div style="font-family: sans-serif; max-width: 500px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #1f2937;">Reset Your Password</h2>
          <p>Hi ${user.name || 'Athlete'},</p>
          <p>You requested a password reset. Enter the code below to set a new password:</p>
          <div style="background: #f3f4f6; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2563eb;">${otp}</span>
          </div>
          <p style="font-size: 12px; color: #6b7280;">This code expires in 10 minutes.</p>
        </div>
      `
    });

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
};

/**
 * 10. RESET PASSWORD
 * Verifies OTP and updates the password.
 */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        password: hashedPassword, 
        otp: null, 
        otpExpires: null 
      },
    });

    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
};

/**
 * 11. INITIATE DELETE ACCOUNT
 * Sends an OTP to confirm account deletion.
 */
exports.initiateDeleteAccount = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: req.user.id },
      select: { email: true, id: true, name: true } 
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpires }
    });

    await sendEmail({
      to: user.email,
      subject: '⚠️ Confirm Account Deletion',
      text: `             
        <div style="font-family: sans-serif; max-width: 500px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #ef4444;">Delete Your Account?</h2>
          <p>Hi ${user.name || 'Athlete'},</p>
          <p>You requested to delete your Gym Tracker account. Use the code below to confirm this action. <strong>This will permanently erase all your data.</strong></p>
          <div style="background: #f4f4f5; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111827;">${otp}</span>
          </div>
          <p style="font-size: 12px; color: #6b7280;">This code expires in 10 minutes.</p>
        </div>
      `
    });

    res.json({ message: "OTP sent to your email." });
  } catch (error) {
    console.error("Delete Initiate Error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

/**
 * 12. CONFIRM DELETE ACCOUNT
 * Verifies OTP and deletes all user data (Logs, Workouts, History, Templates, Exercises, User).
 */
exports.confirmDeleteAccount = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user.otp || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Transaction to ensure complete cleanup or rollback
    await prisma.$transaction([
      prisma.workoutLog.deleteMany({ where: { workout: { userId: user.id } } }), 
      prisma.workout.deleteMany({ where: { userId: user.id } }), 
      prisma.weightHistory.deleteMany({ where: { userId: user.id } }), 
      prisma.template.deleteMany({ where: { userId: user.id } }), 
      prisma.exercise.deleteMany({ where: { userId: user.id } }), // Delete Custom Exercises
      prisma.user.delete({ where: { id: user.id } }) 
    ]);

    res.json({ message: "Account and all data deleted successfully" });
  } catch (error) {
    console.error("Delete Confirm Error:", error);
    res.status(500).json({ message: "Delete failed" });
  }
};