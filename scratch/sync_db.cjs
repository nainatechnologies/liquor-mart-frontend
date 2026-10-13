require('dotenv').config({ path: 'C:\\\\ayushbasket\\\\ayushbasket-bakend\\\\.env' });
const { sequelize, syncDB } = require('C:\\\\ayushbasket\\\\ayushbasket-bakend\\\\src\\\\models');
const alter = async () => {
  await sequelize.sync({ alter: true });
  console.log('DB sync successful with alter: true');
  process.exit(0);
};
alter();
