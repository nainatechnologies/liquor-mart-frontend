const fs = require('fs');
const path = require('path');

const modelsDir = 'C:\\ayushbasket\\ayushbasket-bakend\\src\\models';
const revenueDir = 'C:\\ayushbasket\\ayushbasket-bakend\\src\\modules\\revenue';
const orderModelPath = 'C:\\ayushbasket\\ayushbasket-bakend\\src\\modules\\order\\order.model.js';
const modelsIndexPath = path.join(modelsDir, 'index.js');
const dailyRevenueModelPath = path.join(revenueDir, 'dailyRevenue.model.js');
const revenueServicePath = path.join(revenueDir, 'revenue.service.js');
const revenueControllerPath = path.join(revenueDir, 'revenue.controller.js');
const revenueRoutesPath = path.join(revenueDir, 'revenue.routes.js');
const orderServicePath = 'C:\\ayushbasket\\ayushbasket-bakend\\src\\modules\\order\\order.service.js';
const appJsPath = 'C:\\ayushbasket\\ayushbasket-bakend\\src\\server.js'; // Let's try server.js if it exists

// 1. Create dailyRevenue.model.js
fs.writeFileSync(dailyRevenueModelPath, `const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const DailyRevenue = sequelize.define('DailyRevenue', {
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    unique: true
  },
  ordersCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'orders_count'
  },
  purchaseMoney: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    field: 'purchase_money'
  },
  sellingMoney: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    field: 'selling_money'
  },
  profitMoney: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    field: 'profit_money'
  }
}, {
  tableName: 'daily_revenue',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = DailyRevenue;
`);
console.log('Created dailyRevenue.model.js');

// 2. Add revenueLogged to order.model.js
let orderModel = fs.readFileSync(orderModelPath, 'utf8');
if (!orderModel.includes('revenueLogged')) {
  orderModel = orderModel.replace(
    /discount:\s*{\s*type:\s*DataTypes\.DECIMAL\(10,\s*2\),\s*defaultValue:\s*0\.00\s*},/g,
    `discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  revenueLogged: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'revenue_logged'
  },`
  );
  fs.writeFileSync(orderModelPath, orderModel);
  console.log('Updated order.model.js with revenueLogged');
}

// 3. Update index.js models
let indexModels = fs.readFileSync(modelsIndexPath, 'utf8');
if (!indexModels.includes('DailyRevenue = require')) {
  indexModels = indexModels.replace(
    /const OrderStatusHistory = require\('\.\.\/modules\/order\/orderStatusHistory\.model'\);/,
    `const OrderStatusHistory = require('../modules/order/orderStatusHistory.model');\nconst DailyRevenue = require('../modules/revenue/dailyRevenue.model');`
  );
  indexModels = indexModels.replace(
    /OrderStatusHistory\n};/,
    `OrderStatusHistory,\n  DailyRevenue\n};`
  );
  fs.writeFileSync(modelsIndexPath, indexModels);
  console.log('Updated models/index.js');
}

