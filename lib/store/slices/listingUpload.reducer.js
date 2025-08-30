import axios from "axios";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import {
  saveImageToStorage,
  deleteImageFromStorage,
  uploadListing,
  fetchListingsByEmail,
  markListingAsDeleted,
  saveTransaction,
  updateListings,
  saveVideoToStorage,
} from "@/lib/firebase/firebase.utils";

const INITIAL_STATE = {
  currentUpload: {
    location: {
      address: "",
      state: "",
      lga: "",
    },
    details: {
      description: "",
      title: "",
      furnished: "",
      propertyType: "",
      bedrooms: "",
      baths: "",
      amenities: [],
      price: 0,
      paymentType: "",
      priceNegotiable: "false",
    },
    images: [],
    primaryImage: "",
    imageUploading: false,
    videoUploading: false,
    uploadError: "",
    uploadMsg: "",
    stage: "inActive",
    subscription: null,
    updatedPrice: [],
    uploadDate: [],
    video: null,
  },

  uploadedListings: [],
  amenitiesList: [
    "Fenced",
    "Electricity 24/7",
    "Security",
    "WiFi",
    "Cinema",
    "Garage",
    "EnSuite",
    "Laundry Room",
    "Fireplace",
    "Recreational Facilities",
    "SwimmingPool",
    "Childrens Playground",
    "Power Backup",
    "Spa",
    "Clubhouse",
  ],
  subscription: null,
  cartListing: null,
  paymentIsLoading: false,
  paymentLink: "",
  paymentLinkError: "",
  verifyIsLoading: false,
  paymentStatus: "",
  uploadVideoError: ""
};

const updateChosenAmeninitesHandler = (list, string) => {
  console.log("chosen amenities", string);
  if (list.includes(string)) {
    console.log(list.filter((item) => item !== string));
    return list.filter((item) => item !== string);
  } else {
    console.log([...list, string]);
    return [...list, string];
  }
};

