"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DetailsPage, Navbar } from "@/components";
import {
  selectAllListings,
  setAllListings,
  selectFilteredListings,
  setLocationFilter,
  selectFilters,
  updateOtherFilter,
} from "@/lib/store/slices/listings.reducer";
import { selectAmenitiesList } from "@/lib/store/slices/listingUpload.reducer";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { BuyersListingContainer } from "@/components";
import { nigerianStatesAndLGAs } from "@/lib/data/location";
import { useSearchParams, useRouter } from "next/navigation";

const stateKeys = Object.keys(nigerianStatesAndLGAs);
const lgaKeys = Object.values(nigerianStatesAndLGAs).flat();

const findItemWithState = (item) => {
  // Convert the item to lowercase
  const lowerCaseItem = item.toLowerCase();

  let filteredAdress = [];

  // Iterate over the object entries to find the matching state and LGA
  if (!item) {
    return ["Enter a state or LGA"];
  }
  for (const [state, lgas] of Object.entries(nigerianStatesAndLGAs)) {
    // Convert each LGA and state to lowercase for case-insensitive comparison
    const lowerCaseState = state.toLowerCase();
    const lowerCaseLGAs = lgas.map((lga) => lga.toLowerCase());
    for (const lga of lowerCaseLGAs) {
      if (lga.includes(lowerCaseItem)) {
        // return `${item}, ${state}`;
        // console.log("hello")
        filteredAdress.unshift(`${lga}, ${state}`);
      }
    }
  }

  // If the item is not found, return a not found message
  return filteredAdress.length ? filteredAdress : ["Not found"];
};

