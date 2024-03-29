// packages
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimitter = require("express-rate-limit");

// custom
const morganConfig = require('./morgan.config');
const codeGenerator = require('./code-gens');

// configs
const serverRateLimiter = rateLimitter({
  windowMs: 2 * 1000,
  max: 1,
  legacyHeaders: false
});
const corsConfig = {
  optionsSuccessStatus: 200,
  origin: 'https://its-me-sv.github.io'
};

// creating express instance
const app = express();

// using middlewares on express
if (process.env.NODE_ENV === "dev") app.use(cors());
else app.use(cors(corsConfig));
app.use(serverRateLimiter);
app.use(morgan(morganConfig));
app.use(express.json());

// base route
app.get("/", (req, res) => {
  return res.status(200).json("Base route for CACG API");
});

// code generator
app.post("/api/generate", (req, res) => {
  // destructuring input from body
  const {addend, augend, sum} = req.body;
  const {lang} = req.query;
  // missing or invalid lang property
  if (lang === undefined)
    return res.status(400).json("Missing query param lang");
  if (![0, 1, 2, 3, 4].includes(+lang))
    return res.status(400).json("Invalid valid for param lang");
  // default request body
  const reqBody = {
    status: 0,
    time: 0,
    lang: +lang,
    code: '',
  };
  // atleast one missing/empty input field
  if (!addend?.length || !augend?.length || !sum?.length) {
    reqBody.status = -1;
    return res.status(200).json(reqBody);
  }
  const result = codeGenerator[+lang](addend, augend, sum);
  // more than 10 distinct letters
  if (result === false) {
    reqBody.status = -2;
    return res.status(200).json(reqBody);
  }
  // generated code
  reqBody.status = 1;
  reqBody.code = result.code;
  reqBody.time = result.time
  return res.status(200).json(reqBody);
});

// all other routes
app.get("/*", (req, res) => {
  res.redirect('/');
});

app.listen(5000, () => {
  console.clear();
  console.log("[SERVER] Listening to PORT 5000");
});