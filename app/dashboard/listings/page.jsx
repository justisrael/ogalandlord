"use client"

import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { selectUploadedListings, fetchUploadedListings } from '@/lib/store/slices/listingUpload.reducer';
import { useSearchParams, useRouter } from 'next/navigation';
import { selectCurrentUser } from '@/lib/store/slices/user.reducer';



import { ListingsDashboard, SpropertyPage } from '@/components';
import { toast, ToastContainer } from 'react-toastify';

const Listings = () => {
  const query = useSearchParams();
  const router = useRouter()
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(selectCurrentUser);


  const { fullName, email, contactEmail, id } = currentUser;


  const uploadedListings = useAppSelector(selectUploadedListings);

  const activeListings = React.useMemo(
    () => uploadedListings.filter(listing => listing.stage === "active"),
    [uploadedListings]
  );

  const inActiveListings = React.useMemo(
    () => uploadedListings.filter(listing => !listing.stage === "active"),
    [uploadedListings]
  );

  const listingId = query.get("listing");

  const listing = listingId && uploadedListings.find(listing => listing.id === listingId)

  useEffect(() => {
    if(!listing){
      router.push("/dashboard/listings")
      // toast.success("Listing not found.")

    }
  }, [listing, router])

  useEffect(() => {
    console.log(activeListings)
  }, [activeListings])

  
  useEffect(() => {
    // if(!uploadedListings.length > 0){
      dispatch(fetchUploadedListings(id))
    // }
  }, []);

  return (
    <div className='s-listings-page' >
      {
        listing? <SpropertyPage listing={listing} /> 
        :

      <ListingsDashboard listings={uploadedListings} home={false} />
      }
      {/* <ToastContainer /> */}

    </div>
  )
}

export default Listings