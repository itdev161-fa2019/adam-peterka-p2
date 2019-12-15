import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./styles.css";

const EditBill = ({ token, bill, onBillUpdated }) => {
  let history = useHistory();
  const [billData, setBillData] = useState({
    name: bill.name,
    amount: bill.amount,
    due: bill.due
  });
  const { name, amount, due } = billData;

  const onChange = e => {
    const { name, value } = e.target;

    setBillData({
      ...billData,
      [name]: value
    });
  };

  const update = async () => {
    if (!name || !amount || !due) {
      console.log("Fields are all required");
    } else {
      const newBill = {
        name: name,
        amount: amount,
        due: due
      };

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
          }
        };

        //Create the bill
        const body = JSON.stringify(newBill);
        const res = await axios.put(
          `http://localhost:5000/api/bills/${bill._id}`,
          body,
          config
        );

        //Call the handler and redirect
        onBillUpdated(res.data);
        history.push("/");
      } catch (error) {
        console.error(`Error creating post: ${error.response.data}`);
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Edit Bill</h2>
      <input
        name="name"
        type="text"
        placeholder="Bill Name"
        value={name}
        onChange={e => onChange(e)}
      />
      <input
        name="amount"
        type="text"
        placeholder="Bill Amount"
        value={amount}
        onChange={e => onChange(e)}
      />
      <input
        name="due"
        type="text"
        placeholder="Bill Due Date"
        value={due}
        onChange={e => onChange(e)}
      />
      <button onClick={() => update()}>Submit</button>
    </div>
  );
};

export default EditBill;
