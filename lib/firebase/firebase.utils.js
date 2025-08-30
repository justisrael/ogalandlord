import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
  arrayUnion,
  updateDoc,
  deleteDoc,
  where,
} from "firebase/firestore";
import { v4 as uuid } from "uuid"; // Import the uuid function

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getMetadata,
} from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyAG1ew8X82DV6U7yT-8l6SVOfhkSjP8JYg",
//   authDomain: "marshalproverbs.firebaseapp.com",
//   projectId: "marshalproverbs",
//   storageBucket: "marshalproverbs.appspot.com",
//   messagingSenderId: "152386387464",
//   appId: "1:152386387464:web:dcfd52996076e969439bbd"
// };
const firebaseConfig = {
  apiKey: "AIzaSyBfEm2cI9XRAv-Y9pwNhQuNDyhXbS8O7Mo",
  authDomain: "ogalandlord-afe9d.firebaseapp.com",
  projectId: "ogalandlord-afe9d",
  storageBucket: "ogalandlord-afe9d.appspot.com",
  messagingSenderId: "758303739722",
  appId: "1:758303739722:web:d4a4ba27f7b3e522ee7bb3",
};

const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();
// export const signInWithGooglePopup = () =>
//   signInWithPopup(auth, googleProvider);
// export const signInWithGoogleRedirect = () =>
//   signInWithRedirect(auth, googleProvider);

export const db = getFirestore();
const storage = getStorage();

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  console.log("this is user AUTH", userAuth);
  if (!userAuth) return;

  const userDocRef = doc(db, "users", userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);
  // console.log("This is user snapshot",userSnapshot)

  if (!userSnapshot.exists()) {
    const { email, photoURL, phoneNumber, displayName } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        email,
        createdAt,
        phoneNumber,
        photoURL: {
          url: photoURL,
        },
        fullName: displayName,
        contactName: displayName,
        contactEmail: email,

        ...additionalInformation,
      });

      return {
        email,
        createdAt,
        ...additionalInformation,
        ...userSnapshot.data(),
        id: userAuth.uid,
      };
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  } else {
    return { ...userSnapshot.data(), id: userAuth.uid };
  }

  // console.log (userSnapshot.data());
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  // console.log('we got here, firebase', email, password)
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGooglePopup = async () => {
  try {
    const { user } = await signInWithPopup(auth, googleProvider);
    return user;
  } catch (e) {
    console.log("error: ", e);
  }
};
// console.log(auth)

export const signInWithGoogleRedirect = async () => {
  try {
    const { user } = await signInWithRedirect(auth, googleProvider);
    return user;
  } catch (e) {
    console.log("error: ", e);
  }
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (userAuth) => {
        unsubscribe();
        resolve(userAuth);
      },
      reject
    );
  });
};

