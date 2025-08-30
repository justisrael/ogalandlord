import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { fetchTransactionsByUserId } from "@/lib/firebase/firebase.utils";

// Async thunk to fetch transactions by userId
export const fetchUserTransactions = createAsyncThunk(
  "transactions/fetchUserTransactions",
  async (userId, { rejectWithValue }) => {
    try {
      const transactions = await fetchTransactionsByUserId(userId);
      return transactions;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const INITIAL_STATE = {
  transactions: [],
  isLoading: false,
  error: null,
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchUserTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const transactionsReducer = transactionsSlice.reducer;

// Selectors
const selectTransactionsState = (state) => state.transactions;

const selectTransactions = createSelector(
  [selectTransactionsState],
  (transactionsState) => transactionsState.transactions
);

const selectTransactionsLoading = createSelector(
  [selectTransactionsState],
  (transactionsState) => transactionsState.isLoading
);

const selectTransactionsError = createSelector(
  [selectTransactionsState],
  (transactionsState) => transactionsState.error
);

export const transactionsSliceSelectors = {
  selectTransactions,
  selectTransactionsLoading,
  selectTransactionsError,
};
