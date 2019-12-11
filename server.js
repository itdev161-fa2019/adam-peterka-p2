import express from "express";
import connectDatabase from "./config/db";
import { check, validationResult } from "express-validator";

// init express app
const app = express();

// connect database
connectDatabase();

// configure middlware
app.use(express.json({ extended: false }));

// API Endpoints
app.get("/", (req, res) =>
  res.send("http get request sent to root api endpoint")
);

/**
 * @route POST api/incomes
 * @desc Create Income
 */
app.post(
  "/api/incomes",
  [
    check("monthYear", "Please enter a month and year")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .isLength({ max: 7 }),
    check("weeklyIncome", "Please enter your weekly income")
      .not()
      .isEmpty()
      .isDecimal()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      return res.send(req.body);
    }
  }
);

//connection listener
app.listen(3000, () => console.log(`Express server running on port 3000`));
