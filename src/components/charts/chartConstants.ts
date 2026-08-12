// Premium Palette derived from the provided asset
export const CHART_COLORS = {
  forest: '#1e3f20', // deep forest green
  olive: '#4c6a40',  // olive green
  lime: '#b4df4c',   // lime yellow
  yellow: '#f8df30', // warm yellow
  dark: '#0f1c11',   // brand dark
  muted: '#6b7c6c',  // brand muted
  lightGray: '#f8fafc',
  borderGray: '#e2e8f0',
  gridLines: '#f1f5f9',
  
  // Array for categorical charts
  categorical: [
    '#1e3f20', // forest
    '#4c6a40', // olive
    '#b4df4c', // lime
    '#f8df30', // yellow
    '#8da672', // soft green
    '#ffd43b', // golden yellow
    '#2d5a27', // medium forest
    '#a2b588', // sage
  ]
};

// Common formatter for currency (Indian compact system)
export const formatCurrency = (value: number) => {
  const absVal = Math.abs(value);
  if (absVal >= 10_000_000) {
    return `₹${(value / 10_000_000).toFixed(2)}Cr`;
  }
  if (absVal >= 100_000) {
    return `₹${(value / 100_000).toFixed(2)}L`;
  }
  if (absVal >= 1_000) {
    return `₹${(value / 1_000).toFixed(1)}K`;
  }
  return `₹${Number(value.toFixed(2))}`;
};

// Common formatter for counts
export const formatCount = (value: number) => {
  return value.toLocaleString();
};

// Common tooltip styling properties for Recharts to ensure premium appearance
export const tooltipContentStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
  padding: '10px 14px',
};
