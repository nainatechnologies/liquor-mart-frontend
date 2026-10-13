const fs = require('fs');

const authServicePath = 'C:\\ayushbasket\\ayushbasket-bakend\\src\\modules\\auth\\auth.service.js';
let content = fs.readFileSync(authServicePath, 'utf8');

const targetRegister = `  if (existing) {
    const error = new Error('An account with this email already exists.');
    error.statusCode = 409;
    throw error;
  }`;

const replacementRegister = `  if (existing) {
    const error = new Error('An account with this email already exists.');
    error.statusCode = 409;
    throw error;
  }

  if (data.phone) {
    const existingPhone = await User.findOne({ where: { phone: data.phone.trim() } });
    if (existingPhone) {
      const error = new Error('An account with this phone number already exists.');
      error.statusCode = 409;
      throw error;
    }
  }`;

if (content.includes(targetRegister) && !content.includes('existingPhone')) {
  content = content.replace(targetRegister, replacementRegister);
  fs.writeFileSync(authServicePath, content);
  console.log('Successfully patched auth.service.js for registration phone check.');
} else {
  console.log('auth.service.js was already patched or target not found.');
}
