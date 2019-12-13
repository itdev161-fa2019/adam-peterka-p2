import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Create = ({ authenticateIncome }) => {
  let history = useHistory();
  const [incomeData, setIncomeData] = useState({
    monthYear: "",
    weeklyIncome: ""
  });
  const [errorData, setErrorData] = useState({ errors: null });

  const { monthYear, weeklyIncome } = incomeData;
  const { errors } = errorData;

  const onChange = e => {
    const { name, value } = e.target;
    setIncomeData({
      ...incomeData,
      [name]: value
    });
  };

  const createIncome = async () => {
    if (weeklyIncome.startsWith("$")) {
      console.log("Please enter your weekly income without the $.");
    } else if (!/^\d{1,2}\/\d{4}$/.test(monthYear)) {
      console.log("Please enter the month and year with a /");
    } else {
      const newIncome = {
        monthYear: monthYear,
        weeklyIncome: weeklyIncome
      };

      try {
        const config = {
          headers: {
            "Content-Type": "application/json"
          }
        };

        const body = JSON.stringify(newIncome);
        const res = await axios.post(
          "http://localhost:5000/api/incomes",
          body,
          config
        );

        // Store income data and redirect
        localStorage.setItem("token", res.data.token);
        history.push("/");
      } catch (error) {
        //Cleare income data and set errors
        localStorage.removeItem("token");

        setErrorData({
          ...errors,
          errors: error.response.data.errors
        });
      }

      authenticateIncome();
    }
  };

  return (
    <div>
      <h2>Create</h2>
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
        <input
          type="text"
          placeholder="Weekly Income"
          name="weeklyIncome"
          value={weeklyIncome}
          onChange={e => onChange(e)}
        />
      </div>
      <div>
        <button onClick={() => createIncome()}>Create New</button>
      </div>
      <div>
        {errors && errors.map(error => <div key={error.msg}>{error.msg}</div>)}
      </div>
    </div>
  );
};

export default Create;
