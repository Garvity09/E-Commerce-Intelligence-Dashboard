# QuickCommerce Intelligence Dashboard

**QuickCommerce Intelligence** is a production-quality, high-performance internal business intelligence (BI) dashboard built from scratch. It aggregates, filters, and visualizes operations and sales data from a quick-commerce grocery dataset.

> **Disclaimer**: This dashboard is an independent portfolio project. It uses a supplied BlinkIT grocery dataset for analytical purposes and is not affiliated with, endorsed by, or an official product of BlinkIT, Zepto, or any other quick-commerce service.

---

## 🎯 Project Objective
The goal is to deliver a premium internal analytics application designed for operations managers, store managers, and executives. The tool provides actionable insights into sales distributions, category rankings, outlet performance, and customer review scores, supporting data-driven retail decision-making.

---

## 📊 Dataset Summary & Validation
The application loads and parses the source dataset (`/data/blinkit-grocery-data.csv`) dynamically at runtime.

### Data Columns
- **Item Identifier**: Unique ID for each product.
- **Item Fat Content**: Fat levels (normalized to `Low Fat` and `Regular`).
- **Item Type**: Product category (e.g., Dairy, Fruits and Vegetables, Snack Foods).
- **Item Visibility**: Percentage of total display area allocated in store.
- **Item Weight**: Product weight (includes missing values, handled gracefully).
- **Sales**: Transaction revenue in INR (₹).
- **Rating**: Customer rating score (1-5 scale).
- **Outlet Identifier**: Unique store ID (e.g., `OUT049`).
- **Outlet Establishment Year**: Year the outlet opened.
- **Outlet Size**: Store size class (`Small`, `Medium`, `High`).
- **Outlet Location Type**: Geographical tier (`Tier 1`, `Tier 2`, `Tier 3`).
- **Outlet Type**: Store format (e.g., `Supermarket Type1`, `Grocery Store`).

### KPI Reference Validation Values
Calculated dynamically from the 8,523 rows in the CSV:
- **Total Sales**: ₹1,201,681.49
- **Average Sales**: ₹140.99
- **Number of Items**: 8,523
- **Average Rating**: 3.97

---

## 🏗️ Architecture & Component Design
The project is built around a single-page reactive architecture with custom state-based client routing, keeping filter and dataset states aligned globally.

```
src/
├── types/
│   └── index.ts               # TypeScript types for items, KPIs, and filter states
├── lib/
│   └── dataProcessor.ts       # Normalization, calculations, and grouping logic
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx        # Responsive vertical navigation bar
│   │   └── Header.tsx         # Section title and toggles with background asset
│   ├── kpi/
│   │   └── KPICard.tsx        # Easing-based numbers counter animation card
│   ├── filters/
│   │   ├── FilterPanel.tsx    # Dropdown accordions with multi-select checkboxes
│   │   └── FilterChips.tsx    # Active filter indicators with quick-dismiss
│   ├── charts/
│   │   ├── chartConstants.ts  # Standardized theme colors and formatting utilities
│   │   ├── FatContentDonut.tsx
│   │   ├── ItemTypeBar.tsx
│   │   ├── EstablishmentTrendLine.tsx
│   │   ├── OutletSizePie.tsx
│   │   ├── OutletLocationBar.tsx
│   │   ├── OutletTypeBar.tsx
│   │   └── ProductScatterPlot.tsx
│   └── tables/
│       ├── ItemTypeTable.tsx  # Sortable table of categories
│       └── OutletTable.tsx    # Sortable store performance comparative list
├── pages/
│   ├── Overview.tsx           # Executive Overview
│   ├── Sales.tsx              # Revenue Analytics
│   ├── Products.tsx           # Product listings & visibility analysis
│   └── Outlets.tsx            # Outlet size & location performance
├── App.tsx                    # Main app state coordinator & parsing router
└── main.tsx                   # React root entry point
```

### Key Engineering Patterns
1. **Dynamic Filter Extraction**: Options are populated dynamically at runtime based on unique values present in the parsed CSV.
2. **Unified Data Utility Layer**: Filtering, grouping, and metrics calculations are isolated in `dataProcessor.ts` to keep page components clean.
3. **State Preservation**: Global filter states are kept in `App.tsx` and remain persistent as the user navigates between views.
4. **Performance Memoization**: Dynamic aggregates are memoized (`useMemo`) to keep the dashboard snappy and re-render only when filters change.
5. **No Router Overhead**: Custom navigation synchronized with the browser history hash (`popstate` listener) prevents state resets.

---

## 🎨 Visual Identity & Style Direction
Inspired by modern business intelligence interfaces:
- **Color Palette**: Dark charcoal slate backdrop (`#0f1c11`), forest green (`#1e3f20`), olive green (`#4c6a40`), and brand highlights of vibrant lime green (`#b4df4c`) and warm yellow (`#f8df30`) derived from the asset.
- **Typography**: Google Fonts **Outfit** for headlines and **Plus Jakarta Sans** for body text and numeric readouts.
- **Asset Integration**: The supplied `kpi-background.png` visual asset is used as a constrained design element in the header section, masked with a solid slate gradient for legible, professional contrast.
- **Animations**: KPI numbers count up with a smooth `ease-Out` transition on initial load.

---

## 🛠️ Local Setup & Run

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   cd quickcommerce-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server locally:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. Verify typescript compilation and build production bundle:
   ```bash
   npm run build
   ```

---

## 🚀 Deployment to Vercel
This application is fully static and client-side, making it highly compatible with modern hosting platforms.

To deploy via Vercel CLI:
1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Run deployment:
   ```bash
   vercel
   ```
3. Follow the CLI prompt directions. Choose defaults and set the project directory as the root folder. Vercel will automatically detect Vite and configure the build settings (`npm run build` and output folder `dist`).

---

## ⚠️ Limitations & Future Roadmap
- **Client-Side CSV Parsing**: The entire 8,500+ records dataset is parsed and grouped in the browser. For databases larger than 100k records, processing should be moved to a backend REST API or OLAP database (e.g., ClickHouse).
- **Static Dataset**: Currently loads a local file. Future updates can bind this loader to live S3 API endpoints or database connections.
