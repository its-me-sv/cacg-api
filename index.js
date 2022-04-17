const express = require("express");
const morgan = require("morgan");
const rateLimitter = require("express-rate-limit");

const morganConfig = require('./morgan.config');
const serverRateLimiter = rateLimitter({
  windowMs: 5 * 1000,
  max: 3,
  legacyHeaders: false
});

const codeGenerator = require('./code-gen.util');

const app = express();

app.use(serverRateLimiter);
app.use(morgan(morganConfig));
app.use(express.json());

// base route
app.get("/", (req, res) => {
  return res.status(200).json("Base route for CACG API");
});

// code generator
app.post("/api/solve", (req, res) => {
  const {addend, augend, sum} = req.body;
  const reqBody = {
    status: 0,
    code: ''
  };
  if (!addend?.length || !augend?.length || !sum?.length) {
    reqBody.status = -1;
    return res.status(200).json(reqBody);
  }
  const result = codeGenerator(addend, augend, sum);
  if (result === false) {
    reqBody.status = -2;
    return res.status(200).json(reqBody);
  }
  reqBody.status = 1;
  reqBody.code = result;
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