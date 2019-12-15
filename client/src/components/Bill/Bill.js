import React from "react";

const Bill = props => {
  const { bill } = props;

  return (
    <div>
      <h2>{bill.name}</h2>
      <h3>{bill.amount}</h3>
      <h4>{bill.due}</h4>
    </div>
  );
};

export default Bill;
