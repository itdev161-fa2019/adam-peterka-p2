import express from "express";
import connectDatabase from "./config/db";
import { check, validationResult } from "express-validator";
import cors from "cors";
import Income from "./models/Income";
import { userInfo } from "os";

// init express app
const app = express();

// connect database
connectDatabase();

// configure middlware
app.use(express.json({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:3000"
  })
);

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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      const { monthYear, weeklyIncome } = req.body;
      try {
        //check if income exists
        let income = await Income.findOne({ monthYear: monthYear });
        if (income) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Income already exists" }] });
        }

        //Create new income
        income = new Income({
          monthYear: monthYear,
          weeklyIncome: weeklyIncome
        });

        //Save to db and return
        await income.save();
        res.send("Income successfully created");
      } catch (error) {
        res.status(500).send("Server error");
      }
    }
  }
);

//connection listener
const port = 5000;
app.listen(port, () => console.log(`Express server running on port ${port}`));
