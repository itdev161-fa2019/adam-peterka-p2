import mongoose from "mongoose";

const IncomeSchema = new mongoose.Schema({
  monthYear: {
    type: String,
    required: true
  },
  weeklyIncome: {
    type: Number,
    required: true
  }
});

const Income = mongoose.model("income", IncomeSchema);

export default Income;
