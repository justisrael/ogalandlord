"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { setEditListing } from "@/lib/store/slices/listingEdit.reducer";
import { deleteListing } from "@/lib/store/slices/listingUpload.reducer";
import { selectCurrentUser } from "@/lib/store/slices/user.reducer";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { BuyersListingContainer, BPropertyCard } from "..";
import { useRouter } from "next/navigation";
import { selectFilteredListings } from "@/lib/store/slices/listings.reducer";

const DetailsPage = ({ listing, slug }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const thumbnailContainerRef = useRef();
  const filteredListings = useAppSelector(selectFilteredListings);

  const [mainImage, setMainImage] = useState(0);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [showContact, setShowContact] = useState(0);

  const currentUser = useAppSelector(selectCurrentUser);

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
  const [options, setOptions] = useState(false);

  const getPrimaryImage = useCallback(() => {
    return (
      listing.images.find((image) => image.fullPath === listing.primaryImage) ||
      listing.images[0]
    );
  }, [listing.images, listing.primaryImage]);

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

  const renderListItems = (array) => {
    let listItems = [];

    if (array.length === 1) {
      listItems = Array(3).fill("");
    } else if (array.length === 2) {
      listItems = Array(2).fill("");
    } else if (array.length === 3) {
      listItems = Array(1).fill("");
    } else {
      listItems = Array(0).fill("");
    }

    return listItems.map((item, index) => <li key={index}>{item}</li>);
  };

  const startEditing = () => {
    dispatch(setEditListing(listing));
    router.push(`/dashboard/listings/edit?listing=${listing.id}`);
  };

  const handleDeleteListing = () => {
    dispatch(
      deleteListing({
        email: currentUser.email,
        id: listing.id,
      })
    );
    setOptions(false);
  };

  useEffect(() => {
    // Calculate 100vw - 40px
    setMainImage(getPrimaryImage().url);
  }, [getPrimaryImage]);

  const handleMouseEnterThumbnail = (url, index) => {
    setMainImage(url);
    setMainImageIndex(index);
  };

  const modifyString = (str) => {
    const firstCharRemoved = str.substring(1); // Remove the first character
    const prefix = "234"; // Define the prefix
    const result = prefix.concat(firstCharRemoved); // Concatenate the prefix with the remaining string
    return result; // Return the final result
  };

  //href={`whatsapp://send?text=Hi,%20I%20will%20like%20to%20get%20more%20information%20on%20this%20property%20you%20listed%20on%20OgaLandLord%20https://ogalandlord.vercel.app/listings/property/${listing.slug}&phone=${modifyString(listing.contact.phone)}`} className="whatsapp-btn">WhatsApp

  const getFirstSixElements = (arr) => {
    console.log(arr);
    const data = arr;
    data.length > 6 ? data.slice(0, 6) : data;
  };

  const filterBySlug = (arr, slug) =>
    slug ? arr.filter((item) => item.slug !== slug) : arr;

  return (
    <div className="b-property-page">
      <div className="header">
        <a href="/listings" className="back">
          <img src="/left-back.svg" alt="Back" />
          Back
        </a>
        <div className="heading">
          <div className="intro">
            <h1>{listing.details.title}</h1>
            <p className="location">
              <img src="/location.svg" alt="Location" className="icon" />
              Ikeja, Lagos
            </p>
          </div>
          {/* <div className="buttons">
            <button onClick={null}>
              <img src="/save.svg" /> Save
            </button>
            <div
              className="more-options"
              id="mobile"
              onClick={() => {
                setOptions((prev) => !prev);
              }}
              style={{
                border: options ? "2px solid #88b6f3" : "1px solid #ddd",
              }}
            >

              {options && (
                <div className="options">
                  <span onClick={null}>
                    <img src="/save.svg" alt="" />
                    Save
                  </span>
                </div>
              )}
            </div>
          </div> */}
        </div>
      </div>

      <div className="content">
        <div className="gallery">
          <div className="main-image">
            <img src={mainImage} alt="Main property" />
          </div>
          <div className="thumbnail-images">
            {listing.images.map((image, index) => (
              <div
                key={index}
                className={`thumbnail ${
                  index === mainImageIndex ? "active" : ""
                }`}
                style={{
                  backgroundImage: `url(${image.url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onClick={() => handleMouseEnterThumbnail(image.url, index)}
              />
            ))}
          </div>
        </div>

        <div className="desc">
          <div className="specifics">
            <span>
              <img src="/beds.svg" alt="" />
              {listing.details.bedrooms} bed(s)
            </span>
            <span>
              <img src="/baths.svg" alt="" />
              {listing.details.baths} bath(s)
            </span>
          </div>
          <h2>Property Overview</h2>
          <p>{listing.details.description}</p>
        </div>

        <div className="details">
          <p className="price">
            <b style={{ fontSize: "42px" }}>₦</b>
            {formatPrice(listing.details.price)}{" "}
            <span>{listing.details.paymentType}</span>{" "}
          </p>
          {/* <div className="specifics">
                <span>
                    <img src="/beds.svg" alt="" />
                    {listing.details.bedrooms} bed(s)
                </span>
                <span>
                    <img src="/baths.svg" alt="" />
                    {listing.details.baths} bath(s)
                </span>
                </div> */}
        </div>

        <div className="amenities">
          <h2>Amenities</h2>
          <ul className="amenities-list">
            {listing.details.amenities.map((amenity, index) => (
              <li key={index} className="amenity-item">
                {amenity}
              </li>
            ))}

            {renderListItems(listing.details.amenities)}
          </ul>
        </div>

        <div className="video-cont">
          {listing.video && (
            <>
              <video controls>
                <source src={listing.video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </>
          )}
        </div>
      </div>
      <div className="contact">
        <div className="contact-cont">
          <div className="agent-card">
            <div className="agent-header">
              <div className="id">
                <div
                  className="img"
                  style={{
                    backgroundImage: `url(${listing.contact?.url?.url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "50%",
                    width: "60px",
                    height: "60px",
                    overflow: "hidden",
                    aspectRatio: "1/1",
                    // display: "flex",
                    // justifyContent: "center",
                    // alignItems: "center"
                  }}
                />
                <div className="text">
                  <p>{listing.contact.name}</p>

                  <a href="#" className="view-more">
                    View more properties from Israel ventures
                  </a>
                </div>
              </div>

              {/* <h3>Israel Ventures</h3> */}
            </div>
            <div className="agent-contact">
              {showContact ? (
                <button
                  className="phone-btn"
                  onClick={() => setShowContact((prev) => !prev)}
                >
                  {listing.contact.phone}
                </button>
              ) : (
                <button
                  className="phone-btn"
                  onClick={() => setShowContact((prev) => !prev)}
                >
                  +234xxxxxxxxxx (show)
                </button>
              )}

              <a
                target="_blank"
                href={`whatsapp://send?text=Hi&phone=${modifyString(
                  listing.contact.phone
                )}`}
                className="whatsapp-btn"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div className="safety-tips-card">
            <h4>Safety Tips</h4>
            <ul>
              <li>
                1. Do not pay an inspection fee without seeing the House owner
                and property.
              </li>
              <li>
                2. Pay any fee or any upfront payment after you verify from the
                Landlord.
              </li>
              <li>3. Ensure you meet the House owner in an open location.</li>
              <li>
                4. The House owner does not represent Oga Landlord and Oga
                Landlord is not liable for any monetary transaction between you
                and the House owner.
              </li>
              <li>5. Make payment only when you are satisfied.</li>
            </ul>
          </div>
        </div>
        {/* <h1>CONTACT</h1> */}
      </div>
      <div
        className="other-listings"
        style={{ marginTop: "70px", fontSize: "20px" }}
      >
        <h4>Other Available Listings</h4>
        <BuyersListingContainer
          listings={filteredListings
            .filter((item) => item.slug !== slug)
            .slice(0, 6)}
        />
      </div>
    </div>
  );
};

export default DetailsPage;
