import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  Wine, 
  Award, 
  Activity, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  ShieldPlus
} from 'lucide-react';
import { ProductCard } from '../product/ProductCard';
import { Product } from '../../types';
import { api } from '../../api';
import { products as catalogProducts } from '../../data/products';
import { mapProduct } from '../../utils/productMapper';

interface SliderRowProps {
  title: string;
  tag: string;
  icon: React.ElementType;
  tagColor: string;
  categoryLink: string;
  productsList: Product[];
}

const ProductSliderRow: React.FC<SliderRowProps> = ({
  title,
  tag,
  icon: Icon,
  tagColor,
  categoryLink,
  productsList,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-4">
      {/* Row Header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1 ${tagColor}`}>
            <Icon className="w-3.5 h-3.5" />
            <span>{tag}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Scroll Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-wine-600 hover:text-white text-slate-700 flex items-center justify-center shadow-xs transition-all active:scale-95 cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-wine-600 hover:text-white text-slate-700 flex items-center justify-center shadow-xs transition-all active:scale-95 cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Link
            to={categoryLink}
            className="text-xs font-bold text-slate-700 hover:text-wine-700 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Side-by-Side Horizontal Product Slider */}
      <div
        ref={rowRef}
        className="flex items-stretch gap-4 overflow-x-auto no-scrollbar pb-3 pt-1 -mx-1 px-1 snap-x scroll-smooth"
      >
        {productsList.map((product) => (
          <div
            key={product.id}
            className="min-w-[260px] sm:min-w-[290px] max-w-[290px] flex-shrink-0 snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const StackedProductSliders: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>(catalogProducts);
  
  React.useEffect(() => {
    api.get<any>('/products').then(res => {
      if (res.success && (res.data || res.products)) {
        const productsArray = Array.isArray(res.data) ? res.data : (Array.isArray(res.products) ? res.products : []);
        if (productsArray.length > 0) {
          const mapped = productsArray.map(mapProduct);
          const combined = [...mapped];
          for (const cp of catalogProducts) {
            if (!combined.some(c => c.name.toLowerCase() === cp.name.toLowerCase())) {
              combined.push(cp);
            }
          }
          setProducts(combined);
        }
      }
    }).catch(() => {
      setProducts(catalogProducts);
    });
  }, []);

  // Slider 1: Rare Single Malts & Blended Whiskies
  const singleMalts = products.filter(
    (p) =>
      p.categorySlug === 'single-malt' ||
      p.categorySlug === 'blended-whisky' ||
      p.form === 'Single Malt' ||
      p.form === 'Blended Scotch' ||
      p.form === 'Bourbon / Whiskey'
  );

  // Slider 2: Vintage Wines & Champagnes
  const winesAndChampagne = products.filter(
    (p) =>
      p.categorySlug === 'red-wine' ||
      p.categorySlug === 'white-rose-wine' ||
      p.categorySlug === 'champagne' ||
      p.form === 'Red Wine' ||
      p.form === 'White & Rosé Wine' ||
      p.form === 'Champagne & Sparkling'
  );

  // Slider 3: Artisanal Gins, Vodkas & Tequilas
  const spirits = products.filter(
    (p) =>
      p.categorySlug === 'gin' ||
      p.categorySlug === 'vodka' ||
      p.categorySlug === 'tequila' ||
      p.categorySlug === 'rum' ||
      p.form === 'Gin' ||
      p.form === 'Vodka' ||
      p.form === 'Tequila & Mezcal' ||
      p.form === 'Rum'
  );

  // Slider 4: Craft Beers, Liqueurs & Mixers
  const beersAndMixers = products.filter(
    (p) =>
      p.categorySlug === 'beer' ||
      p.categorySlug === 'liqueurs' ||
      p.categorySlug === 'mixers-accessories' ||
      p.form === 'Craft Beer' ||
      p.form === 'Liqueurs & Bitters' ||
      p.form === 'Mixers & Accessories'
  );

  return (
    <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* 1. SLIDER 1: Rare Single Malts & Premium Scotch */}
      <ProductSliderRow
        title="Rare Single Malts & Master Distilleries"
        tag="Aged Scotch & Malts"
        icon={Flame}
        tagColor="bg-amber-100 text-amber-900 border border-amber-300"
        categoryLink="/products?category=single-malt"
        productsList={singleMalts.length > 0 ? singleMalts : products.slice(0, 6)}
      />

      {/* 2. SLIDER 2: Curated World Wines & Champagnes */}
      <ProductSliderRow
        title="World Wine Cellar & French Champagnes"
        tag="Grand Cru & Vintages"
        icon={Wine}
        tagColor="bg-rose-100 text-rose-900 border border-rose-300"
        categoryLink="/products?category=red-wine"
        productsList={winesAndChampagne.length > 0 ? winesAndChampagne : products.slice(2, 8)}
      />

      {/* 3. SLIDER 3: Artisanal Gins, Vodkas & Agave Tequilas */}
      <ProductSliderRow
        title="Artisanal Gins, Super-Vodkas & 100% Agave Tequila"
        tag="Craft Distilled"
        icon={Award}
        tagColor="bg-wine-100 text-wine-900 border border-wine-300"
        categoryLink="/products?category=gin"
        productsList={spirits.length > 0 ? spirits : products.slice(4, 10)}
      />

      {/* 4. SLIDER 4: 30-Min Chilled Craft Beers & Mixers */}
      <ProductSliderRow
        title="30-Min Chilled Craft Beers, Ciders & Mixers"
        tag="Party Ready"
        icon={Activity}
        tagColor="bg-emerald-100 text-emerald-900 border border-emerald-300"
        categoryLink="/products?category=beer"
        productsList={beersAndMixers.length > 0 ? beersAndMixers : products.slice(6, 12)}
      />

    </section>
  );
};
