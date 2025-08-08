import { Router } from "express";
import { getHolding, getPortfolioAllocation, getPortfolioPerformance, getPortfolioSummary } from "../controllers/portfolio.controller.js";

const router = Router();

router.get('/holdings', getHolding);
router.get('/allocation', getPortfolioAllocation);
router.get('/performance', getPortfolioPerformance);
router.get('/summary', getPortfolioSummary);

export default router;