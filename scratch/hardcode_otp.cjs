const fs = require('fs');
const path = 'C:\\ayushbasket\\ayushbasket-bakend\\src\\modules\\auth\\auth.service.js';

let content = fs.readFileSync(path, 'utf8');

const targetCode = `const otp = Math.floor(100000 + Math.random() * 900000).toString();`;
const replacementCode = `const otp = '123456'; // HARDCODED FOR DEV`;

if (content.includes(targetCode)) {
  content = content.replace(targetCode, replacementCode);
  fs.writeFileSync(path, content);
  console.log('Successfully hardcoded Registration OTP to 123456');
} else {
  console.log('Target block not found or already replaced.');
}
