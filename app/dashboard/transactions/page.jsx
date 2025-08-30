"use client";

import React, { useEffect } from "react";
import { TransactionTable } from "@/components";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { transactionsSliceSelectors, fetchUserTransactions } from "@/lib/store/slices/transactions.reducer";
import { selectCurrentUser } from "@/lib/store/slices/user.reducer";

const TransactionHistoryPage = () => {
  const transactions = useAppSelector(
    transactionsSliceSelectors.selectTransactions
  );
  const isLoading = useAppSelector(
    transactionsSliceSelectors.selectTransactionsLoading
  );
  const error = useAppSelector(
    transactionsSliceSelectors.selectTransactionsError
  );
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(fetchUserTransactions(currentUser.id));
  }, []);

  return (
    <div className="transaction-history-page">
      <button className="back-button">← Back</button>
      <h1 className="page-title">Transaction History</h1>
      <p className="page-subtext">All subscription payments.</p>

      {transactions?.length && <TransactionTable transactions={transactions} />}
    </div>
  );
};

export default TransactionHistoryPage;

