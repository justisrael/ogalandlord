"use client";
import React, { useEffect } from "react";
import Link from "next/link";

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { selectCurrentUser } from "@/lib/store/slices/user.reducer";
import {
  selectUploadedListings,
  fetchUploadedListings,
} from "@/lib/store/slices/listingUpload.reducer";

import { ListingsDashboard, ListingsStats } from "@/components";

const Dashboard = () => {
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(selectCurrentUser);
  const uploadedListings = useAppSelector(selectUploadedListings);

  function isFutureDate(value) {
    // must be a non-empty string
    if (typeof value !== "string" || !value) {
      return false;
    }

    const date = new Date(value);
    // check if valid date
    if (isNaN(date.getTime())) {
      return false;
    }

    const now = new Date();
    return date > now;
  }

  function hasPeriodPassed(startDateStr, period) {
    if (typeof startDateStr !== "string" || typeof period !== "string") {
      return false;
    }

    const startDate = new Date(startDateStr);
    if (isNaN(startDate.getTime())) {
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

    return now > threshold;
  }

  const activeListings = React.useMemo(
    () =>
      uploadedListings.filter((listing) =>( listing.subscription &&
        !hasPeriodPassed(listing.subscription?.start, listing.subscription?.billingPeriod))
      ),
    [uploadedListings]
  );

  const inActiveListings = React.useMemo(
    () =>
      uploadedListings.filter(
        (listing) => ( !listing.subscription || hasPeriodPassed(listing.subscription?.start, listing.subscription?.billingPeriod))
      ),
    [uploadedListings]
  );

  const { fullName, email, contactEmail, id } = currentUser;
  const getFirstName = (fullName) => fullName.split(" ")[0];

  useEffect(() => {
    // if(!uploadedListings.length > 0){
    dispatch(fetchUploadedListings(id));
    // }
  }, []);

  const getlistingStages = (stage) => {
    const listingInStage = uploadedListings.filter(
      (listing) => listing.stage === stage
    );
    return listingInStage.length;
  };

  const getListingStats = () => {
    return {
      uploaded: uploadedListings.length,
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
            <h4>Welcome, {getFirstName(fullName)}</h4>
            <span>Your Property Informations</span>
          </div>
          <div id="desktop">
            <Link href={"/dashboard/listings/upload"}>
              <button className="btn-link">
                {" "}
                <img src="/upload.svg" /> Upload a Property
              </button>
            </Link>
          </div>
        </div>
        <ListingsStats {...getListingStats()} />
        <div id="mobile" style={{ marginTop: "64px", width: "100%" }}>
          <Link href={"/dashboard/listings/upload"} style={{ width: "100%" }}>
            <button className="btn-link">
              {" "}
              <img src="/upload.svg" /> Upload a Property
            </button>
          </Link>
        </div>
      </div>

      {inActiveListings.length > 0 && (
        <ListingsDashboard
          listings={inActiveListings}
          home={true}
          stage="inActive"
        />
      )}

      <ListingsDashboard listings={activeListings} home={true} />
    </div>
  );
};

export default Dashboard;
