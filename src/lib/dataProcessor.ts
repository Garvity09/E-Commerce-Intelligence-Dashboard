import type { RawGroceryItem, GroceryItem, DashboardKPIs } from '../types';

/**
 * Normalizes and cleans the raw data from the CSV.
 */
export function normalizeData(rawItems: RawGroceryItem[]): GroceryItem[] {
  return rawItems
    .filter(row => row['Item Identifier']) // skip empty lines or incomplete data
    .map(row => {
      // Normalization of Fat Content
      const rawFat = (row['Item Fat Content'] || '').trim().toLowerCase();
      let fatContent: 'Low Fat' | 'Regular' = 'Low Fat';
      if (rawFat === 'reg' || rawFat === 'regular') {
        fatContent = 'Regular';
      } else {
        fatContent = 'Low Fat'; // Treat 'lf', 'low fat', and other variations as 'Low Fat'
      }

      // Safe number parsing
      const sales = parseFloat(String(row['Sales'])) || 0;
      const rating = parseFloat(String(row['Rating'])) || 0;
      const itemVisibility = parseFloat(String(row['Item Visibility'])) || 0;
      const outletEstablishmentYear = parseInt(String(row['Outlet Establishment Year']), 10) || 0;

      // Handle item weight (can be blank)
      const rawWeight = String(row['Item Weight']).trim();
      const itemWeight = rawWeight === '' ? null : (parseFloat(rawWeight) || null);

      // Preserve all other raw values, trim spaces
      const itemIdentifier = (row['Item Identifier'] || '').trim();
      const itemType = (row['Item Type'] || '').trim();
      const outletIdentifier = (row['Outlet Identifier'] || '').trim();
      const outletLocationType = (row['Outlet Location Type'] || '').trim();
      const outletSize = (row['Outlet Size'] || 'Unknown').trim();
      const outletType = (row['Outlet Type'] || '').trim();

      return {
        itemFatContent: fatContent,
        itemIdentifier,
        itemType,
        outletEstablishmentYear,
        outletIdentifier,
        outletLocationType,
        outletSize: outletSize || 'Unknown',
        outletType,
        itemVisibility,
        itemWeight,
        sales,
        rating
      };
    });
}

/**
 * Calculate KPI summaries.
 */
export function calculateKPIs(items: GroceryItem[]): DashboardKPIs {
  const numberOfItems = items.length;
  if (numberOfItems === 0) {
    return { totalSales: 0, averageSales: 0, numberOfItems: 0, averageRating: 0 };
  }

  let totalSales = 0;
  let totalRating = 0;
  let ratingCount = 0;

  for (let i = 0; i < numberOfItems; i++) {
    totalSales += items[i].sales;
    if (items[i].rating > 0) {
      totalRating += items[i].rating;
      ratingCount++;
    }
  }

  const averageSales = totalSales / numberOfItems;
  const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;

  return {
    totalSales,
    averageSales,
    numberOfItems,
    averageRating
  };
}

/**
 * Total Sales by Fat Content.
 */
export function getSalesByFatContent(items: GroceryItem[]) {
  const groups: Record<string, { sales: number; count: number }> = {};
  
  items.forEach(item => {
    const key = item.itemFatContent;
    if (!groups[key]) {
      groups[key] = { sales: 0, count: 0 };
    }
    groups[key].sales += item.sales;
    groups[key].count += 1;
  });

  return Object.entries(groups).map(([name, data]) => ({
    name,
    value: parseFloat(data.sales.toFixed(2)),
    count: data.count
  }));
}

/**
 * Total Sales by Item Type, sorted descending.
 */
export function getSalesByItemType(items: GroceryItem[]) {
  const groups: Record<string, { sales: number; count: number; ratingSum: number; ratingCount: number }> = {};

  items.forEach(item => {
    const key = item.itemType;
    if (!groups[key]) {
      groups[key] = { sales: 0, count: 0, ratingSum: 0, ratingCount: 0 };
    }
    groups[key].sales += item.sales;
    groups[key].count += 1;
    if (item.rating > 0) {
      groups[key].ratingSum += item.rating;
      groups[key].ratingCount += 1;
    }
  });

  return Object.entries(groups)
    .map(([name, data]) => ({
      name,
      sales: parseFloat(data.sales.toFixed(2)),
      count: data.count,
      avgRating: data.ratingCount > 0 ? parseFloat((data.ratingSum / data.ratingCount).toFixed(2)) : 0
    }))
    .sort((a, b) => b.sales - a.sales);
}

/**
 * Total Sales by Outlet Establishment Year, sorted ascending.
 */
export function getSalesByOutletYear(items: GroceryItem[]) {
  const groups: Record<number, { sales: number; count: number }> = {};

  items.forEach(item => {
    const key = item.outletEstablishmentYear;
    if (!groups[key]) {
      groups[key] = { sales: 0, count: 0 };
    }
    groups[key].sales += item.sales;
    groups[key].count += 1;
  });

  return Object.entries(groups)
    .map(([year, data]) => ({
      year: parseInt(year, 10),
      sales: parseFloat(data.sales.toFixed(2)),
      count: data.count
    }))
    .sort((a, b) => a.year - b.year);
}

