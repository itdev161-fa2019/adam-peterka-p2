import React from "react";
import { useHistory } from "react-router-dom";
import slugify from "slugify";
import "./styles.css";

const BillListItem = props => {
  const { bill, clickBill, deleteBill, editBill } = props;
  const history = useHistory();

  const handleClickBill = bill => {
    const slug = slugify(bill.name, { lower: true });

    clickBill(bill);
    history.push(`/bills/${slug}`);
  };

  const handleEditBill = bill => {
    editBill(bill);
    history.push(`/edit-bill/${bill._id}`);
  };

  return (
    <div>
      <div className="billListItem" onClick={() => handleClickBill(bill)}>
        <h2>{bill.name}</h2>
        <h4>Amount: ${bill.amount}</h4>
        <h4>Day of Month Due: {bill.due}</h4>
      </div>
      <div className="billControls">
        <button onClick={() => deleteBill(bill)}>Delete</button>
        <button onClick={() => handleEditBill(bill)}>Edit</button>
      </div>
    </div>
  );
};

export default BillListItem;
