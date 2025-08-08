# Portfolio Analytics Dashboard

## Live Link
- **Live Frontend:** link  
- **Live Backend API:** link

---

## About This Project
- A full‑stack portfolio analytics dashboard that showcases a robust backend API and an interactive frontend interface.  
- Uses realistic Indian stock data to visualize holdings, sector/market-cap allocation, and performance vs Nifty 50 and Gold.

---

## What’s Implemented

### Backend API (4 endpoints)
- `GET /api/portfolio/holdings` — complete holdings list  
- `GET /api/portfolio/allocation` — allocation by sector and market cap (value + %)  
- `GET /api/portfolio/performance` — timeline + computed returns (1m/3m/1y)  
- `GET /api/portfolio/summary` — totals, top/worst performer, diversification score, risk level

### Frontend Dashboard
- Portfolio overview cards: total value, total gain/loss (color-coded), performance %, number of holdings  
- Asset allocation: sector donut + market-cap bars (interactive tooltips with exact value + %)  
- Holdings table: sortable, searchable, filter by sector, color-coded performance, responsive  
- Performance comparison: portfolio vs Nifty 50 vs Gold timeline (interactive tooltip)  
- Top performers section: best/worst stock and key insights (diversification score, risk level)

### UX/Quality
- Loading and error states  
- Mobile-friendly responsive layout  
- Clean visual hierarchy

---

## Tech Stack

- **Backend:** Node.js, Express, CORS, dotenv  
- **Frontend:** React, Tailwind CSS, Framer Motion, Recharts, Lucide Icons

---

## Repository Structure

- `backend/` — Express API, controllers, routes, utils, and sample JSON data  
- `frontend/` — React app using Tailwind and Recharts, services and UI components

---

## Local Setup (Run in Minutes)

1. **Install dependencies**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
2. **Start backend** (default http://localhost:8080)
   ```bash
   cd backend && npm run dev
   ```
3. **Start frontend** (default http://localhost:5173)
   ```bash
   cd frontend && npm run dev
   ```

---

## Configuration

- **Backend:**  
  `PORT` from `.env` (optional), default `8080`

- **Frontend API base URL:**  
  Set `VITE_API_BASE_URL` to your API origin (falls back to `http://localhost:8080`)

  Example (`frontend/.env.local`):
  ```env
  VITE_API_BASE_URL=https://your-deployed-api.com
  ```

---

## API Reference

**Base URL:** `/api/portfolio`

### `GET /holdings`
Returns array of holdings:
```json
{
  symbol, name, quantity, avgPrice, currentPrice,
  sector, marketCap, value, gainLoss, gainLossPercent
}
```

### `GET /allocation`
Returns:
```json
{
  bySector: { [sector]: { value, percentage } },
  byMarketCap: { [cap]: { value, percentage } }
}
```

### `GET /performance`
Returns:
```json
{
  timeline: [{ date, portfolio, nifty50, gold }],
  returns: { portfolio, nifty50, gold }
}
```

### `GET /summary`
Returns:
```json
{
  totalValue, totalInvested, totalGainLoss, totalGainLossPercent,
  topPerformer, worstPerformer, diversificationScore, riskLevel
}
```

---

## Calculation Logic (High‑Level)

- **Total Value** = Σ holding.value  
- **Total Invested** = Σ (avgPrice × quantity)  
- **Total Gain/Loss** = Σ holding.gainLoss  
- **Portfolio % Return** = (Total Gain/Loss ÷ Total Invested) × 100  
- **Top/Worst Performer** = ranked by `gainLossPercent`  
- **Diversification Score** = `min(10, max(1, uniqueSectors × 1.5))`  
- **1m/3m/1y Returns** = `((latest − closestToTarget) ÷ closestToTarget) × 100` per series

---

## AI Usage Disclosure

**Tool Used:** Cursor (AI pair‑programming inside IDE)

### AI-Generated (Reviewed/Edited by Me)
- Component scaffolds and most JSX + Tailwind structure across the dashboard (Overview, Allocation, Performance, Holdings, TopPerformers)  
- Recharts configurations (LineChart, PieChart, BarChart) including ResponsiveContainer, axes, legends, and initial tooltip scaffolds  
- API service boilerplate, including env‑based API origin pattern  
- Inline comments and calculation docs, plus the initial README draft and structure  
- Common refactors for responsiveness, loading/error states, and animation patterns with Framer Motion

### Manual Focus
- Validating/adapting AI output to exactly match the assignment spec and data shapes  
- Domain calculations and data transformation edge cases; defensive coding and error semantics  
- Finalizing API contracts and wiring; polishing tooltips to show exact values and percentages  
- UX details and consistency across sections

### Productivity Impact
- AI reduced time spent on boilerplate and UI wiring by approximately 60–70%, allowing more focus on correctness and robustness during iteration
