import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const View = ({ authenticateIncome, deleteIncome }) => {
  let history = useHistory();
  const [incomeData, setIncomeData] = useState({
    monthYear: ""
  });
  const [errorData, setErrorData] = useState({ errors: null });

  const { monthYear } = incomeData;
  const { errors } = errorData;

  const onChange = e => {
    const { name, value } = e.target;
    setIncomeData({
      ...incomeData,
      [name]: value
    });
  };

  const viewIncome = async () => {
    const newIncome = {
      monthYear: monthYear
    };

    try {
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      const body = JSON.stringify(newIncome);
      const res = await axios.post(
        "http://localhost:5000/api/view",
        body,
        config
      );

      // Store income data and redirect
      localStorage.setItem("token", res.data.token);
      history.push("/");
    } catch (error) {
      //Cleare income data
      localStorage.removeItem("token");

      setErrorData({
        ...errors,
        errors: error.response.data.errors
      });
    }

    authenticateIncome();
  };

  const deleteSingle = async () => {
    const newIncome = {
      monthYear: monthYear
    };

    try {
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      const body = JSON.stringify(newIncome);
      const res = await axios.post(
        "http://localhost:5000/api/view",
        body,
        config
      );

      // Store income data and redirect
      localStorage.setItem("token", res.data.token);
      history.push("/");
    } catch (error) {
      //Cleare income data
      localStorage.removeItem("token");

      setErrorData({
        ...errors,
        errors: error.response.data.errors
      });
    }

    deleteIncome();
  };

  return (
    <div>
      <h2>View / Delete</h2>
      <div>
        <input
          type="text"
          placeholder="Month/Year"
          name="monthYear"
          value={monthYear}
          onChange={e => onChange(e)}
        />
      </div>
      <div>
        <button onClick={() => viewIncome()}>View</button>
        <button onClick={() => deleteSingle()}>Delete</button>
      </div>
      <div>
        {errors && errors.map(error => <div key={error.msg}>{error.msg}</div>)}
      </div>
    </div>
  );
};

export default View;
