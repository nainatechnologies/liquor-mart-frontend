const fs = require('fs');
const path = require('path');

const authRoutesPath = 'C:\\ayushbasket\\ayushbasket-bakend\\src\\modules\\auth\\auth.routes.js';
const authControllerPath = 'C:\\ayushbasket\\ayushbasket-bakend\\src\\modules\\auth\\auth.controller.js';
const authServicePath = 'C:\\ayushbasket\\ayushbasket-bakend\\src\\modules\\auth\\auth.service.js';

// 1. Update auth.service.js
let authService = fs.readFileSync(authServicePath, 'utf8');
if (!authService.includes('sendRegistrationOtp')) {
  const otpServiceCode = `
const crypto = require('crypto');
const registrationOtps = new Map(); // In-memory store for registration OTPs

const sendRegistrationOtp = async (phone) => {
  const existingUser = await User.findOne({ where: { phone: phone.trim() } });
  if (existingUser) {
    const error = new Error('An account with this phone number already exists.');
    error.statusCode = 409;
    throw error;
  }
  
  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store in memory with 10 mins expiry
  registrationOtps.set(phone.trim(), {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000
  });

  // Normally you'd send SMS here, but we just log it for dev
  console.log(\`[DEV] Registration OTP for \${phone}: \${otp}\`);
  return { message: 'OTP sent successfully to ' + phone };
};

const verifyRegistrationOtp = async (phone, otp) => {
  const record = registrationOtps.get(phone.trim());
  if (!record) {
    return false;
  }
  if (Date.now() > record.expiresAt) {
    registrationOtps.delete(phone.trim());
    return false;
  }
  if (record.otp === otp.trim()) {
    registrationOtps.delete(phone.trim()); // OTP consumed
    return true;
  }
  return false;
};
`;

  authService = authService.replace('module.exports = {', otpServiceCode + '\nmodule.exports = {\n  sendRegistrationOtp,\n  verifyRegistrationOtp,');
  fs.writeFileSync(authServicePath, authService);
}

// 2. Update auth.controller.js
let authController = fs.readFileSync(authControllerPath, 'utf8');
if (!authController.includes('sendRegistrationOtp')) {
  const otpControllerCode = `
// @desc    Send OTP for registration
// @route   POST /api/auth/send-registration-otp
const sendRegistrationOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }
    const response = await authService.sendRegistrationOtp(phone);
    res.status(200).json({ success: true, message: response.message });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP for registration
// @route   POST /api/auth/verify-registration-otp
const verifyRegistrationOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }
    const isValid = await authService.verifyRegistrationOtp(phone, otp);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    next(error);
  }
};
`;
  authController = authController.replace('module.exports = {', otpControllerCode + '\nmodule.exports = {\n  sendRegistrationOtp,\n  verifyRegistrationOtp,');
  fs.writeFileSync(authControllerPath, authController);
}

// 3. Update auth.routes.js
let authRoutes = fs.readFileSync(authRoutesPath, 'utf8');
if (!authRoutes.includes('send-registration-otp')) {
  authRoutes = authRoutes.replace(
    `const { register, login, forgotPassword, verifyOtp, resetPassword } = require('./auth.controller');`,
    `const { register, login, forgotPassword, verifyOtp, resetPassword, sendRegistrationOtp, verifyRegistrationOtp } = require('./auth.controller');`
  );
  authRoutes = authRoutes.replace(
    `router.post('/login', validate(loginSchema), login);`,
    `router.post('/login', validate(loginSchema), login);\n\nrouter.post('/send-registration-otp', sendRegistrationOtp);\nrouter.post('/verify-registration-otp', verifyRegistrationOtp);`
  );
  fs.writeFileSync(authRoutesPath, authRoutes);
}

console.log('Successfully patched Auth backend for Registration OTP');