/**
 * Total Sales by Outlet Size.
 */
export function getSalesByOutletSize(items: GroceryItem[]) {
  const groups: Record<string, { sales: number; count: number }> = {};

  items.forEach(item => {
    const key = item.outletSize;
    if (!groups[key]) {
      groups[key] = { sales: 0, count: 0 };
    }
    groups[key].sales += item.sales;
    groups[key].count += 1;
  });

  // Reorder to High, Medium, Small, Unknown for clean visualization
  const order = ['High', 'Medium', 'Small', 'Unknown'];
  return Object.entries(groups)
    .map(([name, data]) => ({
      name,
      value: parseFloat(data.sales.toFixed(2)),
      count: data.count
    }))
    .sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
}

/**
 * Total Sales by Outlet Location Type.
 */
export function getSalesByOutletLocation(items: GroceryItem[]) {
  const groups: Record<string, { sales: number; count: number }> = {};

  items.forEach(item => {
    const key = item.outletLocationType;
    if (!groups[key]) {
      groups[key] = { sales: 0, count: 0 };
    }
    groups[key].sales += item.sales;
    groups[key].count += 1;
  });

  return Object.entries(groups)
    .map(([name, data]) => ({
      name,
      sales: parseFloat(data.sales.toFixed(2)),
      count: data.count
    }))
    .sort((a, b) => a.name.localeCompare(b.name)); // Tier 1, Tier 2, Tier 3
}

/**
 * Total Sales by Outlet Type.
 */
export function getSalesByOutletType(items: GroceryItem[]) {
  const groups: Record<string, { sales: number; count: number }> = {};

  items.forEach(item => {
    const key = item.outletType;
    if (!groups[key]) {
      groups[key] = { sales: 0, count: 0 };
    }
    groups[key].sales += item.sales;
    groups[key].count += 1;
  });

  return Object.entries(groups)
    .map(([name, data]) => ({
      name,
      sales: parseFloat(data.sales.toFixed(2)),
      count: data.count
    }))
    .sort((a, b) => b.sales - a.sales);
}

/**
 * Filtered dataset sample for Sales vs Visibility scatter plot.
 * We sample the data to avoid performance degradation with 8000+ SVG nodes.
 */
export function getSalesVsVisibilitySample(items: GroceryItem[], sampleSize = 1000) {
  if (items.length <= sampleSize) {
    return items.map(item => ({
      sales: parseFloat(item.sales.toFixed(2)),
      visibility: parseFloat((item.itemVisibility * 100).toFixed(2)), // convert visibility to percentage
      name: item.itemIdentifier,
      type: item.itemType
    }));
  }

  // Systematic sampling to cover the entire dataset evenly
  const step = Math.floor(items.length / sampleSize);
  const result = [];
  for (let i = 0; i < items.length; i += step) {
    if (result.length >= sampleSize) break;
    const item = items[i];
    result.push({
      sales: parseFloat(item.sales.toFixed(2)),
      visibility: parseFloat((item.itemVisibility * 100).toFixed(2)),
      name: item.itemIdentifier,
      type: item.itemType
    });
  }
  return result;
}

/**
 * Compare outlets across multiple metrics.
 */
export interface OutletComparisonData {
  outletIdentifier: string;
  outletType: string;
  outletSize: string;
  outletLocationType: string;
  outletEstablishmentYear: number;
  totalSales: number;
  avgSales: number;
  itemCount: number;
  avgRating: number;
  avgVisibility: number;
}

export function getOutletComparison(items: GroceryItem[]): OutletComparisonData[] {
  const groups: Record<string, {
    type: string;
    size: string;
    location: string;
    year: number;
    salesSum: number;
    count: number;
    ratingSum: number;
    ratingCount: number;
    visibilitySum: number;
  }> = {};

  items.forEach(item => {
    const key = item.outletIdentifier;
    if (!groups[key]) {
      groups[key] = {
        type: item.outletType,
        size: item.outletSize,
        location: item.outletLocationType,
        year: item.outletEstablishmentYear,
        salesSum: 0,
        count: 0,
        ratingSum: 0,
        ratingCount: 0,
        visibilitySum: 0
      };
    }
    const g = groups[key];
    g.salesSum += item.sales;
    g.count += 1;
    g.visibilitySum += item.itemVisibility;
    if (item.rating > 0) {
      g.ratingSum += item.rating;
      g.ratingCount += 1;
    }
  });

  return Object.entries(groups).map(([outletIdentifier, g]) => ({
    outletIdentifier,
    outletType: g.type,
    outletSize: g.size,
    outletLocationType: g.location,
    outletEstablishmentYear: g.year,
    totalSales: parseFloat(g.salesSum.toFixed(2)),
    avgSales: parseFloat((g.salesSum / g.count).toFixed(2)),
    itemCount: g.count,
    avgRating: g.ratingCount > 0 ? parseFloat((g.ratingSum / g.ratingCount).toFixed(2)) : 0,
    avgVisibility: parseFloat(((g.visibilitySum / g.count) * 100).toFixed(2))
  })).sort((a, b) => b.totalSales - a.totalSales);
}
