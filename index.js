import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;
const API_URL = process.env.API_URL;
const yourAPIKey = process.env.API_KEY;

const config = {
  headers: { "X-API-Token": yourAPIKey }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

const currentYear = new Date().getFullYear();

app.get("/", (req, res) => {
  res.render("index.ejs", { year: currentYear, content: "Waiting for user input..." });
});

app.get("/getSymbols", async (req, res) => {
  try {
    const result = await axios.get(API_URL + "/symbols", config);
    res.render("index.ejs", { year: currentYear, content: JSON.stringify(result.data) });
  } catch (error) {
    res.render("index.ejs", { year: currentYear, content: JSON.stringify(error.response.data) });
  } finally {
    res.render("index.ejs", { year: currentYear, content: "Waiting for user input..." });
  } 
})

app.get("/getTickerBySymbol", async (req, res) => {
  const ticker = req.query.ticker;
  try {
    const result = await axios.get(API_URL + "/tickers/" + ticker, config);
    res.render("index.ejs", { year: currentYear, content: JSON.stringify(result.data) });
  } catch (error) {
    res.render("index.ejs", { year: currentYear, content: JSON.stringify(error.response.data) });
  }
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});