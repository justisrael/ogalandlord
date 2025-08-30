"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { setCartListing } from "@/lib/store/slices/listingUpload.reducer";
import { useAppDispatch } from "@/lib/store/hooks";

const SPropertyCard = ({ listing, stage = "active" }) => {
  const router = useRouter();

  const getPrimaryImage = () => {
    return (
      listing.images.find((image) => image.fullPath === listing.primaryImage) ||
      listing.images[0]
    );
  };

  const dispatch = useAppDispatch();

  const imageStyles = {
    background: `url(${getPrimaryImage(listing.primaryImage).url})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const getStatusColor = (status = listing.stage) => {
    switch (status.toLowerCase()) {
      case "review":
        return "#FFD700";
      case "active":
        return "#18BB48";
      case "declined":
        return "#FF0303";
      default:
        return "gray"; // Default color if status doesn't match any case
    }
  };

  const formatPrice = (price) => {
    // Remove any non-numeric characters except for the decimal point
    const cleanedPrice = price.replace(/[^0-9.]/g, "");

    // Split the integer and decimal parts
    const [integerPart, decimalPart] = cleanedPrice.split(".");

    // Format the integer part with commas
    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    );

    // Reassemble the price with the formatted integer part and decimal part
    return decimalPart
      ? `${formattedIntegerPart}.${decimalPart}`
      : formattedIntegerPart;
  };

  const navigate = (x) => router.push(x);

  return (
    <div
      className="property-card"
      onClick={() => {
        if (stage === "active") {
          navigate(`/dashboard/listings?listing=${listing.id}`);
        }
      }}
    >
      <div className="property-card__image" style={imageStyles} />
      <div className="property-card__content">
        <div className="property-card__price">
          <span>₦{formatPrice(listing.details.price)}</span> per month
        </div>
        <div className="property-card__title">
          <span
            style={{ backgroundColor: getStatusColor() }}
            className="property-card__indicator"
          ></span>{" "}
          {listing.details.title}
        </div>
        <div className="property-card__location">
          <span role="img" aria-label="location">
            <img src="/location.svg" alt="" />
          </span>{" "}
          {listing.location.address}, {listing.location.state}
        </div>
        <div className="property-card__details">
          <div>
            <span role="img" aria-label="bed">
              <img src="/beds.svg" alt="" />
            </span>{" "}
            {listing.details.bedrooms} Beds
          </div>
          <div>
            <span role="img" aria-label="toilet">
              <img src="/baths.svg" alt="" />
            </span>{" "}
            {listing.details.baths} Baths
          </div>
        </div>
        {
          stage !== "active" && (

        <div className="property-card__btns">
          <button
            className="pri"
            onClick={() => {
                navigate(`/dashboard/listings?listing=${listing.id}`);
            }}
          >
            View
          </button>
          <button className="sec" 
          onClick={() => {
            dispatch(setCartListing(listing))

            navigate("/dashboard/listings/pricing");
          }
          }
          >Proceed to Payment</button>
        </div>
          )
        }
      </div>
    </div>
  );
};

export default SPropertyCard;
