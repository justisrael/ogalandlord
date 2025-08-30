import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import {
  saveImageToStorage,
  deleteImageFromStorage,
  fetchListingsByEmail,
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
      bedrooms: 0,
      baths: 0,
      amenities: [],
      price: 0,
      paymentType: "",
      priceNegotiable: "false",
    },
    images: [],
    primaryImage: "",
    imageUploading: false,
    uploadError: "",
    uploadMsg: "",
    id: "",
    contact: {},
    stage: "",
    uploadDate: "",
    updatedPrice: [],
    subscription: null,
    video: null,
  },
  uploadVideoError: "",


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
  "edit/saveImage",
  async (file, { dispatch, rejectWithValue }) => {
    try {
      const image = await saveImageToStorage(file);
      return image;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const deleteImage = createAsyncThunk(
  "edit/deleteImage",
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

export const editListings = createAsyncThunk(
  "edit/uploadListings",
  async (listing, { rejectWithValue }) => {
    try {
      // Call the uploadListing function to upload the listing
    console.log("EDITINGGGGG",listing)

      const status = await updateListings(listing);
      // Return the ID if successful
      return status;
    } catch (error) {
      // Return the error message if there's an error
      return rejectWithValue(error.message);
    }
  }
);

export const saveVideo = createAsyncThunk(
  "edit/saveVideo",
  async (file, { dispatch, rejectWithValue }) => {
    try {
      const image = await saveVideoToStorage(file);
      return image;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const deleteVideo = createAsyncThunk(
  "edit/deleteVideo",
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


const filterImagesById = (images, path) => {
  return images.filter((image) => image.fullPath !== path);
};

const listingUploadSlice = createSlice({
  name: "edit",
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
    setEditListing: (state, action) => {
      state.currentUpload = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(saveImage.fulfilled, (state, action) => {
        state.currentUpload.images.push(action.payload);
        state.currentUpload.imageUploading = false;
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
      .addCase(editListings.fulfilled, (state, action) => {
        state.currentUpload.uploadMsg = "Listing updated successfully";
        state.currentUpload.uploadError = "";
        state.currentUpload.details = INITIAL_STATE.currentUpload.details;
        state.currentUpload.location = INITIAL_STATE.currentUpload.location;
        state.currentUpload.images = [];
      })
      .addCase(saveVideo.fulfilled, (state, action) => {
        state.currentUpload.video = (action.payload);
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.currentUpload.video = null
      })
      .addCase(saveVideo.rejected, (state, action) => {
        state.uploadVideoError = (action.payload);
      })
    },
});

export const editUploadReducer = listingUploadSlice.reducer;
export const {
  updateDetails,
  setEditListing,
  updateLocation,
  addAmenity,
  clearPrimaryImage,
  updateChosenAmeninites,
  setUploadMsg,
  updatePrimaryImage,
} = listingUploadSlice.actions;

const selectListingUpload = (state) => state.edit;

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
export const selectStage = createSelector(
  [selectListingUpload], // Input selector
  (listingUpload) => listingUpload.currentUpload.stage // Output selector
);
export const selectUpdatedPrice = createSelector(
  [selectListingUpload], // Input selector
  (listingUpload) => listingUpload.currentUpload.updatedPrice // Output selector
);
export const selectUploadDate = createSelector(
  [selectListingUpload], // Input selector
  (listingUpload) => listingUpload.currentUpload.uploadDate // Output selector
);
