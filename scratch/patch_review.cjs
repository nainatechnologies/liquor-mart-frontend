const fs = require('fs');
const path = 'C:\\ayushbasket\\ayushbasket-bakend\\src\\modules\\review\\review.service.js';

let content = fs.readFileSync(path, 'utf8');

const targetCheck = `  const hasPurchased = await Order.findOne({
    where: { userId, status: 'completed' },
    include: [{
      model: OrderItem,
      as: 'items',
      where: { productId }
    }]
  });

  if (!hasPurchased) {
    const error = new Error('You can only review products you have purchased');
    error.statusCode = 403;
    throw error;
  }`;

if (content.includes(targetCheck)) {
  content = content.replace(targetCheck, `  // The purchase check has been removed by user request, 
  // anyone logged in can review the product.`);
  fs.writeFileSync(path, content);
  console.log('Successfully removed purchase requirement from reviews.');
} else {
  console.log('Target block not found or already removed.');
}