export const saveImageToStorage = async (file) => {
  const id = `images/${uuid()}`;
  const imageRef = ref(storage, id);

  const snapshot = await uploadBytes(imageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  const metadata = await getMetadata(snapshot.ref);

  console.log(metadata);
  return {
    url: downloadURL,
    id,
    fullPath: metadata.fullPath,
    name: metadata.name,
  };
};

export const saveVideoToStorage = async (file) => {
  const id = `videos/${uuid()}`;
  const imageRef = ref(storage, id);

  const snapshot = await uploadBytes(imageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  const metadata = await getMetadata(snapshot.ref);

  console.log(metadata);
  return {
    url: downloadURL,
    id,
    fullPath: metadata.fullPath,
    name: metadata.name,
  };
};

export const deleteImageFromStorage = async (path) => {
  // console.log(path, "PATHHHH!!!")
  try {
    const desertRef = ref(storage, path);
    await deleteObject(desertRef);
    // File deleted successfully
  } catch (error) {
    // Uh-oh, an error occurred!
    console.error(error);
  }
};

export const deleteOldAndSaveNew = async (path, file) => {
  try {
    // If a path is provided, delete the old image
    if (path) {
      await deleteImageFromStorage(path);
    }

    // Save the new file
    const newImageData = await saveImageToStorage(file);

    // Return the new image data
    return newImageData;
  } catch (error) {
    console.error("Error deleting old and saving new image:", error);
    throw error; // Rethrow the error to handle it outside of the function
  }
};

export const uploadListing = async (listing) => {
  try {
    // Generate a unique ID for the listing
    const id = uuid();

    // Reference to the Firestore document
    const docRef = doc(db, "listings", id);

    const newData = { ...listing, id: id };
    console.log(newData);

    // Set the document with the listing data
    await setDoc(docRef, newData);

    // Return the unique ID if successful
    return id;
  } catch (error) {
    console.error("Error uploading listing: ", error);
    throw error;
  }
};

export const fetchListingsByEmail = async (email) => {
  try {
    const listingsCollection = collection(db, "listings"); // Replace 'db' with your Firestore instance

    // Query 1: Get all listings
    const listingsSnapshot = await getDocs(listingsCollection);

    // Query 2: Filter listings based on contact.email
    const filteredListings = listingsSnapshot.docs.filter((doc) => {
      return doc.data().contact && doc.data().contact.id === email;
    });

    // Return the filtered listings
    const fetchedData = filteredListings.map((doc) => doc.data());

    return fetchedData.filter((doc) => doc.stage !== "deleted");
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error; // Re-throw the error to handle it at a higher level
  }
};

export const fetchListingBySlug = async (slug) => {
  try {
    const listingsCollection = collection(db, "listings"); // Replace 'db' with your Firestore instance

    // Query 1: Get all listings
    const listingsSnapshot = await getDocs(listingsCollection);

    // Query 2: Filter listings based on contact.email
    const filteredListings = listingsSnapshot.docs.filter((doc) => {
      return doc.data().contact && doc.data().slug === slug;
    });

    // Return the filtered listings
    const fetchedData = filteredListings.map((doc) => doc.data());

    return fetchedData.filter((doc) => doc.stage === "active")[0];
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error; // Re-throw the error to handle it at a higher level
  }
};

export const fetchAllActiveListings = async () => {
  function hasPeriodPassed(startDateStr, period) {
    if (typeof startDateStr !== "string" || typeof period !== "string") {
      // console.log("out");
      return false;
    }

    const startDate = new Date(startDateStr);
    if (isNaN(startDate.getTime())) {
      // console.log("out");
      return false; // invalid date
    }

    const now = new Date();
    let threshold = new Date(startDate);

    switch (period.toLowerCase()) {
      case "yearly":
        threshold.setFullYear(threshold.getFullYear() + 1);
        break;
      case "monthly":
        threshold.setMonth(threshold.getMonth() + 1);
        break;
      case "weekly":
        threshold.setDate(threshold.getDate() + 7);
        break;
      default:
        return false; // invalid period
    }
    console.log(now > threshold);
    return now > threshold;
  }

  function sortByPlan(listings) {
    const order = {
      premium: 1,
      standard: 2,
      basic: 3,
    };

    return listings.sort((a, b) => {
      const planA = a.subscription?.plan?.toLowerCase() || "";
      const planB = b.subscription?.plan?.toLowerCase() || "";
      return (order[planA] || 4) - (order[planB] || 4);
    });
  }

  try {
    const listingsCollection = collection(db, "listings"); // Replace 'db' with your Firestore instance

    // Query 1: Get all listings
    const listingsSnapshot = await getDocs(listingsCollection);

    // Query 2: Filter listings based on contact.email
    // const filteredListings = listingsSnapshot.docs.filter(doc => {
    //   return doc.data().contact && doc.data().contact.id === email;
    // });

    // Return the filtered listings
    const fetchedData = listingsSnapshot.docs.map((doc) => doc.data());

    console.log(fetchedData.length);

    const liveData = fetchedData.filter(
      (listing) =>
        listing.subscription &&
        !hasPeriodPassed(
          listing.subscription?.start,
          listing.subscription?.billingPeriod
        )
    );
    console.log(liveData.length);

    return sortByPlan(liveData);
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error; // Re-throw the error to handle it at a higher level
  }
};

export const fetchAllUnverifiedListings = async () => {
  try {
    const listingsCollection = collection(db, "listings"); // Replace 'db' with your Firestore instance

    // Query 1: Get all listings
    const listingsSnapshot = await getDocs(listingsCollection);

    // Query 2: Filter listings based on contact.email
    // const filteredListings = listingsSnapshot.docs.filter(doc => {
    //   return doc.data().contact && doc.data().contact.id === email;
    // });

    // Return the filtered listings
    const fetchedData = listingsSnapshot.docs.map((doc) => doc.data());

    // return fetchedData.filter((doc) => doc.stage === "review");
    return fetchedData
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error; // Re-throw the error to handle it at a higher level
  }
};

export const fetchAllActiveListingsSlug = async () => {
  try {
    const listingsCollection = collection(db, "listings"); // Replace 'db' with your Firestore instance

    // Query 1: Get all listings
    const listingsSnapshot = await getDocs(listingsCollection);

    // Query 2: Filter listings based on contact.email
    // const filteredListings = listingsSnapshot.docs.filter(doc => {
    //   return doc.data().contact && doc.data().contact.id === email;
    // });

    // Return the filtered listings
    const fetchedData = listingsSnapshot.docs.map((doc) => doc.data());

    const activeData = fetchedData.filter((doc) => doc.stage === "active");

    return activeData.map((doc) => doc.slug);
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error; // Re-throw the error to handle it at a higher level
  }
};

export const fetchAllUnverifiedUsers = async () => {
  try {
    const usersCollection = collection(db, "users"); // Replace 'db' with your Firestore instance

    const usersSnapshot = await getDocs(usersCollection);

    const fetchedData = usersSnapshot.docs.map((doc) => doc.data());

    //Filter out the users that are not verified and haven't submitted their NIN

    const unverifiedData = fetchedData.filter((doc) => doc.verified === false);
    const submittedNinData = unverifiedData.filter((doc) =>
      doc.NIN.hasOwnProperty("id")
    );

    return submittedNinData;
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
};

export const fetchUserByEmail = async (email) => {
  console.log(email);
  try {
    const usersCollection = collection(db, "users"); // Replace 'db' with your Firestore instance

    // Query to find user by email
    const userQuery = query(usersCollection, where("email", "==", email));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      throw new Error(`No user found`);
    }

    // Assuming there should be only one user with a unique email
    const userData = userSnapshot.docs[0].data();

    return userData;
  } catch (error) {
    console.error("Error fetching user:");
    throw error; // Re-throw the error to handle it at a higher level
  }
};

export const updateUser = async (user) => {
  console.log(user);
  // return true
  try {
    // Reference to the Firestore document
    const docRef = doc(db, "users", user.id);
    await updateDoc(docRef, user);
    return true;
  } catch (error) {
    console.error("Error updating user: ", error);
    throw error; // Re-throw the error to handle it at a higher level
  }
};

export const updateListings = async (listing) => {
  // console.log(listing)
  try {
    // Reference to the Firestore document
    const docRef = doc(db, "listings", listing.id);
    await updateDoc(docRef, listing);
    return true;
  } catch (error) {
    console.error("Error updating listing: ", error);
    throw error; // Re-throw the error to handle it at a higher level
  }
};

export const updateUsers = async (user) => {
  // console.log(user)
  try {
    // Reference to the Firestore document
    const docRef = doc(db, "users", user.id);
    await updateDoc(docRef, user);
    return true;
  } catch (error) {
    console.error("Error updating listing: ", error);
    throw error; // Re-throw the error to handle it at a higher level
  }
};

export const markListingAsDeleted = async (id) => {
  console.log(`Marking listing with id: ${id} as deleted`);
  try {
    // Reference to the Firestore document
    const docRef = doc(db, "listings", id);

    // Update the stage property to "deleted"
    await updateDoc(docRef, { stage: "deleted" });

    console.log(`Listing with id ${id} marked as deleted.`);
    return true;
  } catch (error) {
    console.error("Error marking listing as deleted: ", error);
    throw error; // Re-throw the error to handle it at a higher level
  }
};

export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    // Display a success message to the user
    console.log("Password reset email sent successfully.");
    // Optionally, redirect the user to a confirmation page
  } catch (error) {
    // Handle errors, such as invalid email address or network issues
    console.error("Error sending password reset email:", error);
    // Display an error message to the user
    throw error;
  }
};

// TRANSACTIONS
export const saveTransaction = async ({
  userId,
  listingId,
  plan,
  duration,
  paidAt,
  amount,
  reference,
  status,
}) => {
  try {
    // Check if transaction with reference already exists
    const transactionsCollection = collection(db, "transactions");
    const q = query(
      transactionsCollection,
      where("reference", "==", reference)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      // Transaction with this reference already exists
      return false;
    }

    // If not, create new transaction
    const id = uuid();
    const docRef = doc(db, "transactions", id);
    const transactionData = {
      id,
      userId,
      listingId,
      plan,
      duration,
      paidAt,
      amount,
      reference,
      status,
    };
    await setDoc(docRef, transactionData);
    return true;
  } catch (error) {
    console.error("Error saving transaction:", error);
    throw error;
  }
};

export const fetchTransactionsByUserId = async (userId) => {
  try {
    const transactionsCollection = collection(db, "transactions");
    const q = query(transactionsCollection, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error fetching transactions by userId:", error);
    throw error;
  }
};

export const fetchAllTransactions = async () => {
  try {
    const transactionsCollection = collection(db, "transactions");
    const snapshot = await getDocs(transactionsCollection);
    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    throw error;
  }
};
