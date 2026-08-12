export interface RawGroceryItem {
  'Item Fat Content': string;
  'Item Identifier': string;
  'Item Type': string;
  'Outlet Establishment Year': string | number;
  'Outlet Identifier': string;
  'Outlet Location Type': string;
  'Outlet Size': string;
  'Outlet Type': string;
  'Item Visibility': string | number;
  'Item Weight': string | number;
  'Sales': string | number;
  'Rating': string | number;
}

export interface GroceryItem {
  itemFatContent: 'Low Fat' | 'Regular';
  itemIdentifier: string;
  itemType: string;
  outletEstablishmentYear: number;
  outletIdentifier: string;
  outletLocationType: string;
  outletSize: string; // 'Small' | 'Medium' | 'High' | 'Unknown'
  outletType: string;
  itemVisibility: number;
  itemWeight: number | null;
  sales: number;
  rating: number;
}

export interface FilterState {
  fatContent: string[];
  itemType: string[];
  establishmentYear: number[];
  locationType: string[];
  outletSize: string[];
  outletType: string[];
}

export interface DashboardKPIs {
  totalSales: number;
  averageSales: number;
  numberOfItems: number;
  averageRating: number;
}

export type PageType = 'overview' | 'sales' | 'products' | 'outlets';