const ListingsPage = () => {
  const dispatch = useAppDispatch();
  const query = useSearchParams();

  const allListings = useAppSelector(selectAllListings);
  const filteredListings = useAppSelector(selectFilteredListings);
  const filters = useAppSelector(selectFilters);
  const amenities = useAppSelector(selectAmenitiesList);
  // const shomoluPlaces = findItemWithState("shom")

  const [showSearchOutput, setShowSearchOutput] = useState(false);
  const [amenitiesOutput, setAmenitiesOutput] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchValue, setsearchValue] = useState("s");
  const [searchOutput, setSearchOutput] = useState([]);
  const [chosenState, setChosenState] = useState("");
  const [chosenLga, setChosenLga] = useState([]);
  const [chosenAmenities, setChosenAmenities] = useState([]);

  const listingSlug = query.get("on");

  const handleChosenLga = (newLga) => {
    setChosenLga((prevLgas) => {
      if (prevLgas.includes(newLga)) {
        // Remove the string from the array if it already exists
        return prevLgas.filter((lga) => lga !== newLga);
      } else {
        // Add the string to the array if it doesn't exist
        return [...prevLgas, newLga];
      }
    });
  };

  const handleChoosenAmen = (amenity) => {
    // setChosenAmenities((prevLgas) => {
    if (filters.amenitiesSelected.includes(amenity)) {
      // Remove the string from the array if it already exists
      dispatch(
        updateOtherFilter({
          key: "amenitiesSelected",
          value: filters.amenitiesSelected.filter((amen) => amen !== amenity),
        })
      );

      // return prevLgas.filter(amen => amen !== amenity);
    } else {
      // Add the string to the array if it doesn't exist

      dispatch(
        updateOtherFilter({
          key: "amenitiesSelected",
          value: [...filters.amenitiesSelected, amenity],
        })
      );

      // return [...prevLgas, amenity];
    }
    // });
  };
  const handleChosenState = (newState) => {
    setChosenState(newState);
  };

  const handleSetLocations = () => {
    dispatch(
      setLocationFilter({
        lga: chosenLga,
        state: chosenState,
      })
    );
    setChosenLga([]);
    setChosenState("");
    setShowSearchOutput(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // setstoredLocation({...storedLocation, [name]: value})
    dispatch(updateOtherFilter({ key: name, value: value }));
  };

  const dispatchAmenities = () => {
    console.log("dispatching amenities");
    dispatch(
      updateOtherFilter({ key: "amenitiesSelected", value: chosenAmenities })
    );
  };

  
  const selectedListing = useMemo(
    () => allListings.find((listing) => listing.slug === listingSlug),
    [allListings, listingSlug]
  );
  
  console.log(listingSlug, selectedListing);
  const places = findItemWithState(searchValue);

  useEffect(() => {
    console.log("filteredListings", filteredListings);
    // console.log("filteredLocations",shomoluPlaces)
  }, [filteredListings]);

  return (
    <div className="page listings-page">
      <Navbar />
      {
        selectedListing? <div className="page-container" > <DetailsPage listing={selectedListing} /> </div>
        :
      <div className="page-container">
        <h1> Apartment Listings</h1>
        <div className="filter" id="desktop">
          <label
            htmlFor="search"
            className="search"
            onClick={() => {
              setShowSearchOutput(true);
            }}
          >
            <img src="/search.svg" alt="" onClick={null} />
            <p>
              {filters.location.state
                ? filters.location.state
                : "search by location"}
            </p>
            <input
              type="text"
              id="search"
              // disabled={true}
              placeholder="search by location"
              onClick={null}
              value={chosenState}
              style={{ display: "none" }}
            />
          </label>

          <label htmlFor="listingType" className="filter-item">
            <img src="/house-icon.svg" alt="" />
            <select
              onChange={handleInputChange}
              name="listingType"
              id="listingType"
            >
              <option value="">Listing type</option>
              <option value={"sell"}>For Sale</option>
              <option value="rent">For Rent</option>
              <option value="shortlet">Shortlet</option>
            </select>
          </label>

          <label htmlFor="propertyType" className="filter-item">
            <img src="/house-icon.svg" alt="" />
            <select
              onChange={handleInputChange}
              name="propertyType"
              id="propertyType"
            >
              <option value="">Property type</option>
              <option value="selfCon">Self Contain</option>
              <option value="flat">Flat</option>
              <option value="duplex">Duplex</option>
            </select>
          </label>

          <label htmlFor="Bedrooms" className="filter-item">
            <img src="/beds.svg" alt="" />
            <select onChange={handleInputChange} name="bedrooms" id="Bedrooms">
              <option value={""}>Number of rooms</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
            </select>
          </label>

          <label htmlFor="Bathrooms" className="filter-item">
            <img src="/bathroom.svg" alt="" />
            <select
              onChange={handleInputChange}
              name="bathrooms"
              id="Bathrooms"
            >
              <option value={""}>Number of baths</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </label>

          <label htmlFor="minMax " className="filter-item">
            <img src="/price-icon.svg" alt="" />
            <select
              onChange={handleInputChange}
              name="minMaxPrice"
              id="minMax "
            >
              <option value={""}>Min-Max price</option>
              <option value={[300000]}>below 300k</option>
              <option value={[300000, 500000]}>300k - 500k</option>
              <option value={[500000, 1000000]}>500k - 1m</option>
              <option value={[1000000, 2000000]}>1m - 2m</option>
              <option value={[2000000, 4000000]}>2m - 4m</option>
              <option value={[4000000]}>4m and above</option>
            </select>
          </label>
          <label
            htmlFor="amenities"
            className="search"
            onClick={() => {
              setAmenitiesOutput(true);
            }}
          >
            <img src="/house-icon.svg" alt="" onClick={null} />
            <p>{"Amenities"}</p>
            <input
              type="text"
              id="amenities"
              // disabled={true}
              placeholder="Amenities"
              onClick={null}
              value={"Gym"}
              style={{ display: "none" }}
            />
          </label>

          {showSearchOutput && (
            <div className="search-output">
              {/* {
                    places.map((place, index) => (
                      <div key={index}>{place}</div>
                    ))
                  } */}

              <div className="locations">
                <div className="header">
                  <h3>
                    {!chosenState
                      ? `Select a state`
                      : `Select LGA's in ${chosenState}`}
                  </h3>
                  <img
                    src="/close.svg"
                    alt=""
                    onClick={() => {
                      setShowSearchOutput(false);
                    }}
                  />
                </div>
                <div className="container">
                  {!chosenState
                    ? stateKeys.map((state, index) => (
                        <div
                          key={index}
                          onClick={() => handleChosenState(state)}
                        >
                          {state}
                        </div>
                      ))
                    : nigerianStatesAndLGAs[chosenState].map((lga, index) => (
                        <div
                          style={{
                            backgroundColor: chosenLga.includes(lga)
                              ? "#e9e9e9"
                              : "",
                          }}
                          key={index}
                          onClick={() => handleChosenLga(lga)}
                        >
                          {lga}
                        </div>
                      ))}
                </div>
                <button
                  onClick={handleSetLocations}
                  className="primary-btn"
                  style={{ marginTop: "16px" }}
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {amenitiesOutput && (
            <div className="search-output">
              <div className="locations">
                <div className="header">
                  <h3>{`Select Amenities`}</h3>
                  <img
                    src="/close.svg"
                    alt=""
                    onClick={() => {
                      setAmenitiesOutput(false);
                    }}
                  />
                </div>
                <div className="container">
                  {amenities.map((amenity, index) => (
                    <div key={index} onClick={() => handleChoosenAmen(amenity)}>
                      {amenity}
                      {filters.amenitiesSelected.includes(amenity) && (
                        <img
                          src="/checked.svg"
                          style={{ marginLeft: "auto" }}
                          alt=""
                        />
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setAmenitiesOutput(false);
                    // dispatchAmenities()
                  }}
                  className="primary-btn"
                  style={{ marginTop: "16px" }}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
        <div id="mobile" className="mobile-filter">
          <label
            htmlFor="search"
            className="search"
            onClick={() => {
              setShowSearchOutput(true);
            }}
          >
            <img src="/search.svg" alt="" onClick={null} />
            <p>
              {filters.location.state
                ? filters.location.state
                : "search by location"}
            </p>
            <input
              type="text"
              id="search"
              // disabled={true}
              placeholder="search by location"
              onClick={null}
              value={chosenState}
              style={{ display: "none" }}
            />
          </label>

          <div
            className="filter-icon"
            onClick={() => {
              setShowMobileFilters((prev) => !prev);
            }}
          >
            <img src="/filter-icon.svg" alt="" />
          </div>

          {showMobileFilters && (
            <div className="filter-options">
              <img
                src="/close.svg"
                className="close"
                alt=""
                onClick={() => {
                  setShowMobileFilters(false);
                }}
              />
              <label htmlFor="listingType" className="filter-item">
                <img src="/house-icon.svg" alt="" />
                <select
                  onChange={handleInputChange}
                  name="listingType"
                  id="listingType"
                >
                  <option value="">Listing type</option>
                  <option value={"sell"}>For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="shortlet">Shortlet</option>
                </select>
              </label>

              <label htmlFor="propertyType" className="filter-item">
                <img src="/house-icon.svg" alt="" />
                <select
                  onChange={handleInputChange}
                  name="propertyType"
                  id="propertyType"
                >
                  <option value="">Property type</option>
                  <option value="selfCon">Self Con</option>
                  <option value="flat">Flat</option>
                  <option value="duplex">Duplex</option>
                </select>
              </label>

              <label htmlFor="Bedrooms" className="filter-item">
                <img src="/beds.svg" alt="" />
                <select
                  onChange={handleInputChange}
                  name="bedrooms"
                  id="Bedrooms"
                >
                  <option value={""}>Number of rooms</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                </select>
              </label>

              <label htmlFor="Bathrooms" className="filter-item">
                <img src="/bathroom.svg" alt="" />
                <select
                  onChange={handleInputChange}
                  name="bathrooms"
                  id="Bathrooms"
                >
                  <option value={""}>Number of baths</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </label>

              <label htmlFor="minMax " className="filter-item">
                <img src="/price-icon.svg" alt="" />
                <select
                  onChange={handleInputChange}
                  name="minMaxPrice"
                  id="minMax "
                >
                  <option value={""}>Min-Max price</option>
                  <option value={[300000]}>below 300k</option>
                  <option value={[300000, 500000]}>300k - 500k</option>
                  <option value={[500000, 1000000]}>500k - 1m</option>
                  <option value={[1000000, 2000000]}>1m - 2m</option>
                  <option value={[2000000, 4000000]}>2m - 4m</option>
                  <option value={[4000000]}>4m and above</option>
                </select>
              </label>
              <label
                htmlFor="amenities"
                className="filter-item"
                onClick={() => {
                  console.log("clicked");
                  setAmenitiesOutput(true);
                }}
              >
                <img
                  src="/house-icon.svg"
                  alt=""
                  style={{ marginRight: "16px" }}
                  onClick={null}
                />
                <p>{"Amenities"}</p>
                <input
                  type="text"
                  id="amenities"
                  // disabled={true}
                  placeholder="Amenities"
                  onClick={null}
                  value={"Gym"}
                  style={{ display: "none" }}
                />
              </label>
              <button
                onClick={() => {
                  setShowMobileFilters(false);
                }}
                className="primary-btn"
                style={{ marginTop: "16px" }}
              >
                Done
              </button>
            </div>
          )}

          {showSearchOutput && (
            <div className="search-output">
              {/* {
                  places.map((place, index) => (
                    <div key={index}>{place}</div>
                  ))
                } */}

              <div className="locations">
                <div className="header">
                  <h3>
                    {!chosenState
                      ? `Select a state`
                      : `Select LGA's in ${chosenState}`}
                  </h3>
                  <img
                    src="/close.svg"
                    alt=""
                    onClick={() => {
                      setShowSearchOutput(false);
                    }}
                  />
                </div>
                <div className="container">
                  {!chosenState
                    ? stateKeys.map((state, index) => (
                        <div
                          key={index}
                          onClick={() => handleChosenState(state)}
                        >
                          {state}
                        </div>
                      ))
                    : nigerianStatesAndLGAs[chosenState].map((lga, index) => (
                        <div
                          style={{
                            backgroundColor: chosenLga.includes(lga)
                              ? "#e9e9e9"
                              : "",
                          }}
                          key={index}
                          onClick={() => handleChosenLga(lga)}
                        >
                          {lga}
                        </div>
                      ))}
                </div>
                <button
                  onClick={handleSetLocations}
                  className="primary-btn"
                  style={{ marginTop: "16px" }}
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {amenitiesOutput && (
            <div className="search-output">
              <div className="locations">
                <div className="header">
                  <h3>{`Select Amenities`}</h3>
                  <img
                    src="/close.svg"
                    alt=""
                    onClick={() => {
                      setAmenitiesOutput(false);
                    }}
                  />
                </div>
                <div className="container">
                  {amenities.map((amenity, index) => (
                    <div key={index} onClick={() => handleChoosenAmen(amenity)}>
                      {amenity}
                      {chosenAmenities.includes(amenity) && (
                        <img
                          src="/checked.svg"
                          style={{ marginLeft: "auto" }}
                          alt=""
                        />
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setAmenitiesOutput(false);
                    dispatchAmenities();
                  }}
                  className="primary-btn"
                  style={{ marginTop: "16px" }}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
        <div style={{ width: "100%" }}>
          <BuyersListingContainer listings={filteredListings} />
        </div>
      </div>
      }
    </div>
  );
};

export default ListingsPage;
