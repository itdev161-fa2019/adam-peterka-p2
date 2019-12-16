import React from "react";
import BillListItem from "./BillListItem";

const BillList = props => {
  const { bills, clickBill, deleteBill, editBill } = props;
  return bills.map(bill => (
    <BillListItem
      key={bill._id}
      bill={bill}
      clickBill={clickBill}
      deleteBill={deleteBill}
      editBill={editBill}
    />
  ));
};

export default BillList;
