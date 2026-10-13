const mysql = require('mysql2/promise');
async function run() {
  const conn = await mysql.createConnection({
    host: '193.203.184.99', 
    user: 'u237482260_ayushuser', 
    password: 'Ayush@2026DB@#', 
    database: 'u237482260_ayushbasket', 
    port: 3306
  });
  
  await conn.execute(`
    INSERT IGNORE INTO coupons 
      (code, discount_type, discount_value, min_order_amount, is_active, created_at, updated_at) 
    VALUES 
      ('GERMAN20', 'percentage', 20, 499, 1, NOW(), NOW()), 
      ('BEAUTY30', 'percentage', 30, 599, 1, NOW(), NOW()), 
      ('HOMEO25', 'percentage', 25, 999, 1, NOW(), NOW()), 
      ('CARE15', 'percentage', 15, 399, 1, NOW(), NOW()), 
      ('WELCOME100', 'fixed', 100, 399, 1, NOW(), NOW())
  `);
  
  console.log('Coupons added!');
  conn.end();
}
run();
