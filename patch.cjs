const fs = require('fs');
let content = fs.readFileSync('../../ayushbasket-bakend/src/modules/order/order.service.js', 'utf8');

content = content.replace(
  `const { Order, OrderItem, Product, Category, User, Address, Prescription, sequelize, OrderStatusHistory } = require('../../models');`,
  `const { Order, OrderItem, Product, Category, User, Address, Prescription, sequelize, OrderStatusHistory } = require('../../models');\nconst couponService = require('../coupon/coupon.service');`
);

content = content.replace(
  `const { orderItems, address_id, paymentMethod } = data;`,
  `const { orderItems, address_id, paymentMethod, couponCode } = data;`
);

let orderCreateStart = content.indexOf('    const order = await Order.create({');
let orderCreateEnd = content.indexOf('}, { transaction: t });', orderCreateStart) + 23;

let originalOrderCreate = content.substring(orderCreateStart, orderCreateEnd);

let newOrderCreate = `    let finalAmount = totalAmount;
    let appliedCouponId = null;

    if (couponCode) {
      try {
        const couponValidation = await couponService.validateCouponForCart(couponCode, totalAmount);
        finalAmount -= couponValidation.discountAmount;
        appliedCouponId = couponValidation.coupon.id;
      } catch (err) {
        throw new Error('Invalid coupon: ' + err.message);
      }
    }

    const order = await Order.create({
      userId,
      addressId: address_id,
      couponId: appliedCouponId,
      totalAmount: finalAmount,
      paymentMethod: paymentMethod || 'cod',
      status: 'pending',
      paymentStatus: 'pending'
    }, { transaction: t });`;

content = content.replace(originalOrderCreate, newOrderCreate);

fs.writeFileSync('../../ayushbasket-bakend/src/modules/order/order.service.js', content);
console.log('Patched order.service.js');
