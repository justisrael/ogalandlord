"use client";
import React, { useEffect } from "react";
import Link from "next/link";

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import {
  selectUploadedListings,
  fetchUploadedListings,
} from "@/lib/store/slices/listingUpload.reducer";

import { fetchAllUnverifiedListings } from "@/lib/firebase/firebase.utils";

import { fetchUnverifiedListings, selectUnverfiedListings } from "@/lib/store/slices/admin.reducer";
import { ListingsDashboard, ListingsStats } from "@/components";

const Dashboard = () => {
  const dispatch = useAppDispatch();

  const uploadedListings = useAppSelector(selectUnverfiedListings);
  console.log(uploadedListings)



  useEffect(() => {
    // if(!uploadedListings.length > 0){
    dispatch(fetchUnverifiedListings());
    // }
  }, []);

  const getlistingStages = (stage) => {
    const listingInStage = uploadedListings?.filter(
      (listing) => listing.stage === stage
    );
    return listingInStage.length;
  };

  const getListingStats = () => {
    return {
      uploaded: uploadedListings?.length,
      active: getlistingStages("active"),
      inReview: getlistingStages("review"),
      declined: getlistingStages("declined"),
    };
  };

  return (
    <div className="dashboard-home">
      <div className="intro-stats">
        <div className="top-row">
          <div className="user-intro">
            <span>Your Property Informations</span>
          </div>
        </div>
        <ListingsStats {...getListingStats()} />
        
      </div>

      <ListingsDashboard listings={uploadedListings} home={true} />
    </div>
  );
};

export default Dashboard;
