const express = require("express");
const morgan = require("morgan");
const rateLimitter = require("express-rate-limit");

const morganConfig = require('./morgan.config');
const serverRateLimiter = rateLimitter({
  windowMs: 5 * 1000,
  max: 3,
  legacyHeaders: false
});

const app = express();

app.use(serverRateLimiter);
app.use(morgan(morganConfig));
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json("Base route for CACG API");
});

app.post("/api/solve", (req, res) => {
  const {addend, augend, sum} = req.body;
  const reqBody = {
    status: 0,
    code: ''
  };
  return res.status(200).json(reqBody);
});

app.get("/*", (req, res) => {
  res.redirect('/');
});

app.listen(5000, () => {
  console.clear();
  console.log("[SERVER] Listening to PORT 5000");
});