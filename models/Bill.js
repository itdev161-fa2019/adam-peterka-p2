import mongoose from "mongoose";

const BillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  due: {
    type: String,
    required: true
  }
});

const Bill = mongoose.model("bill", BillSchema);

export default Bill;
