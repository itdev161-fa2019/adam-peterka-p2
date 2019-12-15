import React from "react";
import { useHistory } from "react-router-dom";
import slugify from "slugify";
import "./styles.css";

const BillListItem = props => {
  const { bill, clickBill, deleteBill } = props;
  const history = useHistory();

  const handleClickBill = bill => {
    const slug = slugify(bill.name, { lower: true });

    clickBill(bill);
    history.push(`/bills/${slug}`);
  };

  return (
    <div>
      <div className="billListItem" onClick={() => handleClickBill(bill)}>
        <h2>{bill.name}</h2>
        <h3>Amount: ${bill.amount}</h3>
        <h4>Day of Month Due: {bill.due}</h4>
      </div>
      <div className="billControls">
        <button onClick={() => deleteBill(bill)}>Delete</button>
      </div>
    </div>
  );
};

export default BillListItem;
