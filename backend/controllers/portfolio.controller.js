import { getAllocationByKey, calculatePerformanceReturns, transformHoldingData } from "../utils/portfolio.utils.js";
import { readJson } from "../utils/readJson.js";

/**
 * Controller to return complete portfolio holdings with proper data transformation
 */
export const getHolding = async (req, res) => {
  try {
    const rawData = await readJson("./data/holding.json");
    const transformedData = transformHoldingData(rawData);
    
    if (transformedData.length === 0) {
      return res.status(404).send({
        message: "No portfolio holdings found",
        data: []
      });
    }
    
    return res.status(200).send(transformedData);
  } catch (error) {
    return res.status(500).send({
      message: "Failed to fetch portfolio holdings",
      error: error.message
    });
  }
};

/**
 * Controller to return allocation data by sector and market cap
 */
export const getPortfolioAllocation = async (req, res) => {
  try {
    const rawData = await readJson("./data/holding.json");
    const transformedData = transformHoldingData(rawData);
    
    if (transformedData.length === 0) {
      return res.status(404).send({
        message: "No portfolio data available for allocation calculation",
        bySector: {},
        byMarketCap: {}
      });
    }
    
    const bySector = getAllocationByKey(transformedData, "sector");
    const byMarketCap = getAllocationByKey(transformedData, "marketCap");

    return res.status(200).send({
      bySector,
      byMarketCap,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Failed to calculate portfolio allocation",
      error: error.message
    });
  }
};

/**
 * Controller to return performance comparison data with historical timeline
 */
export const getPortfolioPerformance = async (req, res) => {
  try {
    const timeline = await readJson("./data/performance-timeline.json");
    const returns = calculatePerformanceReturns(timeline);

    return res.status(200).send({
      timeline,
      returns
    });
  } catch (error) {
    return res.status(500).send({
      message: "Failed to fetch performance data",
      error: error.message
    });
  }
};

/**
 * Controller to return portfolio summary with key metrics and insights
 */
export const getPortfolioSummary = async (req, res) => {
  try {
    const rawData = await readJson("./data/holding.json");
    const holdings = transformHoldingData(rawData);
    
    if (holdings.length === 0) {
      return res.status(404).send({
        message: "No portfolio data available for summary calculation",
        totalValue: 0,
        totalInvested: 0,
        totalGainLoss: 0,
        totalGainLossPercent: 0,
        topPerformer: null,
        worstPerformer: null,
        diversificationScore: 0,
        riskLevel: "Unknown"
      });
    }
    
    // Calculate total portfolio metrics
    // totalValue: Sum of current values across all holdings
    // totalInvested: Sum of (average buy price * quantity) across holdings
    // totalGainLoss: Aggregated absolute gain/loss across holdings
    // totalGainLossPercent: Portfolio-level return relative to invested capital
    const totalValue = holdings.reduce((sum, item) => sum + (item.value || 0), 0);
    const totalInvested = holdings.reduce((sum, item) => sum + ((item.avgPrice || 0) * (item.quantity || 0)), 0);
    const totalGainLoss = holdings.reduce((sum, item) => sum + (item.gainLoss || 0), 0);
    const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested * 100) : 0;

    // Find top and worst performers (filter out invalid data)
    // We rank by percentage performance to normalize for position size
    const validHoldings = holdings.filter(item => 
      item && 
      typeof item.gainLossPercent === 'number' && 
      !isNaN(item.gainLossPercent)
    );
    
    let topPerformer = null;
    let worstPerformer = null;
    
    if (validHoldings.length > 0) {
      const sortedByPerformance = [...validHoldings].sort((a, b) => b.gainLossPercent - a.gainLossPercent);
      topPerformer = sortedByPerformance[0];
      worstPerformer = sortedByPerformance[sortedByPerformance.length - 1];
    }

    // Calculate diversification score (based on number of unique sectors)
    // Simple heuristic: each unique sector adds 1.5 points, capped to 10, floored to 1
    const uniqueSectors = new Set(holdings.map(item => item.sector).filter(sector => sector && sector.trim()));
    const diversificationScore = Math.min(10, Math.max(1, uniqueSectors.size * 1.5));

    // Determine risk level based on portfolio return (illustrative thresholds)
    let riskLevel = "Moderate";
    if (totalGainLossPercent > 20) riskLevel = "High";
    else if (totalGainLossPercent < -10) riskLevel = "Low";
    else if (totalGainLossPercent < -20) riskLevel = "Very Low";

    return res.status(200).send({
      totalValue: Math.round(totalValue),
      totalInvested: Math.round(totalInvested),
      totalGainLoss: Math.round(totalGainLoss),
      totalGainLossPercent: parseFloat(totalGainLossPercent.toFixed(2)),
      topPerformer: topPerformer ? {
        symbol: topPerformer.symbol,
        name: topPerformer.name,
        gainPercent: topPerformer.gainLossPercent
      } : null,
      worstPerformer: worstPerformer ? {
        symbol: worstPerformer.symbol,
        name: worstPerformer.name,
        gainPercent: worstPerformer.gainLossPercent
      } : null,
      diversificationScore: parseFloat(diversificationScore.toFixed(1)),
      riskLevel
    });
  } catch (error) {
    return res.status(500).send({
      message: "Failed to calculate portfolio summary",
      error: error.message
    });
  }
};
