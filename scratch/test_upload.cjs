require('C:\\ayushbasket\\ayushbasket-bakend\\node_modules\\dotenv').config({ path: 'C:\\ayushbasket\\ayushbasket-bakend\\.env' });
const { User } = require('C:\\ayushbasket\\ayushbasket-bakend\\src\\models');
const jwt = require('C:\\ayushbasket\\ayushbasket-bakend\\node_modules\\jsonwebtoken');

async function testUpload() {
  try {
    const user = await User.findByPk(5);
    if (!user) return console.log('no user 5');
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'ayushbasket_secret', { expiresIn: '30d' });

    const res = await fetch('http://localhost:5000/api/prescriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();
    console.log('Upload response:', data);
  } catch (error) {
    console.log('Error:', error);
  }
}

testUpload();
