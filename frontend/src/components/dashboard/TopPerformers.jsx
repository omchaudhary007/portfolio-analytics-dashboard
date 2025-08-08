import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Award, AlertTriangle, Target, BarChart3 } from 'lucide-react';
import { formatCurrency, formatPercentage, getPerformanceColor } from '../../utils/formatters';

const TopPerformers = ({ summary, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Top Performers & Insights</h2>
        <p className="text-gray-600">Best and worst performing stocks with key insights</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Best Performing Stock */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Best Performer</h3>
              <p className="text-sm text-gray-500">Top performing stock</p>
            </div>
          </div>
          
          {summary.topPerformer ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{summary.topPerformer.symbol}</p>
                  <p className="text-xs text-gray-500">{summary.topPerformer.name}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${getPerformanceColor(summary.topPerformer.gainPercent)}`}>
                    {formatPercentage(summary.topPerformer.gainPercent)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">
                  Outstanding performance
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No data available</p>
            </div>
          )}
        </motion.div>

        {/* Worst Performing Stock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Worst Performer</h3>
              <p className="text-sm text-gray-500">Lowest performing stock</p>
            </div>
          </div>
          
          {summary.worstPerformer ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{summary.worstPerformer.symbol}</p>
                  <p className="text-xs text-gray-500">{summary.worstPerformer.name}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${getPerformanceColor(summary.worstPerformer.gainPercent)}`}>
                    {formatPercentage(summary.worstPerformer.gainPercent)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600 font-medium">
                  Needs attention
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No data available</p>
            </div>
          )}
        </motion.div>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Key Insights</h3>
              <p className="text-sm text-gray-500">Portfolio analysis</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Diversification Score</span>
              </div>
              <span className="text-lg font-bold text-blue-600">
                {summary.diversificationScore}/10
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">Risk Level</span>
              </div>
              <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                summary.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                summary.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {summary.riskLevel}
              </span>
            </div>
            
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {summary.riskLevel === 'High' ? 'Consider rebalancing your portfolio to reduce risk.' :
                 summary.riskLevel === 'Moderate' ? 'Your portfolio shows balanced risk-return profile.' :
                 'Your portfolio demonstrates conservative risk management.'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TopPerformers;
