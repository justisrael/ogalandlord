import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { createSelector } from 'reselect';
import { saveImageToStorage, deleteImageFromStorage, uploadListing, fetchAllUnverifiedListings, markListingAsDeleted, fetchAllTransactions, fetchAllUnverifiedUsers, updateListings, updateUsers } from "@/lib/firebase/firebase.utils";

const INITIAL_STATE = {
    unverifiedListings: null,
    unVerifiedUsers: null,
    transactions: []

}


  export const fetchUnverifiedListings = createAsyncThunk(
    'admin/fetchUnverifiedListings',
    async (_, { rejectWithValue }) => {
      try {
        const listings = await fetchAllUnverifiedListings();
        function modifyListings(listings) {
          return listings.map(listing => {
            // Modify the uploadDate
            if (listing.uploadDate && listing.uploadDate.seconds) {
              listing.uploadDate = new Date(listing.uploadDate.seconds * 1000).toISOString();
            }
        
            // Loop through updatedPrice array and modify the date property
            if (Array.isArray(listing.updatedPrice)) {
              listing.updatedPrice = listing.updatedPrice.map(priceObj => {
                if (priceObj.date && priceObj.date.seconds) {
                  priceObj.date = new Date(priceObj.date.seconds * 1000).toISOString();
                }
                return priceObj;
              });
            }
        
            return listing;
          });
        }
        return modifyListings(listings);
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );


  export const fetchUnverifiedUsers = createAsyncThunk(
    'admin/fetchUnverifiedUsers',
    async (_, { rejectWithValue }) => {
      try {
        const users = await fetchAllUnverifiedUsers();
        return users;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

  
 export const adminEditListings = createAsyncThunk(
  'admin/updateListing',
  async (listing, { rejectWithValue, dispatch }) => {
    try {
      // Call the uploadListing function to upload the listing
      const status = await updateListings(listing);
      // Return the ID if successful
      await dispatch(fetchUnverifiedListings())
      return status;
    } catch (error) {
      // Return the error message if there's an error
      return rejectWithValue(error.message);
    }
  }
);

  
 export const adminEditUsers = createAsyncThunk(
  'admin/updateUser',
  async (user, { rejectWithValue, dispatch }) => {
    try {
      // Call the uploadListing function to upload the listing
      const status = await updateUsers(user);
      // Return the ID if successful
      await dispatch(fetchUnverifiedUsers())
      return status;
    } catch (error) {
      // Return the error message if there's an error
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'admin/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const transactions = await fetchAllTransactions();
      return transactions;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

 const filterImagesById = (images, path) => {
    return images.filter(image => image.fullPath !== path);
};

 const adminSlice = createSlice({
    name: 'admin',
    initialState: INITIAL_STATE,
    reducers: {

    },

    extraReducers: (builder) => {
      builder
        .addCase(fetchUnverifiedListings.fulfilled, (state, action) => {
            state.unverifiedListings = action.payload;
        })
        .addCase(fetchUnverifiedUsers.fulfilled, (state, action) => {
            state.unVerifiedUsers = action.payload;
        })
        .addCase(fetchTransactions.fulfilled, (state, action) => {
            state.transactions = action.payload;
        })
        // .addCase(adminEditListings.fulfilled, (state, action) => {
        //   state.unverifiedListings = state.unverifiedListings.filter(doc => doc.stage === "review")
        // })
    }

})


export const adminReducer = adminSlice.reducer;


const selectAdminSlice = (state) => state.admin

export const selectUnverfiedListings = createSelector(
    [selectAdminSlice],
    (admin) => admin.unverifiedListings
)

export const selectUnverfiedUsers = createSelector(
    [selectAdminSlice],
    (admin) => admin.unVerifiedUsers
)

export const selectAllTransactions = createSelector(
    [selectAdminSlice],
    (admin) => admin.transactions
)
