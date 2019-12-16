import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./styles.css";

const CreateBill = ({ token, onBillCreated }) => {
  let history = useHistory();
  const [billData, setBillData] = useState({
    name: "",
    amount: "",
    due: ""
  });
  const { name, amount, due } = billData;

  const onChange = e => {
    const { name, value } = e.target;

    setBillData({
      ...billData,
      [name]: value
    });
  };

  const create = async () => {
    if (!name || !amount || !due) {
      console.log("All fields are required");
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

        //Create bill
        const body = JSON.stringify(newBill);
        const res = await axios.post(
          "http://localhost:5000/api/bills",
          body,
          config
        );

        //Call the handler and redirect
        onBillCreated(res.data);
        history.push("/");
      } catch (error) {
        console.error(`Error creating bill: ${error.response.data}`);
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Create New Bill</h2>
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
      <button onClick={() => create()}>Submit</button>
    </div>
  );
};

export default CreateBill;
