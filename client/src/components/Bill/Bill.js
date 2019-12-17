import React from "react";
import { useHistory } from "react-router-dom";

const Bill = props => {
  const { bill } = props;
  let history = useHistory();

  const goBack = () => {
    history.push("/");
  };

  return (
    <div>
      <h2>{bill.name}</h2>
      <h4>Amount: ${bill.amount}</h4>
      <h4>Day of Month Due: {bill.due}</h4>
      <button onClick={() => goBack()}>Back</button>
    </div>
  );
};

export default Bill;
