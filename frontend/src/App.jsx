import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';
import PortfolioOverview from './components/dashboard/PortfolioOverview';
import AssetAllocation from './components/dashboard/AssetAllocation';
import PerformanceChart from './components/dashboard/PerformanceChart';
import HoldingsTable from './components/dashboard/HoldingsTable';
import TopPerformers from './components/dashboard/TopPerformers';
import LoadingSpinner from './components/ui/LoadingSpinner';
import portfolioAPI from './services/api';

function App() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await portfolioAPI.getAllPortfolioData();
        setPortfolioData(data);
      } catch (err) {
        setError('Failed to load portfolio data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading Portfolio Dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Portfolio Analytics</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600" />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {/* Portfolio Overview */}
          <PortfolioOverview 
            summary={portfolioData?.summary} 
            holdings={portfolioData?.holdings}
            isLoading={isLoading} 
          />

          {/* Asset Allocation */}
          <AssetAllocation 
            allocation={portfolioData?.allocation} 
            isLoading={isLoading} 
          />

          {/* Performance Chart */}
          <PerformanceChart 
            performance={portfolioData?.performance} 
            isLoading={isLoading} 
          />

          {/* Holdings Table */}
          <HoldingsTable 
            holdings={portfolioData?.holdings} 
            isLoading={isLoading} 
          />

          {/* Top Performers Section */}
          <TopPerformers 
            summary={portfolioData?.summary} 
            isLoading={isLoading} 
          />
        </motion.div>
      </main>
    </div>
  );
}

export default App;