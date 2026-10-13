# 🍷 THE LIQUOR — Luxury Spirits, Fine Wines & Craft Beers Platform

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-7.1-CA4245?style=flat&logo=react-router&logoColor=white)](https://reactrouter.com/)

**THE LIQUOR** is a modern, high-performance, and responsive e-commerce web platform for authentic luxury spirits, rare single malts, curated vintage wines, craft beers, and bar essentials. Designed with an elegant aesthetic and seamless UX, the platform delivers a premium spirits shopping and doorstep delivery experience.

---

## ✨ Key Features & Highlights

### 1. 🔞 Regulatory Compliance & Brand Experience
- **Age Verification Modal**: Mandatory 21+ age verification gate upon entry with `localStorage` persistence to meet regulatory compliance.
- **Luxury Brand Identity**: Sophisticated typography with Cinzel and Plus Jakarta Sans, refined wine & amber color palettes, and custom insignia.
- **Top Announcement Bar**: Live helpline numbers, express delivery notifications, and promotional banners.
- **Interactive Location Selector**: City selector (Hyderabad, Bengaluru, Mumbai, Delhi, Kolkata, Chennai, etc.) with simulated GPS auto-detection.
- **2-Step OTP Authentication**: Clean mobile phone login with 6-digit OTP verification, timer countdown, and quick demo auto-fill (`123456`).
- **24/7 Concierge Support Modal**: Quick WhatsApp consultation, toll-free helpline, email support, and instant callback request.
- **Slide-Over Cart Drawer & Wishlist**: Real-time counter badges and quick-access shopping drawer from any page.

---

### 2. 🍾 Category Navigation & Curated Collections
- **Interactive Ribbon & Mega Menu**: Multi-column navigation organized across major spirit categories:
  - **Single Malt Scotch**: Islay Peated, Speyside Sherry Cask, Highland Single Malts, Japanese & World Malts.
  - **Blended Scotch & Whisky**: Premium Blended Scotch, Bourbon & Tennessee, Irish Whiskey, Indian Single Malts.
  - **Vodka**: Super Premium Grain, Flavored & Infused, Craft Potato & Rye.
  - **Gin & Botanical Spirits**: London Dry, Contemporary Craft, Pink & Floral Gins.
  - **Rum & Sugarcane Spirits**: Aged Dark Rums, Spiced & Flavored, Caribbean White Rums.
  - **Tequila & Mezcal**: 100% Blue Agave Blanco, Reposado, Añejo, Artisanal Mezcal.
  - **Wine & Champagne**: Vintage Champagnes, Bordeaux & Burgundy Reds, Crisp Whites, Sparkling & Rosé.
  - **Beer & RTD**: Craft IPAs, Wheat Beers, Imported Lagers, Ready-to-Drink Cocktails.
- **Mobile Bottom Navigation**: 5-tab sticky bottom thumb bar (*Home, Categories, Search, Cart, Profile*) optimized for handheld devices.

---

### 3. 🏡 Homepage Experience
1. **Hero Search Banner**: Prominent search bar with instant keyword matching across distilleries, brands, vintages, and spirit categories.
2. **Promotional Carousel**: Highlighting exclusive discounts, tasting bundles, and new arrivals.
3. **Shop by Category**: Visual grid with photography and catalog count badges.
4. **Best Sellers Showcase**: Horizontal slider featuring top-rated bottles with ratings, bottle sizes, and one-click add to cart.
5. **Stacked Product Carousels**: Dedicated sections for:
   - *Limited Reserve & Rare Finds*
   - *Weekend Party Picks & Mixers*
   - *Cocktail Kits & Barware*
6. **Trust Pillars**: 100% Genuine Provenance, Temperature-Controlled Delivery, Secure Payments, and Dedicated Concierge.
7. **Interactive FAQ Accordion**: Clear answers regarding age verification, delivery zones, order tracking, and returns.

---

### 4. 🛒 Full E-Commerce Capabilities

- **Product Catalog (`/products`)**:
  - Filter sidebar by Category, Brand, Price Range, ABV %, Bottle Volume, and Rating.
  - Sorting by Popularity, Price (Low to High / High to Low), Customer Rating, and Newest.
  - Responsive product grid with zero layout shifts.

- **Product Details (`/product/:id`)**:
  - High-resolution product images.
  - Volume selection (e.g., 750ml, 1L, Miniature) with dynamic price calculation.
  - Tasting notes, distillery background, origin, ABV %, and serving recommendations.
  - Interactive customer reviews and ratings breakdown.
  - Related and recommended bottle suggestions.

- **Shopping Cart (`/cart`)**:
  - Real-time quantity adjustments and item removal.
  - Free delivery threshold progress meter.
  - Coupon code redemption engine (`LIQUOR10`, `FIRST50`, `WEEKEND`) with live discount recalculation.

- **Checkout Flow (`/checkout`)**:
  - Delivery address selection and new address creation form.
  - Payment methods: Demo Instant Pay, UPI / QR, Credit/Debit Cards, Net Banking, and Cash on Delivery.

- **Order Success (`/order-success/:orderId`)**:
  - Celebratory confetti animation.
  - Real-time order tracking stages (Confirmed → Packed → Out for Delivery).
  - Printable invoice/receipt preview.

- **Customer Profile (`/profile`)**:
  - Dashboard for managing orders, saved addresses, and profile details.

---

## 🏗️ Project Directory Structure

```
D:/liquor/
├── public/                 # Static assets and icons
├── src/
│   ├── assets/             # Brand logos and vector graphics
│   ├── components/
│   │   ├── checkout/       # QR codes and payment gateway components
│   │   ├── drawers/        # Slide-over cart drawer
│   │   ├── home/           # Homepage banners, sliders & showcases
│   │   ├── layout/         # Navbar, TopNotificationBar, Footer, MegaMenu
│   │   ├── modals/         # AgeVerification, Auth, Location, Support modals
│   │   └── product/        # ProductCard and catalog cards
│   ├── context/            # Auth, Cart, Location, Wishlist & UI state
│   ├── data/               # Product catalog, categories, offers & coupons
│   ├── pages/              # Route pages (Home, Products, Details, Cart, etc.)
│   ├── types/              # TypeScript interfaces and domain models
│   ├── utils/              # Image resolution and helpers
│   ├── api.ts              # API layer and endpoints
│   ├── App.tsx             # Route declarations and context providers
│   ├── main.tsx            # Application entrypoint
│   └── index.css           # Tailwind styling directives
├── .env                    # Environment variables configuration
├── .gitignore              # Git ignored patterns
├── package.json            # Dependencies and npm scripts
├── tailwind.config.js      # Tailwind design system configuration
└── vite.config.ts          # Vite build configuration
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
| **Animation & Effects** | Canvas Confetti |
| **Build Tool** | Vite 8.2 |
| **Linter** | Oxlint |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0 or later recommended)
- **npm** (v9.0 or later)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/nainatechnologies/liquor-mart-frontend.git

# 2. Navigate to the project directory
cd liquor-mart-frontend

# 3. Install dependencies
npm install
```

### Running Locally

```bash
# Start Vite development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

```bash
# Type check and build optimized static assets
npm run build

# Preview production build locally
npm run preview
```

---

## 💡 Configuration & Customization

- **Catalog & Products**: Update spirit offerings, prices, bottle sizes, and tasting notes in [`src/data/products.ts`](src/data/products.ts).
- **Categories & Distilleries**: Manage spirit categories and brands in [`src/data/categories.ts`](src/data/categories.ts).
- **Coupons & Banners**: Update active promotions and discount codes in [`src/data/offers.ts`](src/data/offers.ts).
- **Styling & Theme**: Adjust luxury color palette (wine, amber, slate) in [`tailwind.config.js`](tailwind.config.js) and [`src/index.css`](src/index.css).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
