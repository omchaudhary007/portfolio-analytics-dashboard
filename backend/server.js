import express from "express";
import cors from "cors";
import "dotenv/config";
import portfolioRoute from "./routes/portfolio.route.js";

const app = express();
const PORT = process.env.PORT || 8080;


// Middleware
app.use(cors());
app.use(express.json());

// Portfolio Analytics API Routes
app.use("/api/portfolio", portfolioRoute);

app.listen(PORT, (error) => {
  if (error) {
    console.log("Server startup failed:", error.message);
  } else {
    console.log(`Portfolio Analytics API server running on port ${PORT}`);
  }
});
