import React from 'react'
import { SPropertyCard, APropertyCard } from '..'

const SellersListingContainer = ({listings, admin, stage = "active" }) => {
  return (
    <div className='s-listings-container' >
      {
        !admin? listings.map((listing, index) => (
          <SPropertyCard key={listing.id} stage={stage} listing={listing} />
        )) : 
        listings.map((listing, index) => (
          <APropertyCard key={listing.id} listing={listing} />
        )) 
      }
   
  

      {
        listings.length < 2 && <>
        <span></span>
        <span></span>
        <span></span>
        </>
      }
        {/* <SPropertyCard /> */}
    </div>
  )
}

export default SellersListingContainer