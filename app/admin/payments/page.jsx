"use client";

import React, { useEffect } from "react";
import { TransactionTable } from "@/components";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { transactionsSliceSelectors, fetchUserTransactions } from "@/lib/store/slices/transactions.reducer";
import { selectCurrentUser } from "@/lib/store/slices/user.reducer";
import { selectAllTransactions, fetchTransactions, selectCurrentAdmin, hasRole } from "@/lib/store/slices/admin.reducer";
import { AccessDenied } from "@/components";

const TransactionHistoryPage = () => {
  const currentAdmin = useAppSelector(selectCurrentAdmin);
  const transactions = useAppSelector(selectAllTransactions);

  if (currentAdmin && !hasRole(currentAdmin, "payments")) {
    return <AccessDenied requiredRole="payments" />;
  }
  const isLoading = useAppSelector(
    transactionsSliceSelectors.selectTransactionsLoading
  );
  const error = useAppSelector(
    transactionsSliceSelectors.selectTransactionsError
  );
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(fetchTransactions());
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

