import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import chalk from "chalk";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;
const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

// API configuration
const config = {
  headers: { "X-API-Token": API_KEY }
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Set view engine
app.set("view engine", "ejs");

// Global variables
const currentYear = new Date().getFullYear();

// Cache for API responses (simple in-memory cache)
const cache = {
  symbols: null,
  tickers: {},
  lastUpdated: {
    symbols: null,
    tickers: {}
  },
  // Cache expiration time in milliseconds (5 minutes)
  expirationTime: 5 * 60 * 1000
};

// Helper function to check if cache is valid
const isCacheValid = (type, symbol = null) => {
  if (symbol) {
    return (
      cache.tickers[symbol] &&
      cache.lastUpdated.tickers[symbol] &&
      Date.now() - cache.lastUpdated.tickers[symbol] < cache.expirationTime
    );
  }
  
  return (
    cache[type] &&
    cache.lastUpdated[type] &&
    Date.now() - cache.lastUpdated[type] < cache.expirationTime
  );
};

// Routes
app.get("/", (req, res) => {
  console.log(chalk.blue("🏠 Rendering home page"));
  res.render("index.ejs", { 
    year: currentYear, 
    content: "Waiting for user input..." 
  });
});

// Test page route
app.get("/test", (req, res) => {
  console.log(chalk.blue("🧪 Rendering test page"));
  res.render("test.ejs", { 
    year: currentYear
  });
});

// API endpoint to get all symbols
app.get("/api/symbols", async (req, res) => {
  console.log(chalk.yellow("🔍 Fetching all symbols"));
  
  try {
    // Check cache first
    if (isCacheValid('symbols')) {
      console.log(chalk.green("✅ Returning symbols from cache"));
      return res.json(cache.symbols);
    }
    
    // Fetch from API if cache is invalid
    console.log(chalk.blue("🌐 Fetching symbols from API"));
    const result = await axios.get(`${API_URL}/symbols`, config);
    
    // Update cache
    cache.symbols = result.data;
    cache.lastUpdated.symbols = Date.now();
    
    console.log(chalk.green(`✅ Successfully fetched ${Object.keys(result.data).length} symbols`));
    res.json(result.data);
  } catch (error) {
    console.error(chalk.red("❌ Error fetching symbols:"), error.message);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Failed to fetch symbols",
      error: error.message
    });
  }
});

// API endpoint to get ticker by symbol
app.get("/api/ticker/:symbol", async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  console.log(chalk.yellow(`🔍 Fetching ticker for ${symbol}`));
  
  try {
    // Check cache first
    if (isCacheValid('tickers', symbol)) {
      console.log(chalk.green(`✅ Returning ${symbol} data from cache`));
      return res.json(cache.tickers[symbol]);
    }
    
    // Fetch from API if cache is invalid
    console.log(chalk.blue(`🌐 Fetching ${symbol} data from API`));
    const result = await axios.get(`${API_URL}/tickers/${symbol}`, config);
    
    // Add additional data for UI display
    const tickerData = {
      ...result.data,
      // Add a placeholder for 24h ago price (in a real app, you'd fetch historical data)
      price_24h_ago: result.data.price_24h * (1 - (Math.random() * 0.1 - 0.05)), // Simulate 5% up or down
      last_trade_time: new Date().toISOString()
    };
    
    // Update cache
    cache.tickers[symbol] = tickerData;
    cache.lastUpdated.tickers[symbol] = Date.now();
    
    console.log(chalk.green(`✅ Successfully fetched data for ${symbol}`));
    res.json(tickerData);
  } catch (error) {
    console.error(chalk.red(`❌ Error fetching ticker for ${symbol}:`), error.message);
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      return res.status(404).json({
        message: `Ticker symbol '${symbol}' not found`,
        error: "Not Found"
      });
    }
    
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || `Failed to fetch ticker for ${symbol}`,
      error: error.message
    });
  }
});

// Legacy route for backward compatibility
app.get("/getTickerBySymbol", async (req, res) => {
  const ticker = req.query.ticker;
  console.log(chalk.yellow(`⚠️ Using legacy route for ${ticker}`));
  
  try {
    const result = await axios.get(`${API_URL}/tickers/${ticker}`, config);
    res.render("index.ejs", { 
      year: currentYear, 
      content: JSON.stringify(result.data, null, 2) 
    });
  } catch (error) {
    res.render("index.ejs", { 
      year: currentYear, 
      content: JSON.stringify(error.response?.data || error.message, null, 2) 
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(chalk.green(`🚀 Server is running on port ${port}`));
  console.log(chalk.blue(`📊 Crypto Ticker Dashboard is ready!`));
  console.log(chalk.yellow(`🔗 API URL: ${API_URL}`));
});