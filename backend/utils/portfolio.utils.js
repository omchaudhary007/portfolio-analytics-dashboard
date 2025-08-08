/**
 * Calculates allocation breakdown (e.g., by sector or market cap)
 *
 * Steps:
 * 1) Group holdings by the provided key and sum their current value
 * 2) Compute total portfolio value from grouped sums
 * 3) Produce per-group breakdown with absolute value and percentage of total
 *
 * @param {Array} data - Array of portfolio holding objects
 * @param {string} key - The grouping key (e.g., "sector", "marketCap")
 * @returns {Object} - An object with total value and percentage per group
 */
export const getAllocationByKey = (data, key) => {
  if (!Array.isArray(data) || data.length === 0) return {};

  const grouped = {};
  let total = 0;

  for (const item of data) {
    if (!item || typeof item !== 'object') continue;
    
    const groupKey = item[key];
    const value = parseFloat(item.value);

    if (!groupKey || isNaN(value) || value <= 0) continue;

    if (!grouped[groupKey]) {
      grouped[groupKey] = 0;
    }

    grouped[groupKey] += value;
    total += value;
  }

  if (total === 0) return {};

  const result = {};
  for (const group in grouped) {
    const value = grouped[group];
    result[group] = {
      value: Math.round(value),
      percentage: parseFloat(((value / total) * 100).toFixed(2)),
    };
  }

  return result;
};

/**
 * Calculates percentage return between two values
 * Formula: ((current - previous) / previous) * 100
 * Guards: returns 0 when inputs are invalid or previous is 0 to avoid Infinity
 *
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} - Percentage return
 */
export const calculateReturn = (current, previous) => {
  if (typeof current !== 'number' || typeof previous !== 'number') return 0;
  if (previous === 0) return 0;
  return parseFloat(((current - previous) / previous * 100).toFixed(2));
};

/**
 * Finds data point closest to target date
 * Linear scan to minimize |target - point.date|
 *
 * @param {Array} timeline - Array of performance data points
 * @param {string} targetDate - Target date in YYYY-MM-DD format
 * @returns {Object|null} - Closest data point or null
 */
export const findClosestDataPoint = (timeline, targetDate) => {
  if (!Array.isArray(timeline) || timeline.length === 0) return null;
  
  const target = new Date(targetDate);
  let closest = null;
  let minDiff = Infinity;

  for (const point of timeline) {
    if (!point.date) continue;
    const pointDate = new Date(point.date);
    const diff = Math.abs(target - pointDate);
    
    if (diff < minDiff) {
      minDiff = diff;
      closest = point;
    }
  }

  return closest;
};

/**
 * Calculates performance returns for different time periods
 *
 * Methodology:
 * - Sort timeline by date, take latest as the reference point
 * - Compute target dates (1m/3m/1y ago) relative to latest
 * - For each target, use the closest available data point
 * - Compute returns for portfolio, nifty50, gold independently
 *
 * @param {Array} timeline - Array of performance data points
 * @returns {Object} - Returns for 1month, 3months, 1year
 */
export const calculatePerformanceReturns = (timeline) => {
  // Validate input
  if (!Array.isArray(timeline) || timeline.length === 0) {
    return {
      portfolio: { "1month": 0, "3months": 0, "1year": 0 },
      nifty50: { "1month": 0, "3months": 0, "1year": 0 },
      gold: { "1month": 0, "3months": 0, "1year": 0 }
    };
  }

  // Filter out data points without dates and sort by date
  const validTimeline = timeline
    .filter(point => point && point.date && typeof point.date === 'string')
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (validTimeline.length === 0) {
    return {
      portfolio: { "1month": 0, "3months": 0, "1year": 0 },
      nifty50: { "1month": 0, "3months": 0, "1year": 0 },
      gold: { "1month": 0, "3months": 0, "1year": 0 }
    };
  }

  const latest = validTimeline[validTimeline.length - 1];

  // Calculate target dates dynamically
  const latestDate = new Date(latest.date);
  const oneMonthAgo = new Date(latestDate);
  oneMonthAgo.setMonth(latestDate.getMonth() - 1);
  
  const threeMonthsAgo = new Date(latestDate);
  threeMonthsAgo.setMonth(latestDate.getMonth() - 3);
  
  const oneYearAgo = new Date(latestDate);
  oneYearAgo.setFullYear(latestDate.getFullYear() - 1);

  // Find closest data points to target dates
  const oneMonthAgoData = findClosestDataPoint(validTimeline, oneMonthAgo.toISOString().split('T')[0]);
  const threeMonthsAgoData = findClosestDataPoint(validTimeline, threeMonthsAgo.toISOString().split('T')[0]);
  const oneYearAgoData = findClosestDataPoint(validTimeline, oneYearAgo.toISOString().split('T')[0]);

  const calculateReturns = (current, previous) => {
    if (!previous || !current) return 0;
    return calculateReturn(current, previous);
  };

  return {
    portfolio: {
      "1month": calculateReturns(latest.portfolio, oneMonthAgoData?.portfolio),
      "3months": calculateReturns(latest.portfolio, threeMonthsAgoData?.portfolio),
      "1year": calculateReturns(latest.portfolio, oneYearAgoData?.portfolio)
    },
    nifty50: {
      "1month": calculateReturns(latest.nifty50, oneMonthAgoData?.nifty50),
      "3months": calculateReturns(latest.nifty50, threeMonthsAgoData?.nifty50),
      "1year": calculateReturns(latest.nifty50, oneYearAgoData?.nifty50)
    },
    gold: {
      "1month": calculateReturns(latest.gold, oneMonthAgoData?.gold),
      "3months": calculateReturns(latest.gold, threeMonthsAgoData?.gold),
      "1year": calculateReturns(latest.gold, oneYearAgoData?.gold)
    }
  };
};

/**
 * Transforms raw holding data to API format
 * @param {Array} rawData - Raw holding data from JSON
 * @returns {Array} - Transformed data in API format
 */
export const transformHoldingData = (rawData) => {
  if (!Array.isArray(rawData)) return [];

  return rawData
    .filter(item => item && typeof item === 'object')
    .map(item => {
      try {
        return {
          symbol: item["Symbol"] || item.symbol || '',
          name: item["Company Name"] || item.name || '',
          quantity: parseInt(item["Quantity"] || item.quantity || 0),
          avgPrice: parseFloat(item["Avg Price ₹"] || item.avgPrice || 0),
          currentPrice: parseFloat(item["Current Price (₹)"] || item.currentPrice || 0),
          sector: item["Sector"] || item.sector || '',
          marketCap: item["Market Cap"] || item.marketCap || '',
          value: parseFloat(item["Value ₹"] || item.value || 0),
          gainLoss: parseFloat(item["Gain/Loss (₹)"] || item.gainLoss || 0),
          gainLossPercent: parseFloat((item["Gain/Loss %"] || item.gainLossPercent || '0').replace('%', ''))
        };
      } catch (error) {
        console.error('Error transforming holding data:', error);
        return null;
      }
    })
    .filter(item => item !== null);
};
