require('C:\\ayushbasket\\ayushbasket-bakend\\node_modules\\dotenv').config({ path: 'C:\\ayushbasket\\ayushbasket-bakend\\.env' });
const { Prescription } = require('C:\\ayushbasket\\ayushbasket-bakend\\src\\models');

async function testQuery() {
  try {
    const prescriptions = await Prescription.findAll({
      where: { userId: 1 },
      order: [['created_at', 'DESC']]
    });
    console.log('Query succeeded, found', prescriptions.length);
  } catch (error) {
    console.log('Query failed with error:', error.message);
  }
  process.exit(0);
}

testQuery();
