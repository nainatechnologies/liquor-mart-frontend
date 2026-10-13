const fs = require('fs');
const path = require('path');

// 1. Update prescription.js model
const modelPath = 'C:\\ayushbasket\\ayushbasket-bakend\\src\\models\\prescription.js';
const modelContent = `const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Prescription = sequelize.define('Prescription', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  imageUrl: {
    type: DataTypes.STRING,
    field: 'image_url'
  },
  notes: {
    type: DataTypes.TEXT
  },
  medicines: {
    type: DataTypes.TEXT
  },
  patient_name: {
    type: DataTypes.STRING(255),
    field: 'patient_name'
  },
  doctor_name: {
    type: DataTypes.STRING(255),
    field: 'doctor_name'
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'pending'
  },
  orderId: {
    type: DataTypes.INTEGER,
    field: 'order_id'
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    field: 'approved_by'
  },
  approvedAt: {
    type: DataTypes.DATE,
    field: 'approved_at'
  }
}, {
  tableName: 'prescriptions'
});

module.exports = Prescription;
`;
fs.writeFileSync(modelPath, modelContent);
console.log('Updated prescription.js model.');

// 2. Update prescriptionController.js upload
const controllerPath = 'C:\\ayushbasket\\ayushbasket-bakend\\src\\controllers\\prescriptionController.js';
let controllerContent = fs.readFileSync(controllerPath, 'utf-8');

controllerContent = controllerContent.replace(
  `    const prescription = await Prescription.create({
      userId: req.user.id,
      imageUrl: imageUrl,
      notes: notes,
      status: 'pending'
    });`,
  `    const prescription = await Prescription.create({
      userId: req.user.id,
      imageUrl: imageUrl,
      notes: notes,
      medicines: req.body.medicines || '',
      patient_name: req.body.patient_name || '',
      doctor_name: req.body.doctor_name || '',
      status: 'pending'
    });`
);
fs.writeFileSync(controllerPath, controllerContent);
console.log('Updated prescriptionController.js.');
