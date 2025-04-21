import React from "react";
import CustomNavbar from "../components/navbar/CustomNavbar";
import Alert from "react-bootstrap/esm/Alert";

const PaymentSuccessPage: React.FC = () => {
  return (
    <>
      <CustomNavbar />
      <div className="d-flex flex-column justify-content-start align-items-center vh-100">
        <div className="mt-5">

          <Alert key='info' variant='info'>
            <h3 className="mb-2">Thank you for your payment!</h3>
            <p className="mb-2">Your payment was successful.</p>
            <a href="/menu">Go to menu</a>
          </Alert>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccessPage;
