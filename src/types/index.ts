export type PotencyOption = 'Standard' | '750ml' | '1000ml' | '375ml' | '500ml' | '330ml (Pint)' | '6-Pack (330ml)' | '12-Pack' | 'Case (24)';

export type ProductForm = 
  | 'Single Malt'
  | 'Blended Scotch'
  | 'Bourbon / Whiskey'
  | 'Vodka'
  | 'Gin'
  | 'Rum'
  | 'Tequila & Mezcal'
  | 'Red Wine'
  | 'White & Rosé Wine'
  | 'Champagne & Sparkling'
  | 'Craft Beer'
  | 'Liqueurs & Bitters'
  | 'Mixers & Accessories';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  subcategorySlug: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  image: string;
  images: string[];
  potencyOptions?: string[]; // Volume options like 750ml, 1L, etc.
  sizeOptions?: string[];
  form: ProductForm;
  shortDescription: string;
  description: string;
  keyBenefits: string[]; // Tasting Notes
  ingredients: string[]; // Key Botanicals / Grapes / Distillation notes
  directions: string; // Serving Suggestion / Best enjoyed
  safetyInfo: string; // Age warning & responsible consumption
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isHomeopathic?: boolean;
  tags: string[];
  healthConditions: string[]; // Pairings / Occasions
  returnPolicy?: string;
  packSize?: string;
  composition?: string;
  dosage?: string;
  usage?: string;
  safety_advice?: string;
  storage_advice?: string;
  fullDescription?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaTag?: string;
  // Liquor specific properties
  abv?: string;
  countryOfOrigin?: string;
  vintageYear?: string;
  caskType?: string;
  flavourProfile?: string[];
  // Raw backend properties
  offerPrice?: number | string;
  imageUrl?: string;
  brand_name?: string;
  category_name?: string;
  manufacturer?: string;
  averageRating?: string | number;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  image: string;
  description: string;
  itemCount: number;
  subcategories: SubCategory[];
  badge?: string;
}

export interface Brand {
  id: string;
  name: string;
  country: string;
  logo: string;
  itemCount: number;
  description: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  isVerified: boolean;
  helpfulCount: number;
}

export interface CartItem {
  id?: string | number;
  product: Product;
  quantity: number;
  selectedPotency?: string;
  selectedSize?: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  pincode: string;
  flatHouse: string;
  streetArea: string;
  city: string;
  state: string;
  addressType: 'Home' | 'Work' | 'Other';
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderDate: string;
  status: 'Processing' | 'Confirmed' | 'Dispatched' | 'Out for Delivery' | 'Delivered';
  items: {
    product: Product;
    quantity: number;
    price: number;
    selectedPotency?: string;
    selectedSize?: string;
  }[];
  address: Address;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending' | 'COD';
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  estimatedDelivery: string;
  trackingNumber: string;
}

export interface PrescriptionRecord {
  id: string;
  uploadDate: string;
  fileName: string;
  fileSize: string;
  filePreview?: string;
  patientName: string;
  doctorName?: string;
  phone: string;
  notes?: string;
  status: 'Uploaded' | 'Under Review' | 'Verified' | 'Order Ready';
  order_id?: string | number;
}

export interface BannerSlide {
  id: number;
  headline: string;
  subtitle: string;
  badge: string;
  ctaText: string;
  ctaLink: string;
  bgGradient: string;
  image: string;
  description: string;
  supportingText: string;
}

export interface Coupon {
  id?: number | string;
  code: string;
  discountType?: string;
  discountValue?: number;
  minPurchase?: number;
  maxDiscount?: number;
  description?: string;
  validUntil?: string;
  // Legacy fields
  discountPercent?: number;
  minOrder?: number;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  joinedDate: string;
}
