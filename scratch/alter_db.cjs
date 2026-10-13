require('C:\\ayushbasket\\ayushbasket-bakend\\node_modules\\dotenv').config({ path: 'C:\\ayushbasket\\ayushbasket-bakend\\.env' });
const sequelize = require('C:\\ayushbasket\\ayushbasket-bakend\\src\\config\\db');

async function alterTable() {
  try {
    await sequelize.query('ALTER TABLE prescriptions ADD COLUMN medicines TEXT;');
    console.log('Added medicines column.');
  } catch (e) {
    console.log('Error adding medicines:', e.message);
  }
  
  try {
    await sequelize.query('ALTER TABLE prescriptions ADD COLUMN patient_name VARCHAR(255);');
    console.log('Added patient_name column.');
  } catch (e) {
    console.log('Error adding patient_name:', e.message);
  }

  try {
    await sequelize.query('ALTER TABLE prescriptions ADD COLUMN doctor_name VARCHAR(255);');
    console.log('Added doctor_name column.');
  } catch (e) {
    console.log('Error adding doctor_name:', e.message);
  }

  process.exit(0);
}

alterTable();