export const saveImage = createAsyncThunk(
  "listingUpload/saveImage",
  async (file, { dispatch, rejectWithValue }) => {
    try {
      const image = await saveImageToStorage(file);
      return image;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const saveVideo = createAsyncThunk(
  "listingUpload/saveVideo",
  async (file, { dispatch, rejectWithValue }) => {
    try {
      const image = await saveVideoToStorage(file);
      return image;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const deleteImage = createAsyncThunk(
  "listingUpload/deleteImage",
  async (path, { rejectWithValue }) => {
    try {
      await deleteImageFromStorage(path);
      // Optionally, you could return a success message or the path that was deleted
      return path;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const deleteVideo = createAsyncThunk(
  "listingUpload/deleteVideo",
  async (path, { rejectWithValue }) => {
    try {
      await deleteImageFromStorage(path);
      // Optionally, you could return a success message or the path that was deleted
      return path;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const uploadListings = createAsyncThunk(
  "listingUpload/uploadListings",
  async (listing, { rejectWithValue }) => {
    try {
      // Call the uploadListing function to upload the listing
      const id = await uploadListing(listing);
      // Return the ID if successful
      return id;
    } catch (error) {
      // Return the error message if there's an error
      return rejectWithValue(error.message);
    }
  }
);

export const deleteListing = createAsyncThunk(
  "listingUpload/deleteListing",
  async ({ email, id }, { rejectWithValue, dispatch }) => {
    try {
      // Call the deleteListing function to delete the listing by ID
      await markListingAsDeleted(id);
      // Return the ID if successful
      dispatch(fetchUploadedListings(email));
      return id;
    } catch (error) {
      // Return the error message if there's an error
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUploadedListings = createAsyncThunk(
  "listingUpload/fetchUploadedListings",
  async (email, { rejectWithValue }) => {
    try {
      const listings = await fetchListingsByEmail(email);
      return listings;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPaymentLink = createAsyncThunk(
  "listingUpload/getpayment",
  async (cartDetails, { rejectWithValue }) => {
    const url = "http://localhost:5000/acceptpayment"; //live
    // const url = 'http://localhost:8888/api/acceptpayment'; //local
    // console.log(cartDetails)

    const { email, amount, listing, listingId, fallback, userId, duration } =
      cartDetails;
    const bodyData = { email, amount, listing, listingId, userId, duration };

    try {
      const data = await axios.post(url, bodyData);
      const link = JSON.parse(data.data).data.authorization_url;
      // console.log(link)
      fallback();
      return link;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifypayments = createAsyncThunk(
  "cart/verifypayment",
  async (ref, { rejectWithValue, dispatch, getState }) => {
    const url = `http://localhost:5000/verify?reference=${ref}`; //live
    // const url = `http://localhost:8888/api/verify?reference=${ref}`; //local
    try {
      const { data } = await axios.get(url);
      if (JSON.parse(data).data.status === "success") {
        const metadata = JSON.parse(data).data.metadata.custom_fields;
        const listingId = metadata[0].value;
        const plan = metadata[1].value;
        const userId = metadata[2].value;
        const duration = metadata[3].value;
        const amount = JSON.parse(data).data.amount;
        const paidAt = JSON.parse(data).data.paidAt;
        const reference = ref;
        const status = "success";

        const isNewTransaction = await saveTransaction({
          listingId,
          plan,
          userId,
          duration,
          amount,
          paidAt,
          reference,
          status,
        });
        if (isNewTransaction) {
          const state = getState();
          const cartListing = state.listingUpload.cartListing;
          const subscription = state.listingUpload.subscription;
          const { paymentLink, ...rest } = subscription || {};
          await updateListings({
            ...cartListing,
            subscription: rest,
            stage: "active",
          });
        }

        return JSON.parse(data).data;
      } else {
        return rejectWithValue("Error while veryfying payment");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const filterImagesById = (images, path) => {
  return images.filter((image) => image.fullPath !== path);
};

const listingUploadSlice = createSlice({
  name: "listingUpload",
  initialState: INITIAL_STATE,
  reducers: {
    setCurrentUpload: (state, action) => {
      state.currentUpload = action.payload;
    },
    updateLocation: (state, action) => {
      const { key, value } = action.payload;
      if (state.currentUpload.location.hasOwnProperty(key)) {
        state.currentUpload.location[key] = value;
      }
    },
    updateDetails: (state, action) => {
      const { key, value } = action.payload;
      if (state.currentUpload.details.hasOwnProperty(key)) {
        state.currentUpload.details[key] = value;
      }
    },
    addAmenity: (state, action) => {
      state.amenitiesList.push(action.payload);
    },
    updateChosenAmeninites: (state, action) => {
      state.currentUpload.details.amenities = updateChosenAmeninitesHandler(
        state.currentUpload.details.amenities,
        action.payload
      );
      // console.log(acti)
    },
    setUploadMsg: (state, action) => {
      state.currentUpload.uploadMsg = action.payload;
    },
    updatePrimaryImage: (state, action) => {
      state.currentUpload.primaryImage = action.payload;
    },
    clearPrimaryImage: (state, action) => {
      state.currentUpload.primaryImage = "";
    },
    setCartListing: (state, action) => {
      state.cartListing = action.payload;
    },
    setSubscription: (state, action) => {
      state.subscription = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(saveImage.fulfilled, (state, action) => {
        state.currentUpload.images.push(action.payload);
        state.currentUpload.imageUploading = false;
      })
      .addCase(saveVideo.fulfilled, (state, action) => {
        state.currentUpload.video = (action.payload);
        state.currentUpload.videoUploading = false;

      })
      .addCase(saveVideo.rejected, (state, action) => {
        state.uploadVideoError = (action.payload);
        state.currentUpload.videoUploading = false;

      })
      .addCase(saveVideo.pending, (state, action) => {
        state.currentUpload.videoUploading = true;
      })
      .addCase(saveImage.pending, (state, action) => {
        state.currentUpload.imageUploading = true;
      })
      .addCase(saveImage.rejected, (state, action) => {
        state.currentUpload.uploadError = "Failed to upload image";
        state.currentUpload.imageUploading = false;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.currentUpload.images = filterImagesById(
          state.currentUpload.images,
          action.payload
        );
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.currentUpload.video = null
      })
      .addCase(uploadListings.fulfilled, (state, action) => {
        state.currentUpload.uploadMsg = "Listing uploaded successfully";
        state.currentUpload.uploadError = "";
        state.currentUpload.details = INITIAL_STATE.currentUpload.details;
        state.currentUpload.location = INITIAL_STATE.currentUpload.location;
        state.currentUpload.images = [];
        state.currentUpload.updatedPrice = [];
        state.currentUpload.video = null;
        state.currentUpload.subscription = null;
      })
      .addCase(fetchUploadedListings.fulfilled, (state, action) => {
        state.uploadedListings = action.payload;
      })
      .addCase(getPaymentLink.pending, (state, action) => {
        state.paymentIsLoading = true;
      })
      .addCase(getPaymentLink.fulfilled, (state, action) => {
        state.paymentIsLoading = false;
        state.subscription.paymentLink = action.payload;
        // state.paymentOverlay = false;
      })
      .addCase(getPaymentLink.rejected, (state, action) => {
        state.paymentIsLoading = false;
        state.paymentLinkError = action.payload;
      })
      .addCase(verifypayments.pending, (state, action) => {
        //from here
        state.verifyIsLoading = true;
      })
      .addCase(verifypayments.rejected, (state, action) => {
        state.verifyIsLoading = false;
        state.paymentStatus = "failed";
      })
      .addCase(verifypayments.fulfilled, (state, action) => {
        state.paymentStatus = "completed";
        state.verifyIsLoading = false;
      });
  },
});

export const listingUploadReducer = listingUploadSlice.reducer;
export const {
  updateDetails,
  updateLocation,
  addAmenity,
  clearPrimaryImage,
  updateChosenAmeninites,
  setUploadMsg,
  updatePrimaryImage,
  setCartListing,
  setSubscription,
} = listingUploadSlice.actions;

const selectListingUpload = (state) => state.listingUpload;

export const selectCurrentUpload = createSelector(
  [selectListingUpload],
  (listingUpload) => listingUpload.currentUpload
);

export const selectAmenitiesList = createSelector(
  [selectListingUpload],
  (listingUpload) => listingUpload.amenitiesList
);

export const selectLocation = createSelector(
  [selectListingUpload],
  (listingUpload) => listingUpload.currentUpload.location
);

export const selectDetails = createSelector(
  [selectListingUpload],
  (listingUpload) => listingUpload.currentUpload.details
);

export const selectImages = createSelector(
  [selectListingUpload],
  (listingUpload) => listingUpload.currentUpload.images
);

export const selectVideos = createSelector(
  [selectListingUpload],
  (listingUpload) => listingUpload.currentUpload.video
);

export const selectChosenAmenities = createSelector(
  [selectListingUpload],
  (listingUpload) => listingUpload.currentUpload.details.amenities
);

export const selectUploadMsg = createSelector(
  [selectListingUpload],
  (listingUpload) => listingUpload.currentUpload.uploadMsg
);

export const selectPrimaryImage = createSelector(
  [selectListingUpload], // Input selector
  (listingUpload) => listingUpload.currentUpload.primaryImage // Output selector
);
export const selectUploadedListings = createSelector(
  [selectListingUpload], // Input selector
  (listingUpload) => listingUpload.uploadedListings // Output selector
);
export const selectLoading = createSelector(
  [selectListingUpload], // Input selector
  (listingUpload) => listingUpload.currentUpload.imageUploading // Output selector
);
export const selectVideoLoading = createSelector(
  [selectListingUpload], // Input selector
  (listingUpload) => listingUpload.currentUpload.videoUploading // Output selector
);
export const selectCartListing = createSelector(
  [selectListingUpload],
  (listingUpload) => listingUpload.cartListing
);

export const selectSubscription = createSelector(
  [selectListingUpload],
  (listingUpload) => listingUpload.subscription
);

export const selectVerifyIsLoading = createSelector(
  [selectListingUpload],
  (listingUpload) => listingUpload.verifyIsLoading
);

export const selectPaymentStatus = createSelector(
  [selectListingUpload],
  (listingUpload) => listingUpload.paymentStatus
);
