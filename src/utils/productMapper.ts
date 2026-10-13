import { Product } from '../types';
import resolveImage from './resolveImage';
import { API_ROOT } from '../api';

export const mapProduct = (p: any): Product => {
  const isAlcohol = true;
  return {
    id: p.id ? p.id.toString() : Math.random().toString(),
    name: p.name || 'Premium Spirit',
    brand: p.brand || p.brand_name || p.manufacturer || 'THE LIQUOR Selection',
    category: p.category_name || p.category || 'Spirits',
    categorySlug: (p.category_name || p.category || 'spirits').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    subcategory: p.subcategory || '',
    subcategorySlug: p.subcategory ? p.subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '',
    price: parseFloat(p.offerPrice) || parseFloat(p.price) || 0,
    originalPrice: parseFloat(p.price) || parseFloat(p.offerPrice) || 0,
    discountPercentage: p.offerPrice && parseFloat(p.offerPrice) < parseFloat(p.price)
      ? Math.round(((parseFloat(p.price) - parseFloat(p.offerPrice)) / parseFloat(p.price)) * 100)
      : (p.discountPercentage || 0),
    rating: p.averageRating ? parseFloat(p.averageRating) : (p.rating || 4.8),
    reviewsCount: p.reviewsCount || 45,
    inStock: p.stock !== undefined ? p.stock > 0 : true,
    isBestSeller: p.isBestSeller || p.productTag?.toLowerCase() === 'best seller' || p.product_tag?.toLowerCase() === 'best seller',
    isFeatured: p.isFeatured,
    isTrending: p.isTrending,
    stockCount: p.stock || 25,
    image: resolveImage(p.image || p.imageUrl, API_ROOT) || p.image || 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&auto=format&fit=crop&q=80',
    images: (p.images?.length ? p.images : [p.imageUrl, p.imageUrl2, p.imageUrl3]).filter(Boolean).map((img: string) => resolveImage(img, API_ROOT) || img),
    potencyOptions: (p.package_size || p.packSize || p.sizeOptions?.length) ? (p.sizeOptions || (p.package_size || p.packSize).split(',').map((s: string) => s.trim())) : ['750ml'],
    sizeOptions: (p.package_size || p.packSize || p.pack_size) ? (p.package_size || p.packSize || p.pack_size).split(',').map((s: string) => s.trim()).filter(Boolean) : (p.sizeOptions || ['750ml']),
    form: p.form || 'Single Malt',
    shortDescription: p.shortDescription || p.description || 'Premium authentic bottle from our certified bonded cellar.',
    description: p.description || p.fullDescription || 'Sourced directly from authorized distilleries and stored under optimal cellar conditions for maximum flavor and preservation.',
    keyBenefits: p.keyBenefits || ['Authentic imported bottling with official state excise duty stamp.', 'Stored in temperature-controlled humidity cellars.', '30-minute express doorstep delivery.'],
    ingredients: p.ingredients || ['Premium Distilled Spirits', 'Spring Water'],
    directions: p.directions || 'Serve chilled or on the rocks. Drink responsibly.',
    safetyInfo: p.safetyInfo || 'Alcohol consumption is injurious to health. Not for sale to minors (21+ Only). Drink responsibly.',
    tags: p.tags || (p.metaTag ? p.metaTag.split(',').map((s: string) => s.trim()) : ['Premium', 'Genuine Stock', 'Chilled Delivery']),
    healthConditions: p.healthConditions || ['Party', 'Celebration', 'Tasting'],
    returnPolicy: p.returnPolicy || 'Replacement available on unopened bottles with intact seals if damaged during transit.',
    packSize: p.packSize || p.package_size || p.pack_size || '750ml',
    composition: p.composition,
    dosage: p.dosage,
    usage: p.usage,
    safety_advice: p.safety_advice,
    storage_advice: p.storage_advice || 'Store upright in a cool, dark location away from direct sunlight.',
    fullDescription: p.fullDescription,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    metaTag: p.metaTag,
    abv: p.abv || '40% ABV',
    countryOfOrigin: p.countryOfOrigin || 'Imported'
  };
};
