import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Target, AlertTriangle, BarChart3 } from 'lucide-react';
import { formatCurrency, formatPercentage, getPerformanceColor, getPerformanceBgColor } from '../../utils/formatters';

const PortfolioOverview = ({ summary, holdings, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const cards = [
    {
      title: 'Total Portfolio Value',
      value: formatCurrency(summary.totalValue),
      change: formatPercentage(summary.totalGainLossPercent),
      icon: DollarSign,
      color: 'blue',
      delay: 0.1
    },
    {
      title: 'Total Gain/Loss',
      value: formatCurrency(summary.totalGainLoss),
      change: formatPercentage(summary.totalGainLossPercent),
      icon: summary.totalGainLoss >= 0 ? TrendingUp : TrendingDown,
      color: summary.totalGainLoss >= 0 ? 'green' : 'red',
      delay: 0.2
    },
    {
      title: 'Portfolio Performance',
      value: formatPercentage(summary.totalGainLossPercent),
      subtitle: 'Compared to initial investment',
      icon: BarChart3,
      color: summary.totalGainLossPercent >= 0 ? 'green' : 'red',
      delay: 0.3
    },
    {
      title: 'Number of Holdings',
      value: `${holdings?.length || 0}`,
      subtitle: 'Total stocks in portfolio',
      icon: PieChart,
      color: 'purple',
      delay: 0.4
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Portfolio Overview</h2>
        <p className="text-gray-600">Key metrics and performance summary</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: card.delay }}
            className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${colorClasses[card.color]}`}>
                <card.icon className="h-6 w-6" />
              </div>
              {card.change && (
                <span className={`text-sm font-medium ${getPerformanceColor(summary.totalGainLossPercent)}`}>
                  {card.change}
                </span>
              )}
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
              {card.subtitle && (
                <p className="text-xs text-gray-500">{card.subtitle}</p>
              )}
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/30 pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {/* Risk Level Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className={`rounded-xl p-4 ${getPerformanceBgColor(summary.totalGainLossPercent)}`}
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-gray-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Risk Assessment</p>
            <p className="text-sm text-gray-600">
              Your portfolio is classified as <span className="font-semibold">{summary.riskLevel}</span> risk 
              with a diversification score of <span className="font-semibold">{summary.diversificationScore}/10</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PortfolioOverview;
