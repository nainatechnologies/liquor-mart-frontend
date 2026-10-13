const fs = require('fs');

const p = 'C:\\ayushbasket\\homeoadminpanel\\src\\pages\\Orders.tsx';
let txt = fs.readFileSync(p, 'utf8');

txt = txt.replace(/selectedOrder\.product\./g, 'selectedOrder.product?.');
txt = txt.replace(/selectedOrder\.payment\./g, 'selectedOrder.payment?.');
// Also bulletproof the customer name rendering in the table
txt = txt.replace(/order\.customer\?\.name \|\| order\.user_name/g, '(order.customer?.name || order.user_name || order.patient_name || order.patientName)');

fs.writeFileSync(p, txt);
console.log('Patched selectedOrder.product crashes');
