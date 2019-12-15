import React from "react";
import BillListItem from "./BillListItem";

const BillList = props => {
  const { bills, clickBill, deleteBill } = props;
  return bills.map(bill => (
    <BillListItem
      key={bill._id}
      bill={bill}
      clickBill={clickBill}
      deleteBill={deleteBill}
    />
  ));
};

export default BillList;
