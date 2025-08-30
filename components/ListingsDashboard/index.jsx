"use client"


import React, {useState} from 'react';
import { SellersListingContainer } from '..';

const Listings = ({listings, home, stage = "active"}) => {


    const [sort, setSort] = useState('Rent');
  return (
    <div className="listings">
      <div className="l-header">
        <div className="header">
          <div className="intro">
            <h4>{stage === "active"? 'My' : "Unpaid"} Listings</h4>
            <span>Your Property Informations</span>
          </div>

          {!home && (
            <>
              {" "}
              <div className="toggle">
                <div onClick={() => setSort("Rent")}>
                  <span
                    style={{
                      borderBottom:
                        sort === "Rent"
                          ? "1px solid #000"
                          : "1px solid #00000000",
                    }}
                  >
                    Rent
                  </span>
                </div>
                <div onClick={() => setSort("Sell")}>
                  <span
                    style={{
                      borderBottom:
                        sort === "Sell"
                          ? "1px solid #000"
                          : "1px solid #00000000",
                    }}
                  >
                    Sell
                  </span>
                </div>
              </div>
              <label htmlFor="search" className="search">
                <img src="/search.svg" alt="" />
                <input
                  type="text"
                  id="search"
                  placeholder="search properties"
                />
              </label>{" "}
            </>
          )}
        </div>

        <div className="mob-header">
          <div className="intro">
            <h4>My Listings</h4>
            <span>Your Property Informations</span>
          </div>
          {!home && (
            <>
              {" "}
              <label htmlFor="search" className="search">
                <img src="/search.svg" alt="" />
                <input
                  type="text"
                  id="search"
                  placeholder="search properties"
                />
              </label>
              <div className="toggle">
                <div onClick={() => setSort("Rent")}>
                  <span
                    style={{
                      borderBottom:
                        sort === "Rent"
                          ? "1px solid #000"
                          : "1px solid #00000000",
                    }}
                  >
                    Rent
                  </span>
                </div>
                <div onClick={() => setSort("Sell")}>
                  <span
                    style={{
                      borderBottom:
                        sort === "Sell"
                          ? "1px solid #000"
                          : "1px solid #00000000",
                    }}
                  >
                    Sell
                  </span>
                </div>
              </div>
           
              {" "}
            </>
          )}
        </div>

        {home && <div className="see-all">View All</div>}
      </div>
      <div className="l-container">
        {listings?.length > 0 ? (
          <SellersListingContainer stage={stage} listings={listings} />
        ) : (
          <div className="no-listings">
            <img src="/no-listings.svg" alt="" />
            <h4>No Property upload available</h4>
            <span>
              You can post a property by using the upload a property button
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Listings




