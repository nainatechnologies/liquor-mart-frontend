import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../api';
import { categories as initialCategories, brandsList as initialBrands } from '../data/categories';

interface DataContextType {
  categories: any[];
  brandsList: any[];
  isLoading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<any[]>(initialCategories);
  const [brandsList, setBrandsList] = useState<any[]>(initialBrands);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [catsRes, brandsRes] = await Promise.all([
          api.get<{success: boolean, data: any[]}>('/categories').catch(() => null),
          api.get<{success: boolean, data: any[]}>('/brands').catch(() => null)
        ]);

        if (catsRes?.success && catsRes.data.length > 0) {
          setCategories(catsRes.data);
        }
        if (brandsRes?.success && brandsRes.data.length > 0) {
          setBrandsList(brandsRes.data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ categories, brandsList, isLoading, error }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
