export interface Festival { 
  id: string; 
  name: string; 
  isActive?: boolean;
  couponCode: string;
  decorations: string[];
  discount: string;
  headerGradient?: string;
  emoji?: string;
  badge?: string;
  tagline?: string;
  subtitle?: string;
  description?: string;
}

export const festivals: Festival[] = [
  {
    id: 'weekend-tasting',
    name: 'Weekend VIP Spirits Tasting',
    isActive: true,
    couponCode: 'CHEERS10',
    decorations: ['🍸', '🥂', '🍾', '🥃'],
    discount: '10% OFF',
    headerGradient: 'from-amber-600 via-amber-500 to-amber-700',
    badge: 'EXCLUSIVE',
    tagline: 'Save 10% on your premium spirits order',
    subtitle: 'Valid on Single Malts, Fine Wines & Craft Beers above ₹1,999'
  }
];

export const FESTIVALS_CALENDAR: Festival[] = festivals;

export const getActiveFestival = (): Festival | null => festivals[0];
