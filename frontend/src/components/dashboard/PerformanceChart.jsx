import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';
import { formatCurrency, formatPercentage, formatDate } from '../../utils/formatters';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend
} from 'recharts';

const PerformanceChart = ({ performance, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />
    );
  }

  if (!performance) return null;

  const { timeline, returns } = performance;
  const latestData = timeline[timeline.length - 1];

  // Calculate performance metrics
  const portfolioReturns = returns?.portfolio || {};
  const niftyReturns = returns?.nifty50 || {};
  const goldReturns = returns?.gold || {};

  const getReturnColor = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getReturnIcon = (value) => {
    if (value > 0) return TrendingUp;
    if (value < 0) return TrendingDown;
    return Activity;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Performance Analysis</h2>
        <p className="text-gray-600">Portfolio performance vs benchmarks over time</p>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Portfolio Returns */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Portfolio</h3>
              <p className="text-sm text-gray-500">Your investments</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">1 Month</span>
              <span className={`text-sm font-medium ${getReturnColor(portfolioReturns['1month'])}`}>
                {formatPercentage(portfolioReturns['1month'] || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">3 Months</span>
              <span className={`text-sm font-medium ${getReturnColor(portfolioReturns['3months'])}`}>
                {formatPercentage(portfolioReturns['3months'] || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">1 Year</span>
              <span className={`text-sm font-medium ${getReturnColor(portfolioReturns['1year'])}`}>
                {formatPercentage(portfolioReturns['1year'] || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Nifty 50 Returns */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <BarChart3 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Nifty 50</h3>
              <p className="text-sm text-gray-500">Market benchmark</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">1 Month</span>
              <span className={`text-sm font-medium ${getReturnColor(niftyReturns['1month'])}`}>
                {formatPercentage(niftyReturns['1month'] || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">3 Months</span>
              <span className={`text-sm font-medium ${getReturnColor(niftyReturns['3months'])}`}>
                {formatPercentage(niftyReturns['3months'] || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">1 Year</span>
              <span className={`text-sm font-medium ${getReturnColor(niftyReturns['1year'])}`}>
                {formatPercentage(niftyReturns['1year'] || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Gold Returns */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50">
              <Activity className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Gold</h3>
              <p className="text-sm text-gray-500">Safe haven asset</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">1 Month</span>
              <span className={`text-sm font-medium ${getReturnColor(goldReturns['1month'])}`}>
                {formatPercentage(goldReturns['1month'] || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">3 Months</span>
              <span className={`text-sm font-medium ${getReturnColor(goldReturns['3months'])}`}>
                {formatPercentage(goldReturns['3months'] || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">1 Year</span>
              <span className={`text-sm font-medium ${getReturnColor(goldReturns['1year'])}`}>
                {formatPercentage(goldReturns['1year'] || 0)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Timeline Chart (Recharts) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Performance Timeline</h3>
            <p className="text-sm text-gray-500">Portfolio vs Nifty 50 vs Gold</p>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeline} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(d) => formatDate(d)} minTickGap={24} />
              <YAxis tickFormatter={(v) => formatCurrency(v)} width={80} />
              <RechartsTooltip
                formatter={(value, name) => [formatCurrency(value), name]}
                labelFormatter={(label) => formatDate(label)}
              />
              <RechartsLegend />
              <Line type="monotone" dataKey="portfolio" name="Portfolio" stroke="#2563EB" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="nifty50" name="Nifty 50" stroke="#16A34A" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="gold" name="Gold" stroke="#F59E0B" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Performance Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Performance Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-900">Portfolio vs Nifty</p>
            <p className={`text-gray-600 ${getReturnColor(portfolioReturns['1year'] - niftyReturns['1year'])}`}>
              {formatPercentage(portfolioReturns['1year'] - niftyReturns['1year'], true)} vs benchmark
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Best Period</p>
            <p className="text-gray-600">
              {portfolioReturns['1year'] > portfolioReturns['3months'] ? '1 Year' : '3 Months'}
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Current Value</p>
            <p className="text-gray-600">{formatCurrency(latestData?.portfolio || 0)}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PerformanceChart;
