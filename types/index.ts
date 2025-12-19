export interface User {
  id: string;
  email: string;
  displayName?: string | null;
  phoneNumber?: string | null;
  photoURL?: string | null;
  createdAt?: string | Date; // Firebase Timestamp or string
  // Add other fields from createUserDocumentFromAuth
}

export interface Location {
  address: string;
  state: string;
  lga: string;
}

export interface ListingDetails {
  description: string;
  title: string;
  furnished: string; // Consider union type: 'Yes' | 'No' | 'Partially'
  propertyType: string;
  bedrooms: string | number;
  baths: string | number;
  amenities: string[];
  price: number | string;
  paymentType: string;
  priceNegotiable: string | boolean; // Currently string 'false' in reducer
}

export interface ListingImage {
  fullPath: string;
  url?: string;
  // Add other properties if your image object is more complex
}

export interface Listing {
  id?: string;
  location: Location;
  details: ListingDetails;
  images: ListingImage[] | string[];
  primaryImage: string;
  video?: string | null;
  uploadedBy?: string; // email or userId
  uploadDate?: string | Date;
  stage?: 'active' | 'inActive' | 'deleted';
  subscription?: ListingSubscription | null;
  updatedPrice?: any[];
}

export interface ListingSubscription {
  paymentLink?: string;
  plan?: string;
  status?: string;
  // ...other subscription fields
}

export interface Transaction {
  id?: string;
  listingId: string;
  userId: string;
  amount: number;
  plan: string;
  duration: string;
  paidAt: string;
  reference: string;
  status: 'success' | 'failed' | 'pending';
  createdAt?: any;
}

export interface ListingFilter {
  location: {
    lga: string[];
    state: string;
  };
  listingType: string;
  propertyType: string;
  minMaxPrice: string;
  bedrooms: string;
  bathrooms: string;
  amenitiesSelected: string[];
}