// 4. Overwrite revenue.service.js
fs.writeFileSync(revenueServicePath, `const sequelize = require('../../config/db');
const DailyRevenue = require('./dailyRevenue.model');
const Order = require('../order/order.model');
const OrderItem = require('../order/orderItem.model');
const { Op } = require('sequelize');

const logOrderRevenue = async (orderId) => {
  const order = await Order.findByPk(orderId, {
    include: [{ model: OrderItem, as: 'items' }]
  });

  if (!order) return;
  if (order.revenueLogged) return; // Prevent double logging

  let purchaseMoney = 0;
  let sellingMoney = 0;

  for (const item of order.items) {
    sellingMoney += parseFloat(item.price) * item.quantity;
    purchaseMoney += parseFloat(item.purchasePrice || 0) * item.quantity;
  }
  
  // Wait, if order has discounts or delivery fee, they affect selling money and profit
  // sellingMoney should probably just be the sum of items, or order.total
  // Let's use order.total for actual selling money (as they pay it), minus delivery fee if we don't count it.
  // Actually, profit = sellingMoney - purchaseMoney. If discount is applied, sellingMoney is lower.
  // So sellingMoney = parseFloat(order.total) - parseFloat(order.deliveryFee || 0);
  // This is safer.
  sellingMoney = parseFloat(order.total) - parseFloat(order.deliveryFee || 0);
  
  const profitMoney = sellingMoney - purchaseMoney;

  const orderDate = new Date(order.created_at || new Date()).toISOString().split('T')[0];

  // Upsert DailyRevenue
  const [daily, created] = await DailyRevenue.findOrCreate({
    where: { date: orderDate },
    defaults: {
      ordersCount: 1,
      purchaseMoney,
      sellingMoney,
      profitMoney
    }
  });

  if (!created) {
    daily.ordersCount += 1;
    daily.purchaseMoney = parseFloat(daily.purchaseMoney) + purchaseMoney;
    daily.sellingMoney = parseFloat(daily.sellingMoney) + sellingMoney;
    daily.profitMoney = parseFloat(daily.profitMoney) + profitMoney;
    await daily.save();
  }

  order.revenueLogged = true;
  await order.save();
};

const getRevenueData = async (filters) => {
  const { filter, start, end } = filters;

  let whereClauses = {};
  
  if (filter === 'This Month') {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
    whereClauses.date = { [Op.between]: [firstDay, lastDay] };
  } else if (start && end) {
    whereClauses.date = { [Op.between]: [start, end] };
  }

  const dailyRecords = await DailyRevenue.findAll({
    where: whereClauses,
    order: [['date', 'DESC']]
  });

  let stats = {
    purchaseMoney: 0,
    sellingMoney: 0,
    profitMoney: 0
  };

  const dailyData = dailyRecords.map(r => {
    stats.purchaseMoney += parseFloat(r.purchaseMoney);
    stats.sellingMoney += parseFloat(r.sellingMoney);
    stats.profitMoney += parseFloat(r.profitMoney);
    
    // format date e.g. Oct 25, 2023
    const dateObj = new Date(r.date);
    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    return {
      date: dateStr,
      ordersCount: r.ordersCount,
      purchaseMoney: parseFloat(r.purchaseMoney),
      sellingMoney: parseFloat(r.sellingMoney),
      profitMoney: parseFloat(r.profitMoney)
    };
  });

  return {
    stats,
    dailyData
  };
};

module.exports = {
  logOrderRevenue,
  getRevenueData
};
`);
console.log('Updated revenue.service.js');

// 5. Overwrite revenue.controller.js
fs.writeFileSync(revenueControllerPath, `const revenueService = require('./revenue.service');

// @desc    Get revenue analytics
// @route   GET /api/revenue/analytics
// @access  Private/Admin
const getRevenue = async (req, res) => {
  try {
    const data = await revenueService.getRevenueData(req.query);
    
    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    res.status(500).json({ success: false, message: 'Server error fetching revenue.' });
  }
};

module.exports = { getRevenue };
`);
console.log('Updated revenue.controller.js');

// 6. Overwrite revenue.routes.js
fs.writeFileSync(revenueRoutesPath, `const express = require('express');
const router = express.Router();
const { getRevenue } = require('./revenue.controller');
const { protect, admin } = require('../../middleware/authMiddleware');

router.get('/analytics', protect, admin, getRevenue);

module.exports = router;
`);
console.log('Updated revenue.routes.js');

// 7. Update order.service.js to trigger revenue logging
let orderService = fs.readFileSync(orderServicePath, 'utf8');
if (!orderService.includes('revenueService.logOrderRevenue')) {
  // We need to inject require revenue.service at the top
  orderService = "const revenueService = require('../revenue/revenue.service');\n" + orderService;
  
  // Find updateOrderStatus
  const updateTarget = `order.status = status;
    
    if (status.toLowerCase() === 'completed') {
      order.paymentStatus = 'paid';
    }`;
    
  const updateReplacement = `order.status = status;
    
    if (status.toLowerCase() === 'completed' || status.toLowerCase() === 'paid') {
      order.paymentStatus = 'paid';
    }`;
    
  orderService = orderService.replace(updateTarget, updateReplacement);
  
  const saveTarget = `await order.save();
  
    await OrderStatusHistory.create({`;
    
  const saveReplacement = `await order.save();
  
    if (status.toLowerCase() === 'completed' || status.toLowerCase() === 'paid') {
      await revenueService.logOrderRevenue(order.id).catch(err => console.error('Revenue logging error:', err));
    }
  
    await OrderStatusHistory.create({`;
    
  orderService = orderService.replace(saveTarget, saveReplacement);
  fs.writeFileSync(orderServicePath, orderService);
  console.log('Updated order.service.js');
}

// 8. Make sure syncDB has alter: true for this run so it creates tables
let dbScript = `
const { sequelize, syncDB } = require('C:\\\\ayushbasket\\\\ayushbasket-bakend\\\\src\\\\models');
const alter = async () => {
  await sequelize.sync({ alter: true });
  console.log('DB sync successful with alter: true');
  process.exit(0);
};
alter();
`;
fs.writeFileSync(path.join(__dirname, 'sync_db.cjs'), dbScript);
console.log('Created sync_db.cjs');

