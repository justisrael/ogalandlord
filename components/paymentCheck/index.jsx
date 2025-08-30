import React from "react";
// import './PaymentSuccess.scss';

const PaymentSuccess = ({
  amount,
  transactionId,
  onClose,
  onBackToDashboard,
  success,
}) => {
  return (
    <div className="payment-success">
      {/* <button className="close-button" onClick={onClose}>×</button> */}
      {success ? (
        <div className="success-icon">
          <div className="circle">
            <span className="check">&#10003;</span>
          </div>
        </div>
      ) : (
        <div class="error-icon">
          <span class="cross">&times;</span>
        </div>
      )}
      <h2>{success ? "Payment successful" : "Payment unsuccessful"}</h2>
      <p className="subtext">
        {success ? "You’ve sent" : "You have a pending payment of"}
      </p>
      <h3 className="amount">
        ₦
        {parseFloat(amount).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
        })}
      </h3>
      <p className="info">
        {success ? (
          <>
            <span>
              Your payment has been confirmed by our service provider. Thanks
              for choosing us.
            </span>
            <br />
            Your Transaction ID is <strong>{transactionId}</strong>
          </>
        ) : (
          <span>
            Your payment has not been confirmed by our service provider.
          </span>
        )}
      </p>
      <button className="dashboard-button" onClick={onBackToDashboard}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default PaymentSuccess;

