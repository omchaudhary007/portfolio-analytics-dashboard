// Format currency to Indian Rupees
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format percentage with sign
export const formatPercentage = (value, showSign = true) => {
  if (value === null || value === undefined) return '0%';
  
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

// Format large numbers with K, M, B suffixes
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Get color based on performance
export const getPerformanceColor = (value) => {
  if (value > 0) return 'text-green-500';
  if (value < 0) return 'text-red-500';
  return 'text-gray-500';
};

// Get background color for performance
export const getPerformanceBgColor = (value) => {
  if (value > 0) return 'bg-green-50';
  if (value < 0) return 'bg-red-50';
  return 'bg-gray-50';
};

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Get sector color for charts
export const getSectorColor = (sector) => {
  const colors = {
    'Technology': '#3B82F6',
    'Banking': '#10B981',
    'Energy': '#F59E0B',
    'Healthcare': '#EF4444',
    'Consumer Goods': '#8B5CF6',
    'Financial Services': '#06B6D4',
    'Telecommunications': '#84CC16',
    'Automotive': '#F97316',
    'Consumer Discretionary': '#EC4899'
  };
  
  return colors[sector] || '#6B7280';
};

// Get market cap color
export const getMarketCapColor = (marketCap) => {
  const colors = {
    'Large': '#3B82F6',
    'Mid': '#10B981',
    'Small': '#F59E0B'
  };
  
  return colors[marketCap] || '#6B7280';
};
