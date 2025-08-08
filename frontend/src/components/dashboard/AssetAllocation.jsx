import { motion } from 'framer-motion';
import { PieChart as PieChartIcon, BarChart3, TrendingUp } from 'lucide-react';
import { formatCurrency, formatPercentage, getSectorColor, getMarketCapColor } from '../../utils/formatters';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

const AssetAllocation = ({ allocation, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!allocation) return null;

  const sectorData = allocation.bySector || {};
  const marketCapData = allocation.byMarketCap || {};

  // Convert to chart data format
  const sectorChartData = Object.entries(sectorData).map(([sector, data]) => ({
    name: sector,
    value: data.value,
    percentage: data.percentage,
    color: getSectorColor(sector)
  }));

  const marketCapChartData = Object.entries(marketCapData).map(([cap, data]) => ({
    name: cap,
    value: data.value,
    percentage: data.percentage,
    color: getMarketCapColor(cap)
  }));

  const totalSectorValue = Object.values(sectorData).reduce((sum, item) => sum + item.value, 0);
  const totalMarketCapValue = Object.values(marketCapData).reduce((sum, item) => sum + item.value, 0);

  // Custom tooltips to show exact values and percentages
  const renderPieTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) return null;
    const data = payload[0]?.payload;
    if (!data) return null;
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm text-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: data.color }} />
          <span className="font-medium text-gray-900">{data.name}</span>
        </div>
        <div className="text-gray-700">Value: {formatCurrency(data.value)}</div>
        <div className="text-gray-700">Share: {data.percentage.toFixed(2)}%</div>
      </div>
    );
  };

  const renderBarTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) return null;
    const data = payload[0]?.payload;
    if (!data) return null;
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm text-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: data.color }} />
          <span className="font-medium text-gray-900">{data.name} Cap</span>
        </div>
        <div className="text-gray-700">Value: {formatCurrency(data.value)}</div>
        <div className="text-gray-700">Share: {data.percentage.toFixed(2)}%</div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Asset Allocation</h2>
        <p className="text-gray-600">Portfolio distribution by sectors and market capitalization</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector Allocation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <PieChartIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sector Distribution</h3>
              <p className="text-sm text-gray-500">Total: {formatCurrency(totalSectorValue)}</p>
            </div>
          </div>

          {/* Pie Chart (Recharts) */}
          <div className="h-72 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <RechartsTooltip content={renderPieTooltip} />
                <RechartsLegend verticalAlign="bottom" height={36} />
                <Pie
                  data={sectorChartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={1}
                  isAnimationActive
                >
                  {sectorChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Market Cap Allocation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <BarChart3 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Market Cap Distribution</h3>
              <p className="text-sm text-gray-500">Total: {formatCurrency(totalMarketCapValue)}</p>
            </div>
          </div>

          {/* Bar Chart (Recharts) */}
          <div className="h-72 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marketCapChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} />
                <RechartsTooltip content={renderBarTooltip} />
                <Bar dataKey="percentage" radius={[6, 6, 0, 0]} isAnimationActive>
                  {marketCapChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{marketCapChartData.length}</p>
              <p className="text-xs text-gray-500">Categories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {marketCapChartData.find(item => item.name === 'Large')?.percentage?.toFixed(1) || 0}%
              </p>
              <p className="text-xs text-gray-500">Large Cap</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Allocation Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-900">Top Sector</p>
            <p className="text-gray-600">
              {sectorChartData.length > 0 ? sectorChartData[0].name : 'N/A'} 
              ({sectorChartData.length > 0 ? sectorChartData[0].percentage.toFixed(1) : 0}%)
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Diversification</p>
            <p className="text-gray-600">{sectorChartData.length} sectors</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Market Cap Focus</p>
            <p className="text-gray-600">
              {marketCapChartData.length > 0 ? marketCapChartData[0].name : 'N/A'} Cap
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AssetAllocation;
