import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { useToast } from './ToastContext';
import { api } from '../api';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  totalWishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { success, info, error } = useToast();
  // @ts-ignore
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      const res = await api.get<any>('/wishlist');
      const data = res.data || res;
      setWishlist(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    }
  };

  // Helper: check if a wishlist item matches a given product ID (handles number/string mismatch)
  const itemMatchesProductId = (item: any, productId: string): boolean => {
    const pid = String(productId);
    return (
      String(item.product_id) === pid ||
      String(item.id) === pid
    );
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some(item => itemMatchesProductId(item, productId));
  };

  const toggleWishlist = async (product: Product) => {
    if (!isAuthenticated) {
      error('Please login to add to wishlist');
      return;
    }
    const exists = isInWishlist(product.id);
    
    try {
      if (exists) {
        // Optimistically remove from state immediately so heart un-fills instantly
        setWishlist(prev => prev.filter(item => !itemMatchesProductId(item, product.id)));
        info(`Removed "${product.name.slice(0, 24)}..." from Wishlist`);
        
        const itemToRemove = wishlist.find(item => itemMatchesProductId(item, product.id));
        // The DB id is the wishlist row id, not the product id
        const dbId = (itemToRemove as any)?.id || product.id;
        
        await api.delete(`/wishlist/${dbId}`).catch(() => {});
        await fetchWishlist();
      } else {
        // Optimistically add to state immediately so heart fills instantly
        setWishlist(prev => [...prev, { ...product, product_id: product.id } as any]);
        success(`Added "${product.name.slice(0, 24)}..." to Wishlist`);
        
        await api.post('/wishlist', { product_id: product.id });
        await fetchWishlist();
      }
    } catch (err) {
      console.error('Wishlist toggle failed', err);
      fetchWishlist();
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!isAuthenticated) return;
    const item = wishlist.find(p => itemMatchesProductId(p, productId));
    setWishlist(prev => prev.filter(p => !itemMatchesProductId(p, productId)));
    if (item) {
      info(`Removed "${item.name.slice(0, 24)}..." from Wishlist`);
    }
    
    try {
      const dbId = (item as any)?.id || productId;
      await api.delete(`/wishlist/${dbId}`);
      await fetchWishlist();
    } catch (err) {
      fetchWishlist();
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    info('Wishlist cleared');
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
        totalWishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
