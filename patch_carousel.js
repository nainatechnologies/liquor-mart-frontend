const fs = require('fs');

let content = fs.readFileSync('src/components/home/HeroCarousel.tsx', 'utf8');

// Replace standard imports
if (!content.includes('import { api }')) {
  content = content.replace("import React, { useState, useEffect, useCallback } from 'react';", 
    "import React, { useState, useEffect, useCallback } from 'react';\nimport { api } from '../../api';");
}

// Modify the component to fetch dynamically
const fetchLogic = \
  const [activePromoSlides, setActivePromoSlides] = useState(promoSlides);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const res = await api.get('/coupons/active');
        const data = res.data || res;
        const activeCoupons = Array.isArray(data) ? data : (data.data || data.coupons || []);
        
        if (activeCoupons && activeCoupons.length > 0) {
          // Map DB coupons to slider items
          const mapped = activeCoupons.map((c, idx) => ({
            id: c.id,
            tag: c.tag || 'PROMO',
            tagBg: c.tagBg || 'bg-emerald-600 text-white',
            title: c.title || \\\,
            titleAccent: c.titleAccent || '',
            subtitle: c.subtitle || \CODE: \\,
            ctaText: 'Explore',
            ctaLink: c.ctaLink || '/products',
            image: c.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
            gradientBg: c.gradientBg || 'from-[#ecfeff] via-[#cffafe] to-[#a5f3fc]',
            extraInfo: ''
          }));
          setActivePromoSlides(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch promos', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPromos();
  }, []);
\;

if (!content.includes('setActivePromoSlides')) {
  content = content.replace('const [activeIndex, setActiveIndex] = useState(0);', 
    'const [activeIndex, setActiveIndex] = useState(0);\n' + fetchLogic);
    
  // replace all 'promoSlides' inside the component with 'activePromoSlides' (except the initial promoSlides array def)
  // Be careful, only replace inside the component body.
  const compStart = content.indexOf('export const HeroCarousel: React.FC = () => {');
  const compBody = content.substring(compStart);
  const newCompBody = compBody.replace(/promoSlides/g, 'activePromoSlides');
  
  content = content.substring(0, compStart) + newCompBody;
  fs.writeFileSync('src/components/home/HeroCarousel.tsx', content);
  console.log('Patched HeroCarousel.tsx');
}
