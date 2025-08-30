"use client";

import Image from "next/image";
import { Login } from "@/components/AuthModals";
import {
  setSigninModal,
  selectSignInModal,
  setSignupModal,
  selectCurrentUser,
} from "@/lib/store/slices/user.reducer";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useRouter } from "next/navigation";
import { BPropertyCard, Navbar, Footer } from "@/components";
import { useState } from "react";
import { selectAllListings, setLocationFilter, updateOtherFilter } from "@/lib/store/slices/listings.reducer";
import { nigerianStatesAndLGAs } from "@/lib/data/location";

export default function Home() {
  const Faq = [
    {
      question: "How trustworthy are your agents?",
      answer:
        "Our agents have been duly verified, so, we are confident in their services",
    },
    {
      question:
        "Are the apartment displayed on the site the same as the one to be paid for?",
      answer:
        "With the help of our agents, all apartments displayed can be inspected by customers before making payment",
    },
    {
      question: "How do I become an Agent on the website?",
      answer:
        "Follow the necessary verification steps on the website and you are a step closer to being an agent",
    },
    {
      question: "How trustworthy are your agents?",
      answer:
        "Our agents have been duly verified, so, we are confident in their services",
    },
    {
      question:
        "Are the apartment displayed on the site the same as the one to be paid for?",
      answer:
        "With the help of our agents, all apartments displayed can be inspected by customers before making payment",
    },
    {
      question: "How do I become an Agent on the website?",
      answer:
        "Follow the necessary verification steps on the website and you are a step closer to being an agent",
    },
  ];
  const dispatch = useAppDispatch();
  const router = useRouter();

  const signInModalOpen = useAppSelector(selectSignInModal);
  const currentUser = useAppSelector(selectCurrentUser);
  const [clickedFaqs, setClickedFaq] = useState([]);
  const allListings = useAppSelector(selectAllListings);
  const [showSearchOutput, setShowSearchOutput] = useState(false)
  const [chosenState, setChosenState] = useState('');
  const [chosenLga, setChosenLga] = useState([]);


  const testimonialSegments = [0, 2, 4, 6];
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const toggleFaq = (x) => {
    let clickedFaq = clickedFaqs.includes(x);

    if (!clickedFaq) {
      setClickedFaq([...clickedFaqs, x]);
    } else {
      let newClickedFaq = clickedFaqs.filter((faq) => faq !== x);
      setClickedFaq([...newClickedFaq]);
    }
  };
  const handleChosenLga = (newLga) => {
    setChosenLga((prevLgas) => {
      if (prevLgas.includes(newLga)) {
        // Remove the string from the array if it already exists
        return prevLgas.filter(lga => lga !== newLga);
      } else {
        // Add the string to the array if it doesn't exist
        return [...prevLgas, newLga];
      }
    });
  };

  const handleChosenState = (newState) => {
    setChosenState(newState);
  };

  const handleSetLocations = () => {
    dispatch(setLocationFilter({
      lga: chosenLga,
      state: chosenState,
    }))
    setChosenLga([])
    setChosenState('');
    setShowSearchOutput(false)
  }

  

  const handleLoginClick = () => {
    dispatch(setSigninModal(true));
    // console.log(signInModalOpen);
  };

  const openSignupModal = () => {
    dispatch(setSignupModal(true));
    // console.log(signInModalOpen);
  };

  const stateKeys = Object.keys(nigerianStatesAndLGAs);  
  const lgaKeys = Object.values(nigerianStatesAndLGAs).flat();  

  const testimonials = [
    {
      name: "Sophia Richards",
      testimonial:
        "The service was outstanding, and the team made everything seamless. I couldn't have asked for a better experience!",
    },
    {
      name: "Michael Thompson",
      testimonial:
        "I'm truly impressed with the level of detail and professionalism. Highly recommended!",
    },
    {
      name: "Isabella Carter",
      testimonial:
        "This was exactly what I needed. The support team went above and beyond to meet my expectations.",
    },
    {
      name: "James Anderson",
      testimonial:
        "I've never encountered such fast and reliable service. Absolutely phenomenal!",
    },
    {
      name: "Emily Bennett",
      testimonial:
        "The user experience is exceptional. Everything was smooth, and the end result exceeded my expectations.",
    },
    {
      name: "David Wilson",
      testimonial:
        "They really know how to deliver quality. I was blown away by the attention to detail and efficiency.",
    },
    {
      name: "Olivia Martin",
      testimonial:
        "A fantastic experience from start to finish! Their team is friendly, professional, and incredibly knowledgeable.",
    },
    {
      name: "Daniel Hughes",
      testimonial:
        "Top-notch service! They kept me informed every step of the way and delivered exceptional results.",
    },
  ];

  const increment = () => {
    console.log("Incre", testimonialIndex);
    if (testimonialIndex === 3) {
      setTestimonialIndex(0);
      return;
    }
    setTestimonialIndex((prev) => prev + 1);
  };

  const decrement = () => {
    console.log("Decre", testimonialIndex);
    if (testimonialIndex === 0) {
      setTestimonialIndex(3);
      return;
    }
    setTestimonialIndex((prev) => prev - 1);
  };

      
  const handleInputChange = (event) => {
    const {name, value} = event.target
    // setstoredLocation({...storedLocation, [name]: value})
    dispatch(updateOtherFilter({key: name, value: value}))
  }

  return (
    <div className="page">
      <Navbar />
      <div className="hero">
        <div className="contain">
          <div className="auto-service-container">
            <h1>
              Discover Your Next <span>Home</span> Effortlessly
            </h1>
            <p>
              Oga Landlord will help you to easily search, compare, and secure
              your dream apartment with our user-friendly platform.
            </p>
          </div>
        </div>
      </div>
      <div className="search-tab">
        <div className="contain">
          <div className="switch">
            <span>Rent</span>
            <span>Buy</span>
          </div>
          <div className="filter">
            <div className="filter-grp">
              <h3>Property Type</h3>
              {/* <p>Select Property Type</p> */}
              <label htmlFor="propertyType" className="filter-item">
                {/* <img src="/house-icon.svg" alt="" /> */}
                <select onChange={handleInputChange} name="propertyType" id="propertyType">
                  <option value="">Select Property type</option>
                  <option value="selfCon">Self Contain</option>
                  <option value="flat">Flat</option>
                  <option value="duplex">Duplex</option>
                </select>
              </label>
            </div>
            <div className="filter-grp">
              <h3>Location</h3>
              <p onClick={() => {
                setShowSearchOutput(true)
              }} >Select Location</p>
            </div>
            <div className="filter-grp">
              <h3>Price</h3>
              {/* <p>Minimum - Maximum Price</p> */}
              <label htmlFor="minMax " className="filter-item">
                {/* <img src="/price-icon.svg" alt="" /> */}
                <select onChange={handleInputChange} name="minMaxPrice" id="minMax ">
                  <option value={""}>Min-Max price</option>
                  <option value={[300000]}>below 300k</option>
                  <option value={[300000, 500000]}>300k - 500k</option>
                  <option value={[500000, 1000000]}>500k - 1m</option>
                  <option value={[1000000, 2000000]}>1m - 2m</option>
                  <option value={[2000000, 4000000]}>2m - 4m</option>
                  <option value={[4000000]}>4m and above</option>
                 
                </select>
              </label>
            </div>
            <button onClick={() => router.push("/listings")} >Find Property</button>
          </div>
        </div>
      </div>
      <div className="numbers">
        <div className="contain">
          <div className="number">
            <span className="big-text">100+</span>
            <p>24/7 online sales/rentals</p>
          </div>
          <div className="number">
            <span className="big-text">100+</span>
            <p>24/7 online sales/rentals</p>
          </div>
          <div className="number">
            <span className="big-text">100+</span>
            <p>24/7 online sales/rentals</p>
          </div>
          <div className="number">
            <span className="big-text">100+</span>
            <p>24/7 online sales/rentals</p>
          </div>
        </div>
      </div>
      <div className="how">
        <div className="contain">
          <div className="heading">
            <h2>How It Works</h2>
            <p>
              Get familiar with how Oga Landlord works in order to rent or sell
              a property
            </p>
          </div>

          <div className="steps">
            <div className="step">
              <div className="img" style={{ backgroundColor: "#C6F6FF" }}>
                <img src="/how-search.svg" alt="" />
              </div>
              <h4>Search Property</h4>
              <p>
                Search through our listings for rent or sale to get your desired
                property{" "}
              </p>
            </div>
            <div className="step">
              <div className="img" style={{ backgroundColor: "#DEC6FF" }}>
                <img src="/how-register.svg" alt="" />
              </div>
              <h4>Register</h4>
              <p>Sign up with your details to make use of our platform </p>
            </div>
            <div className="step">
              <div className="img" style={{ backgroundColor: "#AEFFB5" }}>
                <img src="/how-connect.svg" alt="" />
              </div>
              <h4>Connect</h4>
              <p>Connect with our trusted sellers within the platform.</p>
            </div>
            <div className="step">
              <div className="img" style={{ backgroundColor: "#FFE6B7" }}>
                <img src="/how-inspect.svg" alt="" />
              </div>
              <h4>Inspect</h4>
              <p>
                Inspect apartments with your connected agents before making
                payments.
              </p>
            </div>
            <div className="step">
              <div className="img" style={{ backgroundColor: "#FFAAFB" }}>
                <img src="/how-kyc.svg" alt="" />
              </div>
              <h4>Complete Kyc</h4>
              <p>Sign up with your details to make use of our platform </p>
            </div>
            <div className="step">
              <div className="img" style={{ backgroundColor: "#FF9EA0" }}>
                <img src="/how-upload.svg" alt="" />
              </div>
              <h4>Upload</h4>
              <p>
                Snap and upload clear property for listing without watermark.
              </p>
            </div>
          </div>

          <div className="f-l-heading">
            <h2>Featured Listings</h2>
            <p>Checkout our listings for your desired property</p>
          </div>

          <div className="f-l">
            {allListings.map((listing, index) => (
              <BPropertyCard key={listing.id} listing={listing} />
            ))}
          </div>

          <div className="faq-heading">
            <h2>Frequently Asked Questions</h2>
            <p>Here are the various questions we get from our customers</p>

            <div className="faq-cont">
              {Faq.map((item, i) => (
                <div
                  className={
                    clickedFaqs.includes(i) ? "faq-card faq-show" : "faq-card"
                  }
                  key={i}
                >
                  <div
                    className="f-c-header"
                    onClick={() => {
                      toggleFaq(i);
                    }}
                  >
                    <span>{item.question}</span>
                    <img src="/faq.svg" alt="faq" />
                  </div>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="banner">
        <div className="contain">
          <h2>
            Subscribe now to be updated about our listings and amazing deals
            that might be available
          </h2>
          <form className="banner-form">
            <input type="email" placeholder="Enter your E-mail " />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="how">
        <div className="contain">
          <div className="heading">
            <h2>Having a Doubt? Hear From Our Customers</h2>
            <p>
              Hear from our amazing customers how our platform have helped them
              in getting their desired apartments
            </p>
          </div>

          <div className="testimonial-cont">
            <span className="left" onClick={decrement}>
              <img src="/left.svg" alt="" />
            </span>
            <div className="testimonials">
              <div className="t-card">
                <div className="head">
                  <p className="name">
                    {testimonials[testimonialSegments[testimonialIndex]].name}
                  </p>
                  {/* <img src="" alt="" className="pfp" /> */}
                </div>
                <div className="content">
                  <p>
                    {`Finding our dream home felt like an overwhelming task until we discovered Oga Landlord. The user-friendly interface made it easy to filter through options based on our specific needs, and the detailed property descriptions and high-quality photos gave us confidence in our choices. We especially appreciated the real-time updates and notifications about new listings. Within weeks, we found the perfect home in the perfect neighborhood. The process was seamless, and we couldn’t be happier with our new place. Oga Landlord made what could have been a stressful experience truly enjoyable!"`}
                  </p>
                  <p>
                    {
                      testimonials[testimonialSegments[testimonialIndex]]
                        .testimonial
                    }
                  </p>
                </div>
              </div>
              <div className="t-card">
                <div className="head">
                  <p className="name">
                    {
                      testimonials[testimonialSegments[testimonialIndex] + 1]
                        .name
                    }
                  </p>
                  {/* <img src="" alt="" className="pfp" /> */}
                </div>
                <div className="content">
                  <p>
                    {`Finding our dream home felt like an overwhelming task until we discovered Oga Landlord. The user-friendly interface made it easy to filter through options based on our specific needs, and the detailed property descriptions and high-quality photos gave us confidence in our choices. We especially appreciated the real-time updates and notifications about new listings. Within weeks, we found the perfect home in the perfect neighborhood. The process was seamless, and we couldn’t be happier with our new place. Oga Landlord made what could have been a stressful experience truly enjoyable!"`}
                  </p>
                  <p>
                    {
                      testimonials[testimonialSegments[testimonialIndex] + 1]
                        .testimonial
                    }
                  </p>
                </div>
              </div>
            </div>
            <span className="right" onClick={increment}>
              <img src="/right.svg" alt="" />
            </span>
          </div>
          <div className="testimonials-mobile">
            <div className="testimonials">
            <div className="t-card">
                <div className="head">
                  <p className="name">
                    {testimonials[testimonialIndex].name}
                  </p>
                  {/* <img src="" alt="" className="pfp" /> */}
                </div>
                <div className="content">
                  <p>
                    {`Finding our dream home felt like an overwhelming task until we discovered Oga Landlord. The user-friendly interface made it easy to filter through options based on our specific needs, and the detailed property descriptions and high-quality photos gave us confidence in our choices. We especially appreciated the real-time updates and notifications about new listings. Within weeks, we found the perfect home in the perfect neighborhood. The process was seamless, and we couldn’t be happier with our new place. Oga Landlord made what could have been a stressful experience truly enjoyable!"`}
                  </p>
                  <p>
                    {
                      testimonials[testimonialIndex]
                        .testimonial
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      {/* <Login /> */}
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
                    <div key={index} onClick={() => handleChosenState(state)}>
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
      <Footer />
    </div>
  );
}
