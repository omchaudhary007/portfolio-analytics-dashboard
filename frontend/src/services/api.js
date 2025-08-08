const API_ORIGIN = (import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');
const API_BASE_URL = `${API_ORIGIN}/api/portfolio`;

class PortfolioAPI {
  async fetchData(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Get all portfolio holdings
  async getHoldings() {
    return this.fetchData('/holdings');
  }

  // Get portfolio allocation by sector and market cap
  async getAllocation() {
    return this.fetchData('/allocation');
  }

  // Get performance data with timeline and returns
  async getPerformance() {
    return this.fetchData('/performance');
  }

  // Get portfolio summary with key metrics
  async getSummary() {
    return this.fetchData('/summary');
  }

  // Get all portfolio data at once
  async getAllPortfolioData() {
    try {
      const [holdings, allocation, performance, summary] = await Promise.all([
        this.getHoldings(),
        this.getAllocation(),
        this.getPerformance(),
        this.getSummary()
      ]);

      return {
        holdings,
        allocation,
        performance,
        summary
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new PortfolioAPI();
