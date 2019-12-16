import express from "express";
import connectDatabase from "./config/db";
import { check, validationResult } from "express-validator";
import cors from "cors";
import jwt from "jsonwebtoken";
import config from "config";
import Income from "./models/Income";
import Bill from "./models/Bill";
import auth from "./middleware/auth";

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

// Utility Functions
const returnToken = (income, res) => {
  const payload = {
    income: {
      id: income.id
    }
  };

  jwt.sign(
    payload,
    config.get("jwtSecret"),
    { expiresIn: "10hr" },
    (err, token) => {
      if (err) throw err;
      res.json({ token: token });
    }
  );
};

// API Endpoints
app.get("/", (req, res) =>
  res.send("http get request sent to root api endpoint")
);

// Income Enpoints
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

        //Generate and retuurn a jwt token
        returnToken(income, res);
      } catch (error) {
        res.status(500).send("Server error");
      }
    }
  }
);

/**
 * @route GET api/auth
 * @desc Authenticate income
 */
app.get("/api/auth", auth, async (req, res) => {
  try {
    const income = await Income.findById(req.income.id);
    res.status(200).json(income);
  } catch (error) {
    res.status(500).send("Unknown server error");
  }
});

/**
 * @route DELETE api/delete
 * @desc Delete income
 */
app.delete("/api/delete", auth, async (req, res) => {
  try {
    const income = await Income.findById(req.income.id);
    await income.remove();

    res.json({ msg: "income removed" });
  } catch (error) {
    res.status(500).send("Unknown server error");
  }
});

/**
 * @route POST api/view
 * @desc View income
 */
app.post(
  "/api/view",
  [
    check("monthYear", "Please enter a valid month and year")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .isLength({ max: 7 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      const { monthYear } = req.body;
      try {
        //Check if income exists
        let income = await Income.findOne({ monthYear: monthYear });
        if (!income) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid month and year" }] });
        }

        // Generate and return a JWT token
        returnToken(income, res);
      } catch (error) {
        res.status(500).send("Server Error");
      }
    }
  }
);

// Bill endpoints
/**
 * @route POST api/bills
 * @desc create Bill
 */
app.post(
  "/api/bills",
  [
    auth,
    [
      check("name", "Name of bill is req")
        .not()
        .isEmpty(),
      check("amount", "Amount is required w/o $")
        .isDecimal()
        .not()
        .isEmpty(),
      check("due", "Due day is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      const { name, amount, due } = req.body;
      try {
        //Create new bill
        const bill = new Bill({
          name: name,
          amount: amount,
          due: due
        });

        //save to db and return
        await bill.save();

        res.json(bill);
      } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
      }
    }
  }
);

/**
 * @route GET api/bills
 * @desc Get bills
 */
app.get("/api/bills", auth, async (req, res) => {
  try {
    const bills = await Bill.find().sort({ due: -1 });

    res.json(bills);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

/**
 * @route GET api/bills/:id
 * @desc Get Bill
 */
app.get("/api/bills/:id", auth, async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    //make sure the bill was found
    if (!bill) {
      return res.status(404).json({ msg: "Bill not found" });
    }

    res.json(bill);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

/**
 * @route DELETE api/bills/:id
 * @desc Delete a post
 */
app.delete("/api/bills/:id", auth, async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    // make sure the bill was found
    if (!bill) {
      return res.status(404).json({ msg: "Post not found" });
    }

    await bill.remove();

    res.json({ msg: "Bill removed" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

/**
 * @route PUT api/bills/:id
 * @desc Update a bill
 */
app.put("/api/bills/:id", auth, async (req, res) => {
  try {
    const { name, amount, due } = req.body;
    const bill = await Bill.findById(req.params.id);

    // Make sure the bill was found
    if (!bill) {
      return res.status(404).json({ msg: "Bill not found" });
    }

    // Update the bill and return
    bill.name = name || bill.name;
    bill.amount = amount || bill.amount;
    bill.due = due || bill.due;

    await bill.save();

    res.json(bill);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

//connection listener
const port = 5000;
app.listen(port, () => console.log(`Express server running on port ${port}`));

//Created By Peturkey
