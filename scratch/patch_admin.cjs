const fs = require('fs');

const adminOrdersPath = 'C:\\ayushbasket\\homeoadminpanel\\src\\pages\\Orders.tsx';
let content = fs.readFileSync(adminOrdersPath, 'utf8');

const targetContent = `<h3 className="text-primary fw-600 modal-section-title">Prescription Document</h3>
                  <div
                    onClick={() => setPreviewImage(selectedOrder.imageUrl`;

const replacementContent = `<h3 className="text-primary fw-600 modal-section-title">Prescription Document</h3>
                  
                  <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', color: '#166534' }}>
                    <p style={{ margin: '0 0 4px 0' }}><strong>Patient:</strong> {(selectedOrder as any).patient_name || (selectedOrder as any).patientName || 'N/A'}</p>
                    {((selectedOrder as any).doctor_name || (selectedOrder as any).doctorName) && (
                      <p style={{ margin: '0 0 4px 0' }}><strong>Doctor:</strong> {(selectedOrder as any).doctor_name || (selectedOrder as any).doctorName}</p>
                    )}
                    {((selectedOrder as any).medicines || (selectedOrder as any).medicines_ordered) && (
                      <p style={{ margin: '0 0 4px 0' }}><strong>Medicines Requested:</strong> {(selectedOrder as any).medicines || (selectedOrder as any).medicines_ordered}</p>
                    )}
                    {(selectedOrder as any).notes && (
                      <p style={{ margin: '0 0 4px 0' }}><strong>Notes:</strong> {(selectedOrder as any).notes}</p>
                    )}
                  </div>

                  <div
                    onClick={() => setPreviewImage(selectedOrder.imageUrl`;

content = content.replace(targetContent, replacementContent);
fs.writeFileSync(adminOrdersPath, content);
console.log('Successfully patched admin Orders.tsx');
