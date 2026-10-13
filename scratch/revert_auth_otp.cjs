const fs = require('fs');

const authRoutesPath = 'C:\\ayushbasket\\ayushbasket-bakend\\src\\modules\\auth\\auth.routes.js';
const authControllerPath = 'C:\\ayushbasket\\ayushbasket-bakend\\src\\modules\\auth\\auth.controller.js';
const authServicePath = 'C:\\ayushbasket\\ayushbasket-bakend\\src\\modules\\auth\\auth.service.js';

// 1. Revert auth.routes.js
let authRoutes = fs.readFileSync(authRoutesPath, 'utf8');
authRoutes = authRoutes.replace(
  `const { register, login, forgotPassword, verifyOtp, resetPassword, sendRegistrationOtp, verifyRegistrationOtp } = require('./auth.controller');`,
  `const { register, login, forgotPassword, verifyOtp, resetPassword } = require('./auth.controller');`
);
authRoutes = authRoutes.replace(
  `router.post('/login', validate(loginSchema), login);\n\nrouter.post('/send-registration-otp', sendRegistrationOtp);\nrouter.post('/verify-registration-otp', verifyRegistrationOtp);`,
  `router.post('/login', validate(loginSchema), login);`
);
fs.writeFileSync(authRoutesPath, authRoutes);

// 2. Revert auth.controller.js
let authController = fs.readFileSync(authControllerPath, 'utf8');
const controllerToRemove = `// @desc    Send OTP for registration
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

module.exports = {
  sendRegistrationOtp,
  verifyRegistrationOtp, register, login, forgotPassword, verifyOtp, resetPassword };`;

if (authController.includes(controllerToRemove)) {
  authController = authController.replace(controllerToRemove, `module.exports = { register, login, forgotPassword, verifyOtp, resetPassword };`);
  fs.writeFileSync(authControllerPath, authController);
}

// 3. Revert auth.service.js
let authService = fs.readFileSync(authServicePath, 'utf8');
const serviceToRemove = `const crypto = require('crypto');
const registrationOtps = new Map(); // In-memory store for registration OTPs

const sendRegistrationOtp = async (phone) => {
  const existingUser = await User.findOne({ where: { phone: phone.trim() } });
  if (existingUser) {
    const error = new Error('An account with this phone number already exists.');
    error.statusCode = 409;
    throw error;
  }
  
  // Generate OTP
  const otp = '123456'; // HARDCODED FOR DEV
  
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

module.exports = {
  sendRegistrationOtp,
  verifyRegistrationOtp,
  registerUser,
  loginUser,
  generateForgotPasswordOTP,
  verifyOTPAndGenerateResetToken,
  resetPasswordWithToken
};`;

if (authService.includes(serviceToRemove)) {
  authService = authService.replace(serviceToRemove, `module.exports = {
  registerUser,
  loginUser,
  generateForgotPasswordOTP,
  verifyOTPAndGenerateResetToken,
  resetPasswordWithToken
};`);
  fs.writeFileSync(authServicePath, authService);
}

console.log('Successfully reverted backend changes.');
