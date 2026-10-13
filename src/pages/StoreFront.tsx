import { useEffect, useState } from 'react';
import { api, API_ROOT } from '../api';

export default function StoreFront() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    api.get<any>('/products')
      .then((data) => {
        console.log('StoreFront API Response:', data);
        if (data.success) {
          const productsArray = Array.isArray(data.data) ? data.data : (Array.isArray(data.products) ? data.products : []);
          setProducts(productsArray);
          console.log('products loaded successfully', productsArray);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to AyushBasket!</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        
        {products.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
            {/* Show the uploaded image. We prepend the API_BASE_URL because the database only saves "/uploads/image.jpg" */}
            {product.image_url && (
              <img 
                src={`${API_ROOT}${product.image_url}`} 
                alt={product.name} 
                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              />
            )}
            <h3>{product.name}</h3>
            <p style={{ fontWeight: 'bold' }}>${product.price}</p>
          </div>
        ))}
        
      </div>
    </div>
  );
}
