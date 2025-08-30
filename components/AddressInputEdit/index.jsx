"use client"

import React from 'react'
import { updateLocation, selectLocation } from '@/lib/store/slices/listingEdit.reducer';
import  { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { nigerianStatesAndLGAs } from '@/lib/data/location';


const AddressInputEdit = () => {

  const dispatch = useAppDispatch();


      
    const stateKeys = Object.keys(nigerianStatesAndLGAs);  
    const { state, address, lga } = useAppSelector(selectLocation)


    const handleInputChange = (event) => {
      const {name, value} = event.target
      // setstoredLocation({...storedLocation, [name]: value})
      dispatch(updateLocation({key: name, value: value}))
    }

      

      
  return (
    <div className="address-container">
        <div className="input-group">
          <label htmlFor="address">Address</label>
          <input name='address' value={address} onChange={handleInputChange} type="text" id="address" placeholder="Lekki, Phase II" />
        </div>
        <div className="input-row">
          <div className="input-group">
              <label htmlFor="state">State</label>
              <select value={state} onChange={handleInputChange}  name='state' id="state">
                <option value=""  >Select a state</option>
                  {
                      stateKeys.map(state => (
                          <option key={state} value={state}>{state}</option>
                      ))
                  }
              {/* <option value="">--Select--</option> */}
              {/* Add more options here */}
              </select>
          </div>
          <div className="input-group">
              <label htmlFor="city">Local Government Area</label>
              <select value={lga} onChange={handleInputChange}  name='lga' id="city">
              <option value=""  >Select a local government area</option>

                {
                  state? nigerianStatesAndLGAs[state].map(lga => (
                          <option key={lga} value={lga}>{lga}</option>
                  )) : 
  
              <option value="">--Select--</option>
                }
              {/* Add more options here */}
              </select>
          </div>
        </div>
  </div>
  )
}

export default AddressInputEdit