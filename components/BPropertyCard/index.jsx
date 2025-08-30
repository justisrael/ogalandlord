"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { selectUploadedListings } from "@/lib/store/slices/listingUpload.reducer";
// import { formatDate } from '@/lib/others/custom.functions'

const SPropertyCard = ({ listing }) => {
  const router = useRouter();
  const uploadedListings = useAppSelector(selectUploadedListings);

  const getPrimaryImage = () => {
    return (
      listing.images.find((image) => image.fullPath === listing.primaryImage) ||
      listing.images[0]
    );
  };

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

  const formatDate = (dateString) => {
    console.log(dateString)
    const dateObj = new Date(dateString);

    const now = new Date();
    const hoursAgo = Math.floor((now - dateObj) / (1000 * 60 * 60));

    const isToday = now.toDateString() === dateObj.toDateString();
    const isYesterday =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1
      ).toDateString() === dateObj.toDateString();

    if (isToday) {
      return hoursAgo === 0 ? "Just now" : `${hoursAgo} hours ago`;
    } else if (isYesterday) {
      return "Yesterday";
    } else {
      const day = dateObj.getDate();
      const month = dateObj.toLocaleString("default", { month: "long" });
      const year = dateObj.getFullYear();
      const currentYear = now.getFullYear();

      const suffix = (day) => {
        if (day > 3 && day < 21) return "th";
        switch (day % 10) {
          case 1:
            return "st";
          case 2:
            return "nd";
          case 3:
            return "rd";
          default:
            return "th";
        }
      };

      const formattedDate = `${day}${suffix(day)} ${month}`;
      return currentYear !== year ? `${formattedDate} ${year}` : formattedDate;
    }
  };

  const navigate = (x) => router.push(x);

  const handleSelectedListing = (x) => {
    console.log(uploadedListings)
  };

  return (
    <a
      className="b-property-card"
      // onClick={() => handleSelectedListing(listing.slug)}
      href={`/listings?on=${listing.slug}`}
    >
      <div className="property-card__image" style={imageStyles} />
      <div className="property-card__content">
        <div className="property-card__price">
          <span>₦{formatPrice(listing.details.price)}</span>{" "}
          {listing.details.paymentType}
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
        <div className="contact-tag">
          <div className="id">
            <div
              className="img"
              style={{
                backgroundImage: `url(${listing.contact?.url?.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                overflow: "hidden",
                // display: "flex",
                // justifyContent: "center",
                // alignItems: "center"
              }}
            />
            <p>{listing.contact.name}</p>
          </div>
        </div>
        <div className="date">
          <p>Added {formatDate(listing.subscription?.start)}</p>
        </div>
      </div>
    </a>
  );
};

export default SPropertyCard;
