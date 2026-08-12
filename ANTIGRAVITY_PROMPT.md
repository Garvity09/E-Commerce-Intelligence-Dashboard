# Antigravity Master Prompt — QuickCommerce Intelligence

Build a production-quality analytics dashboard from scratch using the supplied BlinkIT grocery dataset in `public/data/blinkit-grocery-data.csv` and the supplied visual asset in `public/assets/kpi-background.png`.

## Goal
Create a web analytics product inspired by quick-commerce operations dashboards such as Zepto/BlinkIT, but do NOT copy their proprietary UI or branding. Use the product name **QuickCommerce Intelligence**. The original dataset is the source of truth.

## Tech stack
- React + Vite
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React
- Papa Parse or a lightweight CSV parser
- No backend in v1
- Fully responsive for desktop, tablet and mobile

## Data source
Load the CSV from `/data/blinkit-grocery-data.csv` at runtime. Do not hard-code dashboard values.

Columns:
- Item Fat Content
- Item Identifier
- Item Type
- Outlet Establishment Year
- Outlet Identifier
- Outlet Location Type
- Outlet Size
- Outlet Type
- Item Visibility
- Item Weight
- Sales
- Rating

Important normalization:
- Treat `LF` and `Low Fat` as `Low Fat`.
- Treat `Reg` and `Regular` as `Regular`.
- Preserve all other raw values.
- Missing values must be handled gracefully and must not become fake values.

Reference KPI calculations:
- Total Sales = SUM(Sales)
- Average Sales = AVERAGE(Sales)
- Number of Items = row count
- Average Rating = AVERAGE(Rating)

Known dataset reference values for validation only:
- Total Sales ≈ 1,201,681.49
- Average Sales ≈ 140.99
- Number of Items = 8,523
- Average Rating ≈ 3.97

## Product structure
Create these routes/pages:
1. `/` — Executive Overview
2. `/sales` — Sales Analytics
3. `/products` — Product Analytics
4. `/outlets` — Outlet Analytics

## Executive Overview
Hero/header:
- Product name: QuickCommerce Intelligence
- Subtitle: “Business intelligence for quick-commerce operations”
- A subtle note: “Dataset-powered analytics — not live BlinkIT data.”

Use the supplied `kpi-background.png` in the KPI/hero region. Do not cover the whole screen with the background; use it as a restrained visual layer behind the KPI area.

KPI cards:
- Total Sales
- Average Sales
- Number of Items
- Average Rating

Main charts:
- Total Sales by Fat Content — donut chart
- Total Sales by Item Type — horizontal bar chart, sorted descending
- Total Sales by Outlet Establishment Year — line/area chart
- Total Sales by Outlet Size — donut or bar chart
- Total Sales by Outlet Location Type — bar chart
- Total Sales by Outlet Type — bar chart

## Sales Analytics page
Include:
- sales by item type
- sales by fat content
- sales by outlet type
- sales by outlet location
- sales trend by establishment year
- filter controls

Filters:
- Fat Content
- Item Type
- Outlet Establishment Year
- Outlet Location Type
- Outlet Size
- Outlet Type

All charts and KPI cards must respond to filters.

## Product Analytics page
Include:
- Top 10 item types by sales
- Item count by item type
- Average rating by item type
- Sales vs visibility scatter plot if useful
- sortable item-type table

## Outlet Analytics page
Include:
- outlet type performance
- outlet size performance
- location tier performance
- establishment year performance
- outlet comparison table

## UI / visual direction
Make it feel like a premium internal BI product, not a generic AI dashboard.

Design characteristics:
- clean light analytical canvas
- yellow / lime / deep green visual accents inspired by the supplied KPI background
- strong KPI hierarchy
- rounded but restrained cards
- compact professional charts
- subtle borders and shadows
- excellent spacing
- desktop-first but fully responsive
- accessible contrast
- polished hover/focus states
- no excessive gradients
- no glassmorphism
- no unnecessary giant text
- no cheesy startup illustrations

Suggested palette derived from the asset:
- warm yellow
- lime yellow
- olive green
- deep forest green
- off-white / neutral gray surfaces

Do not use official BlinkIT logos, proprietary illustrations, or copied layouts.

## Layout
Desktop:
- fixed/compact left sidebar
- top header with page title and global filters
- content area with KPI row and chart grid

Mobile:
- collapsible navigation
- KPI cards stack cleanly
- charts become single-column
- filter panel becomes a drawer or accordion

## Interaction requirements
- animated KPI numbers on initial load
- chart hover tooltips
- legend interaction where appropriate
- responsive chart resizing
- filter chips / clear-all action
- loading state while CSV loads
- friendly error state if CSV cannot load
- empty-state state after filters return no data
- preserve selected filters during navigation when practical

## Engineering requirements
- Use reusable components.
- Create a data-processing utility layer rather than putting calculations directly into components.
- Create typed data models/interfaces.
- Keep constants and configuration separate.
- Avoid duplicated chart configuration.
- Avoid hard-coded KPI values.
- Use memoization for filtered/aggregated datasets where useful.
- Do not add a backend or database in v1.
- Do not add authentication in v1.

## Suggested structure
src/
  components/
    layout/
    kpi/
    charts/
    filters/
    tables/
  pages/
    Overview.tsx
    Sales.tsx
    Products.tsx
    Outlets.tsx
  data/
  hooks/
  lib/
  types/
  App.tsx
  main.tsx

## README requirements
Create a professional README explaining:
- project objective
- dataset
- architecture
- KPIs
- visualizations
- tech stack
- local setup
- deployment to Vercel
- limitations

Be explicit that the dashboard uses a supplied BlinkIT grocery dataset for analytics and is an independent portfolio project, not an official BlinkIT product.

## Final quality bar
Before finishing:
1. Verify the KPI totals against the supplied data.
2. Verify `LF/Low Fat` and `Reg/Regular` normalization.
3. Verify filters update every dependent KPI and chart.
4. Verify there are no console errors.
5. Verify mobile responsiveness.
6. Verify all navigation routes work.
7. Use the provided KPI background asset.
8. Keep the interface polished enough for a portfolio/GitHub showcase.
