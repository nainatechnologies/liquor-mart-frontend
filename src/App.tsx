import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Context Providers
import { ToastProvider } from './context/ToastContext';
import { LocationProvider } from './context/LocationContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';

// Global Layout Components
import { Navbar } from './components/layout/Navbar';
import { CategoryNav } from './components/layout/CategoryNav';
import { MegaMenu } from './components/layout/MegaMenu';
import { MobileDrawer } from './components/layout/MobileDrawer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Footer } from './components/layout/Footer';

// Global Modals & Drawers
import { LocationModal } from './components/modals/LocationModal';
import { SupportModal } from './components/modals/SupportModal';
import { AuthModal } from './components/modals/AuthModal';
import { PrescriptionModal } from './components/modals/PrescriptionModal';
import { FestivalPopup } from './components/modals/FestivalPopup';
import { CartDrawer } from './components/drawers/CartDrawer';
import { AgeVerificationModal } from './components/modals/AgeVerificationModal';

// Pages
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { Categories } from './pages/Categories';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { Prescription } from './pages/Prescription';
import { Profile } from './pages/Profile';
import { Support } from './pages/Support';
import { About } from './pages/About';
import { Faq } from './pages/Faq';

// Scroll to top on route change component
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <LocationProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <UIProvider>
                <Router>
                  <ScrollToTop />
                  
                  <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 antialiased font-sans">
                    
                    {/* Main Sticky Header & Category Ribbon */}
                    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-xs">
                      <Navbar />
                      <CategoryNav />
                    </div>

                    {/* Main Route Content */}
                    <main className="flex-1">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/product/:id" element={<ProductDetails />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                        <Route path="/prescription" element={<Prescription />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/support" element={<Support />} />
                        <Route path="/faq" element={<Faq />} />
                        <Route path="*" element={<Home />} />
                      </Routes>
                    </main>

                    {/* Mega Footer */}
                    <Footer />

                    {/* Mobile Bottom Navigation (Visible on mobile screens) */}
                    <MobileBottomNav />

                    {/* Global Overlays & Modals */}
                    <MegaMenu />
                    <MobileDrawer />
                    <LocationModal />
                    <SupportModal />
                    <AuthModal />
                    <PrescriptionModal />
                    <CartDrawer />
                    <FestivalPopup />
                    <AgeVerificationModal />

                  </div>

                </Router>
              </UIProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </LocationProvider>
    </ToastProvider>
  );
};

export default App;
