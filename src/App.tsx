import { useEffect, useState, useMemo } from 'react';
import Papa from 'papaparse';
import { Loader2, AlertCircle, Filter } from 'lucide-react';

// Types & Utilities
import type { RawGroceryItem, GroceryItem, FilterState, PageType } from './types';
import { normalizeData, calculateKPIs } from './lib/dataProcessor';

// Layout & Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import FilterPanel from './components/filters/FilterPanel';
import FilterChips from './components/filters/FilterChips';

// Pages
import Overview from './pages/Overview';
import Sales from './pages/Sales';
import Products from './pages/Products';
import Outlets from './pages/Outlets';

export default function App() {
  // Navigation & UI States
  const [activePage, setActivePage] = useState<PageType>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Data Loading States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataset, setDataset] = useState<GroceryItem[]>([]);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    fatContent: [],
    itemType: [],
    establishmentYear: [],
    locationType: [],
    outletSize: [],
    outletType: [],
  });

  // Load and Parse CSV Data
  useEffect(() => {
    setIsLoading(true);
    Papa.parse<RawGroceryItem>('/data/blinkit-grocery-data.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        try {
          if (results.errors.length > 0 && results.data.length === 0) {
            throw new Error(results.errors[0].message);
          }
          const cleaned = normalizeData(results.data);
          setDataset(cleaned);
          setIsLoading(false);
        } catch (err: any) {
          console.error(err);
          setError(err.message || 'Failed to process dataset columns correctly.');
          setIsLoading(false);
        }
      },
      error: (err) => {
        console.error(err);
        setError('Failed to fetch the BlinkIT dataset from public path. Please verify that public/data/blinkit-grocery-data.csv exists.');
        setIsLoading(false);
      }
    });
  }, []);

  // Sync state navigation with browser history
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '') || 'overview';
      if (['overview', 'sales', 'products', 'outlets'].includes(hash)) {
        setActivePage(hash as PageType);
      }
    };

    window.addEventListener('popstate', handlePopState);
    // Set initial route on mount
    handlePopState();

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigate function that updates URL hash and browser history
  const navigateTo = (page: PageType) => {
    setActivePage(page);
    window.history.pushState({ page }, '', `#${page}`);
  };

  // Derive unique filter values from the full dataset dynamically
  const uniqueValues = useMemo(() => {
    if (dataset.length === 0) {
      return {
        fatContent: [],
        itemType: [],
        establishmentYear: [],
        locationType: [],
        outletSize: [],
        outletType: [],
      };
    }

    const fats = new Set<string>();
    const types = new Set<string>();
    const years = new Set<number>();
    const locations = new Set<string>();
    const sizes = new Set<string>();
    const outletTypes = new Set<string>();

    dataset.forEach(item => {
      if (item.itemFatContent) fats.add(item.itemFatContent);
      if (item.itemType) types.add(item.itemType);
      if (item.outletEstablishmentYear) years.add(item.outletEstablishmentYear);
      if (item.outletLocationType) locations.add(item.outletLocationType);
      if (item.outletSize) sizes.add(item.outletSize);
      if (item.outletType) outletTypes.add(item.outletType);
    });

    return {
      fatContent: Array.from(fats).sort(),
      itemType: Array.from(types).sort(),
      establishmentYear: Array.from(years).sort((a, b) => a - b),
      locationType: Array.from(locations).sort(),
      outletSize: Array.from(sizes).sort(),
      outletType: Array.from(outletTypes).sort(),
    };
  }, [dataset]);

  // Apply filters to dataset
  const filteredData = useMemo(() => {
    return dataset.filter(item => {
      if (filters.fatContent.length > 0 && !filters.fatContent.includes(item.itemFatContent)) return false;
      if (filters.itemType.length > 0 && !filters.itemType.includes(item.itemType)) return false;
      if (filters.establishmentYear.length > 0 && !filters.establishmentYear.includes(item.outletEstablishmentYear)) return false;
      if (filters.locationType.length > 0 && !filters.locationType.includes(item.outletLocationType)) return false;
      if (filters.outletSize.length > 0 && !filters.outletSize.includes(item.outletSize)) return false;
      if (filters.outletType.length > 0 && !filters.outletType.includes(item.outletType)) return false;
      return true;
    });
  }, [dataset, filters]);

  // Calculate filtered KPIs
  const kpis = useMemo(() => {
    return calculateKPIs(filteredData);
  }, [filteredData]);

  // Get Page Configs
  const pageDetails = useMemo(() => {
    switch (activePage) {
      case 'overview':
        return {
          title: 'Executive Overview',
          subtitle: 'Aggregate operational metrics, total revenue, average order value, sales trends, and customer ratings.'
        };
      case 'sales':
        return {
          title: 'Sales Analytics',
          subtitle: 'Analyze channel performance, revenue trends, regional contribution, and fat content distribution.'
        };
      case 'products':
        return {
          title: 'Product Analytics',
          subtitle: 'Evaluate product performance, listing volumes, customer ratings, and visibility dynamics.'
        };
      case 'outlets':
        return {
          title: 'Outlet Analytics',
          subtitle: 'Compare revenue, volume, ratings, and visibility across formats, locations, and store vintages.'
        };
      default:
        return {
          title: 'Executive Overview',
          subtitle: 'Aggregate operational metrics and business performance.'
        };
    }
  }, [activePage]);

  // Render Page Content
  const renderPage = () => {
    switch (activePage) {
      case 'overview':
        return <Overview filteredData={filteredData} kpis={kpis} />;
      case 'sales':
        return <Sales filteredData={filteredData} kpis={kpis} />;
      case 'products':
        return <Products filteredData={filteredData} kpis={kpis} />;
      case 'outlets':
        return <Outlets filteredData={filteredData} kpis={kpis} />;
      default:
        return <Overview filteredData={filteredData} kpis={kpis} />;
    }
  };

  // Render Loading Page
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <div className="inline-flex p-4 bg-brand-forest/5 rounded-2xl text-brand-forest animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin text-brand-forest" />
          </div>
          <h2 className="font-display font-extrabold text-lg text-slate-800">
            Loading QuickCommerce Intelligence...
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Parsing BlinkIT dataset and aggregating operational statistics. This will only take a moment.
          </p>
        </div>
      </div>
    );
  }

  // Render Error Page
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white border border-rose-100 rounded-3xl p-8 max-w-md text-center shadow-sm space-y-4">
          <div className="inline-flex p-3.5 bg-rose-50 text-rose-600 rounded-2xl">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="font-display font-extrabold text-lg text-slate-800">
            CSV Loading Error
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {error}
          </p>
          <div className="pt-2">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-brand-forest text-white text-xs font-bold hover:bg-brand-forest/90 focus:outline-none transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        onNavigate={navigateTo}
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col min-w-0 p-4 lg:p-6">
        {/* Responsive Header */}
        <Header 
          title={pageDetails.title} 
          subtitle={pageDetails.subtitle}
        >
          {/* Header Action: Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold border font-display transition-all duration-200 focus:outline-none shadow-xs
              ${showFilters 
                ? 'bg-brand-lime text-brand-dark border-brand-lime hover:bg-brand-lime/90' 
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }
            `}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </Header>

        {/* Filter Chips row (at top of page content) */}
        <FilterChips filters={filters} onChange={setFilters} />

        {/* Multi-column layout: Page content + Filter panel */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Main page details */}
          <div className="flex-1 min-w-0 w-full">
            {renderPage()}
          </div>

          {/* Right Floating Sidebar Filter Panel */}
          {showFilters && (
            <div className="w-full lg:w-72 lg:sticky lg:top-6 flex-shrink-0">
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                uniqueValues={uniqueValues}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
