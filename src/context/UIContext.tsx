import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface UIContextType {
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  openLocationModal: () => void;

  isSupportModalOpen: boolean;
  setIsSupportModalOpen: (open: boolean) => void;
  openSupportModal: () => void;

  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authStep: 1 | 2;
  setAuthStep: (step: 1 | 2) => void;
  authMobile: string;
  setAuthMobile: (mobile: string) => void;
  openAuthModal: (initialMobile?: string) => void;

  isPrescriptionModalOpen: boolean;
  setIsPrescriptionModalOpen: (open: boolean) => void;
  openPrescriptionModal: () => void;

  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  openCartDrawer: () => void;

  isMegaMenuOpen: boolean;
  setIsMegaMenuOpen: (open: boolean) => void;
  toggleMegaMenu: () => void;

  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;

  isMobileSearchOpen: boolean;
  setIsMobileSearchOpen: (open: boolean) => void;

  pendingAction: string | null;
  setPendingAction: (action: string | null) => void;
  executePendingAction: () => void;

  isAgeModalOpen: boolean;
  setIsAgeModalOpen: (open: boolean) => void;
  openAgeModal: () => void;
  isAgeVerified: boolean;
  setIsAgeVerified: (verified: boolean) => void;

  closeAllModals: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { info } = useToast();

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authStep, setAuthStep] = useState<1 | 2>(1);
  const [authMobile, setAuthMobile] = useState('');
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('theliquor_age_verified') === 'true';
    } catch {
      return false;
    }
  });

  const [isAgeModalOpen, setIsAgeModalOpen] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('theliquor_age_verified') !== 'true';
    } catch {
      return true;
    }
  });

  const openAgeModal = useCallback(() => setIsAgeModalOpen(true), []);

  const openLocationModal = useCallback(() => setIsLocationModalOpen(true), []);
  const openSupportModal = useCallback(() => setIsSupportModalOpen(true), []);
  
  const openAuthModal = useCallback((initialMobile: string = '') => {
    if (initialMobile) setAuthMobile(initialMobile);
    setAuthStep(1);
    setIsAuthModalOpen(true);
  }, []);

  const openPrescriptionModal = useCallback(() => {
    if (!isAuthenticated) {
      setPendingAction('prescription');
      info('Please login first to upload your doctor prescription');
      openAuthModal();
    } else {
      setIsPrescriptionModalOpen(true);
    }
  }, [isAuthenticated, info, openAuthModal]);

  const executePendingAction = useCallback(() => {
    if (pendingAction === 'prescription') {
      setIsPrescriptionModalOpen(true);
      setPendingAction(null);
    }
  }, [pendingAction]);

  const openCartDrawer = useCallback(() => setIsCartDrawerOpen(true), []);
  const toggleMegaMenu = useCallback(() => setIsMegaMenuOpen(prev => !prev), []);
  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen(prev => !prev), []);

  const closeAllModals = useCallback(() => {
    setIsLocationModalOpen(false);
    setIsSupportModalOpen(false);
    setIsAuthModalOpen(false);
    setIsPrescriptionModalOpen(false);
    setIsCartDrawerOpen(false);
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
  }, []);

  return (
    <UIContext.Provider
      value={{
        isLocationModalOpen,
        setIsLocationModalOpen,
        openLocationModal,

        isSupportModalOpen,
        setIsSupportModalOpen,
        openSupportModal,

        isAuthModalOpen,
        setIsAuthModalOpen,
        authStep,
        setAuthStep,
        authMobile,
        setAuthMobile,
        openAuthModal,

        isPrescriptionModalOpen,
        setIsPrescriptionModalOpen,
        openPrescriptionModal,

        isCartDrawerOpen,
        setIsCartDrawerOpen,
        openCartDrawer,

        isMegaMenuOpen,
        setIsMegaMenuOpen,
        toggleMegaMenu,

        isMobileMenuOpen,
        setIsMobileMenuOpen,
        toggleMobileMenu,

        isMobileSearchOpen,
        setIsMobileSearchOpen,

        pendingAction,
        setPendingAction,
        executePendingAction,

        isAgeModalOpen,
        setIsAgeModalOpen,
        openAgeModal,
        isAgeVerified,
        setIsAgeVerified,

        closeAllModals,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
