/**
 * Resolves a product image URL to a reliable full URL.
 * Falls back to high-resolution genuine liquor bottle imagery
 * if the relative image path is unavailable or offline.
 */
export const DEFAULT_SPIRIT_FALLBACK = 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&auto=format&fit=crop&q=80';

const resolveImage = (src: string | null | undefined, apiRoot?: string): string => {
  if (!src || typeof src !== 'string' || !src.trim()) return DEFAULT_SPIRIT_FALLBACK;
  
  const trimmed = src.trim();
  if (trimmed.startsWith('http') || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }
  
  if (apiRoot && !trimmed.startsWith('/uploads')) {
    return `${apiRoot}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
  }
  
  return DEFAULT_SPIRIT_FALLBACK;
};

export default resolveImage;
