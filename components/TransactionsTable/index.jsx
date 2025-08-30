"use client"

import React, { useState } from 'react';


const formatDate = (isoString) => {
  const date = new Date(isoString);
  return (
    date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }) +
    ' ' +
    date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    })
  );
};

const TransactionTable = ({ transactions }) => {
  const [selectedTx, setSelectedTx] = useState(null);

  const handleRowClick = (tx) => {
    setSelectedTx(tx);
  };

  const closeModal = () => {
    setSelectedTx(null);
  };

  return (
    <div className="transaction-table-container">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>S/N</th>
            <th>Reference</th>
            <th>Subscription / Time Range</th>
            <th>Amount(#)</th>
            <th>Paid At</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={tx.id} onClick={() => handleRowClick(tx)}>
              <td>{index + 1}</td>
              <td>{tx.reference}</td>
              <td>{`${tx.plan} / ${tx.duration}`}</td>
              <td>{Number(tx.amount).toLocaleString()}</td>
              <td>{formatDate(tx.paidAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedTx && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <h2>Transaction Details</h2>
            <ul>
              <li><strong>ID:</strong> {selectedTx.id}</li>
              <li><strong>User ID:</strong> {selectedTx.userId}</li>
              <li><strong>Listing ID:</strong> {selectedTx.listingId}</li>
              <li><strong>Plan:</strong> {selectedTx.plan}</li>
              <li><strong>Duration:</strong> {selectedTx.duration}</li>
              <li><strong>Amount:</strong> ₦{Number(selectedTx.amount).toLocaleString()}</li>
              <li><strong>Reference:</strong> {selectedTx.reference}</li>
              <li><strong>Status:</strong> {selectedTx.status}</li>
              <li><strong>Paid At:</strong> {formatDate(selectedTx.paidAt)}</li>
            </ul>
            <button className="close-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
