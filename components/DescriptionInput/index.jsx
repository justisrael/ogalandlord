"use client"

import React,{useState} from 'react'
import { 
    updateDetails, 
    selectDetails, 
    selectAmenitiesList, 
    addAmenity, 
    selectChosenAmenities,
    updateChosenAmeninites 
} from '@/lib/store/slices/listingUpload.reducer';
import  { useAppDispatch, useAppSelector } from '@/lib/store/hooks'

const DescriptionInput = () => {

  const dispatch = useAppDispatch();

  const { description, furnished, listingType, propertyType, bedrooms, baths, paymentType, price, title } = useAppSelector(selectDetails)
  const allAmenities = useAppSelector(selectAmenitiesList)
  const chosenAmenities = useAppSelector(selectChosenAmenities)


  const [newAmenity, setNewAmenity] = useState("");

    // onChange function to update newAmenity
    const handleAmenityChange = (event) => {
        setNewAmenity(event.target.value);
    };


  
  const handleInputChange = (event) => {
    const {name, value} = event.target
    // setstoredLocation({...storedLocation, [name]: value})
    dispatch(updateDetails({key: name, value: value}))
  }

  const handleAddAmenity = (amenity) => {
    dispatch(addAmenity(amenity))
    dispatch(updateChosenAmeninites(amenity))
    setNewAmenity("")
  }

    const handleUpdateAmenity = (amenity) => {
      dispatch(updateChosenAmeninites(amenity))
    }
  return (
    <div className='description-cont' >
        <div className="input-group">
          <label htmlFor="title">Title</label>
          <textarea  onChange={handleInputChange} id="title" value={title} name='title' rows={1} placeholder="E.g  A 2 bedroom- detached flat " />
        </div>
        <div className="input-group">
          <label htmlFor="desc">Description</label>
          <textarea  onChange={handleInputChange} id="desc" value={description} name='description' rows={3} placeholder="E.g  A 2 bedroom- detached flat building beautifully built on a plot of land in a lovely secured environment of Ikeja, Lagos. It consists of 2 Bedrooms, 3 Bathrooms and 1 Garage." />
        </div>
        <div className="input-group" style={{ border: "none" }} >
          <label>How furnished is the Apartment?</label>

            <div className="radio-buttons">
                <label>
                    <input  onChange={handleInputChange}  type="radio"  checked={furnished === 'furnished'}  name="furnished" value={'furnished'} />
                    <span className="custom-radio"></span>
                    Fully Furnished
                </label>
                <label>
                    <input  onChange={handleInputChange}  type="radio"  checked={furnished === 'partlyFurnished'} name="furnished" value={'partlyFurnished'} />
                    <span className="custom-radio"></span>
                    Partly Furnished
                </label>
                <label>
                    <input  onChange={handleInputChange}  type="radio"  checked={furnished === 'notFurnished'} name="furnished" value={'notFurnished'} />
                    <span className="custom-radio"></span>
                    No Furnishing
                </label>
            </div>
        </div>

        <div className="input-group">
              <label htmlFor="propertyType">Property Type</label>
              <select name='propertyType' value={propertyType} onChange={handleInputChange}  id="propertyType">
              <option value=""  >Select a type</option>

              <option value="selfCon">Self-Contain</option>
              <option value="studio">Studio Apartment</option>
              <option value="flat">Flat</option>
              <option value="duplex">Duplex</option>
              {/* Add more options here */}
              </select>
          </div>


        <div className="input-row">
          <div className="input-group">
              <label htmlFor="bedrooms">Bedrooms</label>
              <input onChange={handleInputChange} value={bedrooms}   id='bedrooms' type='number' name='bedrooms' />

              {/* <select id="bedrooms"> */}
             
              {/* <option value="">--Select--</option> */}
              {/* Add more options here */}
              {/* </select> */}
          </div>
          <div className="input-group">
              <label htmlFor="baths">Baths</label>
              <input onChange={handleInputChange}  value={baths} id='baths' type='number' name='baths' />
              {/* <select id="baths"> */}
              {/* <option value="">--Select--</option> */}
              {/* Add more options here */}
              {/* </select> */}
          </div>
          {/* <div className="input-group">
              <label htmlFor="toilets">Toilets</label>
              <select id="toilets">
              <option value="">--Select--</option>
              </select>
          </div> */}
        </div>

        <div className="input-group amenities">
          <label>Other Amenities</label>

          <div className="checkbox-buttons">
            {  
                allAmenities.map(amenity => (
                    <label key={amenity} onClick={() => {
                        // console.log(amenity)
                        handleUpdateAmenity(amenity)
                    }
                    } >
                        <input type="checkbox" onClick={(e) => e.stopPropagation()}  checked={chosenAmenities.includes(amenity)} />
                        <span className="custom-checkbox"></span>
                        {amenity}
                    </label>
                ))
            }
            <>
            {/* <label>
                <input type="checkbox" name="fenced" value="fenced" />
                <span className="custom-checkbox"></span>
                Fenced
            </label>
            <label>
                <input type="checkbox" name="electricity24_7" value="electricity24_7" />
                <span className="custom-checkbox"></span>
                24/7 Electricity
            </label>
            <label>
                <input type="checkbox" name="security" value="security" />
                <span className="custom-checkbox"></span>
                Security
            </label>
            <label>
                <input type="checkbox" name="wiFi" value="wiFi" />
                <span className="custom-checkbox"></span>
                Wi-fi
            </label>
            <label>
                <input type="checkbox" name="cinema" value="cinema" />
                <span className="custom-checkbox"></span>
                Cinema
            </label>
            <label>
                <input type="checkbox" name="garage" value="garage" />
                <span className="custom-checkbox"></span>
                Garage
            </label>
            <label>
                <input type="checkbox" name="enSuite" value="enSuite" />
                <span className="custom-checkbox"></span>
                En-suite
            </label>
            <label>
                <input type="checkbox" name="laundryRoom" value="laundryRoom" />
                <span className="custom-checkbox"></span>
                Laundry room
            </label>
            <label>
                <input type="checkbox" name="fireplace" value="fireplace" />
                <span className="custom-checkbox"></span>
                Fireplace
            </label>
            <label>
                <input type="checkbox" name="recreationalFacilities" value="recreationalFacilities" />
                <span className="custom-checkbox"></span>
                Recreational facilities
            </label>
            <label>
                <input type="checkbox" name="swimmingPool" value="swimmingPool" />
                <span className="custom-checkbox"></span>
                Swimming pool
            </label>
            <label>
                <input type="checkbox" name="childrensPlayground" value="childrensPlayground" />
                <span className="custom-checkbox"></span>
                Children&apos;s Playground
            </label>
            <label>
                <input type="checkbox" name="powerBackup" value="powerBackup" />
                <span className="custom-checkbox"></span>
                Power backup
            </label>
            <label>
                <input type="checkbox" name="spa" value="spa" />
                <span className="custom-checkbox"></span>
                Spa
            </label>
            <label>
                <input type="checkbox" name="clubhouse" value="clubhouse" />
                <span className="custom-checkbox"></span>
                Clubhouse
            </label> */}
            </>
          </div>

          <div className="add-checkbox">
            <label htmlFor="newCheckbox">Others</label>
            <input
            type="text"
            placeholder="Gym?"
            onChange={handleAmenityChange} 
            value={newAmenity}
            />
            <button onClick={() => handleAddAmenity(newAmenity)}>Add</button>
        </div>

        </div>
        <div className="input-row">
            <div className="input-group">
                <label htmlFor="price">Cost of the property (in naira)</label>
                <input type="number" onChange={handleInputChange} name='price' value={price}  id="price" placeholder="100,000" />
            </div>
            <div className="input-group">
              <label htmlFor="paymentType">Payment Duration</label>
              <select name='paymentType' value={paymentType} onChange={handleInputChange}  id="paymentType">
              <option value=""  >Select a duration</option>
             
              <option value="Yearly">Per Year</option>
              <option value="Monthly">Per Month</option>
              <option value="Weekly">Per Week</option>
              <option value="Daily">Per Night</option>
              <option value="Sale">Sale</option>
              {/* Add more options here */}
              </select>
          </div>

        </div>
        <div className="input-group"  style={{ border: "none" }}  >
          <label>Is the price negotiable?</label>

            <div className="radio-buttons">
                <label>
                    <input  onChange={handleInputChange}  type="radio" name="priceNegotiable" value={true} />
                    <span className="custom-radio"></span>
                    Yes
                </label>
                <label>
                    <input  onChange={handleInputChange}  type="radio" defaultChecked name="priceNegotiable" value={false} />
                    <span className="custom-radio"></span>
                    No
                </label>
            </div>
        </div>
    </div>
  )
}

export default DescriptionInput