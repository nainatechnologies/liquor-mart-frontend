# 🌿 AyushBasket.com — Online AYUSH & Homeopathy Pharmacy Platform

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-7.1-CA4245?style=flat&logo=react-router&logoColor=white)](https://reactrouter.com/)

**AyushBasket.com** is a modern, high-performance, and responsive e-commerce web platform for Homeopathic, Ayurvedic, Unani, and Herbal natural healthcare remedies. Backed by a 70-year legacy in traditional wellness, the platform combines an intuitive user experience with medical-grade precision.

---

## ✨ Key Features & Highlights

### 1. 🏥 Brand & Header Experience
- **AyushBasket Custom Branding**: Custom SVG leaf-embedded logo with the signature tagline: *"NATURAL HEALTH 🍃 BETTER LIVING"*.
- **Top Announcement Bar**: Live helpline numbers (`1800-425-9999`), delivery offer announcements, and quick links.
- **Location Selector Modal**: Interactive city switcher (Hyderabad, Bengaluru, Mumbai, Delhi, Kolkata, Chennai, etc.) with simulated GPS auto-detection and `localStorage` persistence.
- **2-Step OTP Authentication Modal**: Seamless mobile login with 6-digit OTP verification, timer countdown, and quick demo auto-fill (`123456`).
- **24/7 Support Modal**: One-click WhatsApp chat (`+91 98765 43210`), toll-free calling, email support, and instant callback request.
- **Slide-Over Cart Drawer & Wishlist Badge**: Real-time counter badges and quick view drawer from anywhere in the app.

---

### 2. 🗂️ Rich Category Navigation & Mega Menu
- **Interactive Ribbon**: Quick category bar with smooth horizontal scrolling and badge counters.
- **Hierarchical Mega Menu**: Multi-column navigation across major healthcare categories:
  - Homeopathy Dilutions & Mother Tinctures
  - Bio-Chemic & Bio-Combinations
  - Ayurvedic Formulations & Herbal Tonics
  - OTC & Patent Remedies
  - Personal Care, Baby Care & Health Devices
  - Top Brands (Schwabe, SBL, Dr. Reckeweg, Bakson, Allen, etc.)
- **Mobile Drawer & Bottom Thumb Bar**: 5-tab persistent bottom navigation bar for mobile shoppers (*Home, Categories, Search, Cart, Profile*).

---

### 3. 🏡 Dynamic Homepage
1. **Hero Search Banner**: Prominent search bar with instant keyword matching across remedies, brands, potencies, and health concerns.
2. **Promotional Carousel**: Rotating banner showcase highlighting exclusive discounts, seasonal immunity packs, and verified brands.
3. **Shop by Category**: Grid with visual photography and item count badges.
4. **Quick Order & Help Actions**: 3 quick-access cards for **Prescription Upload**, **WhatsApp Ordering**, and **Support Desk**.
5. **Best Sellers Carousel**: Horizontal product slider featuring high-demand remedies with ratings, potencies, and instant cart actions.
6. **Stacked Product Carousels**: Dedicated horizontal sliders for:
   - *Special Offers & Discounts*
   - *Immunity & Daily Wellness*
   - *Mother Tinctures & Herbal Care*
7. **Why Choose AyushBasket**: 5 core trust pillars (70-Year Legacy, 100% Genuine Brands, Temperature-Controlled Storage, Fast Home Delivery, Expert Support).
8. **Interactive FAQ Accordion**: Instant answers to common questions about dosage, prescriptions, shipping, and returns.

---

### 4. 🛒 Full E-Commerce Experience

- **Product Catalog (`/products`)**:
  - Multi-attribute filter sidebar (Category, Brand, Price Range, Form/Preparation, Potency, Minimum Rating, In-Stock filter).
  - Flexible sorting (Popularity, Price Low to High, Price High to Low, Rating, Newest).
  - Responsive grid with zero layout shifts.

- **Product Details (`/product/:id`)**:
  - Multi-image gallery with zoom preview.
  - **Zero Auto-Preselection**: Clear selection requirement for Potency (`30C`, `200C`, `1M`, `Q`, `6X`) and Pack Size before checkout.
  - Tabbed clinical documentation: *Indications, Composition, Dosage & Usage, Safety Instructions, and Verified Reviews*.
  - **Interactive Review System**: Rating breakdown and "Write a Review" modal.
  - Related product recommendations.

- **Prescription Upload (`/prescription`)**:
  - Drag-and-drop file upload (`.jpg`, `.png`, `.pdf`).
  - Patient detail inputs and pharmacist consultation checkbox.
  - Simulated progress bar and order confirmation.

- **Shopping Cart (`/cart`)**:
  - Real-time quantity modifiers (+ / -) and item removal.
  - Dynamic free shipping progress meter (Threshold: ₹499).
  - Coupon code system (`HOMEO20`, `FIRST50`, `WELLNESS10`) with live price recalculation.

- **Checkout Flow (`/checkout`)**:
  - Saved delivery address selection + add new address modal form.
  - Flexible payment options: *Demo Instant Pay, UPI / QR, Credit/Debit Cards, Net Banking, and Cash on Delivery (COD)*.

- **Order Success (`/order-success/:orderId`)**:
  - Animated confetti celebration.
  - Dynamic tracking timeline (Order Placed → Verified → Dispatched → Out for Delivery).
  - Summary receipt with print/download simulation.

- **User Profile (`/profile`)**:
  - Tabbed dashboard for *My Orders, My Prescriptions, Saved Addresses, and Account Details*.

- **About Us (`/about`)**:
  - Comprehensive brand narrative celebrating 70 years of service in traditional healthcare.
  - Timeline of milestones, quality assurance standards, and mission statement.

- **Support Center (`/support`)**:
  - Searchable FAQ database, direct contact methods, and ticket submission form.

---

## 🏗️ Project Architecture & Directory Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── AyushBasketLogo.tsx      # Custom SVG brand logo & tagline
│   │   ├── TopNotificationBar.tsx   # Top helpline & promo banner
│   │   ├── Navbar.tsx               # Main responsive navigation header
│   │   ├── CategoryNav.tsx          # Quick category ribbon
│   │   ├── MegaMenu.tsx             # Multi-column dropdown mega menu
│   │   ├── MobileDrawer.tsx         # Slide-in mobile side menu
│   │   ├── MobileBottomNav.tsx      # Sticky mobile thumb bar
│   │   └── Footer.tsx               # Footer with links, trust badges & newsletter
│   ├── home/
│   │   ├── HeroSearchBanner.tsx     # Prominent hero search section
│   │   ├── HeroCarousel.tsx         # Auto-advancing promotional slider
│   │   ├── ShopByCategory.tsx       # Visual category grid
│   │   ├── QuickOrderHelp.tsx       # Prescription, WhatsApp & Support action cards
│   │   ├── BestSellers.tsx          # Best-selling remedies slider
│   │   ├── StackedProductSliders.tsx# Multiple horizontal product sections
│   │   ├── HealthConditionsSection.tsx # Health concern navigator
│   │   └── WhyHomeoHub.tsx          # 70-year legacy & trust pillars
│   ├── product/
│   │   └── ProductCard.tsx          # Reusable product card with potency selection
│   ├── modals/
│   │   ├── AuthModal.tsx            # 2-step OTP authentication dialog
│   │   ├── LocationModal.tsx        # City selector & GPS detection
│   │   ├── PrescriptionModal.tsx    # Fast prescription upload modal
│   │   └── SupportModal.tsx         # 24/7 Helpline & WhatsApp modal
│   └── drawers/
│       └── CartDrawer.tsx           # Quick slide-over shopping cart drawer
├── context/
│   ├── AuthContext.tsx              # User state, addresses, order history
│   ├── CartContext.tsx              # Cart items, discounts, delivery threshold
│   ├── LocationContext.tsx          # Selected city & GPS location
│   ├── ToastContext.tsx             # Alert & notification toast system
│   ├── UIContext.tsx                # Modal & drawer visibility state
│   └── WishlistContext.tsx          # Wishlist persistence & toggle helpers
├── data/
│   ├── products.ts                  # Comprehensive product database & potencies
│   ├── categories.ts                # Categories, subcategories & top brands
│   └── offers.ts                    # Hero banners, coupon codes & FAQs
├── pages/
│   ├── About.tsx                    # 70-year legacy narrative & company story
│   ├── Cart.tsx                     # Full cart & order breakdown
│   ├── Categories.tsx               # Complete category browser
│   ├── Checkout.tsx                 # Multi-step checkout & payment
│   ├── Home.tsx                     # Main landing page
│   ├── OrderSuccess.tsx             # Post-order confirmation & receipt
│   ├── Prescription.tsx             # Dedicated prescription upload page
│   ├── ProductDetails.tsx           # Product view with tabs & reviews
│   ├── Products.tsx                 # Product catalog & filter sidebar
│   ├── Profile.tsx                  # User dashboard & past orders
│   ├── Support.tsx                  # Support desk & contact forms
│   └── Wishlist.tsx                 # Saved favorite products
├── types/
│   └── index.ts                     # TypeScript interfaces and models
├── App.tsx                          # Top-level routing & context providers
├── main.tsx                         # React entry point
└── index.css                        # Tailwind directives & theme configuration
```

---

## ⚙️ Tech Stack & Dependencies

| Category | Technology |
|---|---|
| **Frontend Framework** | React 19.2 |
| **Language** | TypeScript 6.0 |
| **Styling** | Tailwind CSS 3.4 + PostCSS + Autoprefixer |
| **Routing** | React Router 7.1 |
| **Icons** | Lucide React |
| **Effects** | Canvas Confetti |
| **Build Tool** | Vite 8.2 |
| **Linter** | Oxlint |

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js** (v18 or higher) and **npm** installed on your system.

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/manishkatla1/homeo.git

# 2. Navigate to the project folder
cd homeo

# 3. Install dependencies
npm install
```

### Running Locally

```bash
# Start the Vite development server
npm run dev
```

The application will start at `http://localhost:5173`.

### Building for Production

```bash
# Type check and build optimized static bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 💡 Configuration & Customization

- **Add or edit remedies**: Modify [`src/data/products.ts`](file:///d:/Homeohub/src/data/products.ts) to update prices, stock, descriptions, images, or potency lists.
- **Update categories & brands**: Modify [`src/data/categories.ts`](file:///d:/Homeohub/src/data/categories.ts).
- **Configure coupons & promotional banners**: Edit [`src/data/offers.ts`](file:///d:/Homeohub/src/data/offers.ts).
- **Theme colors & styling**: Adjust [`tailwind.config.js`](file:///d:/Homeohub/tailwind.config.js) or [`src/index.css`](file:///d:/Homeohub/src/index.css).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
