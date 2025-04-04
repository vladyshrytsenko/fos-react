import React from "react";

type PaymentProps = {
  id: number
};

const Payment: React.FC<PaymentProps> = ({ id }) => {
  return (
    <div>
      Payment page
      </div>
  );
};

export default Payment;