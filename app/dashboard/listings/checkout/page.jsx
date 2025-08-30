"use client";

import { useState } from "react";
// import "./pricing.css"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import {
  selectCartListing,
  setSubscription,
  selectSubscription
} from "@/lib/store/slices/listingUpload.reducer";

import { selectCurrentUser } from "@/lib/store/slices/user.reducer";
import { useRouter } from "next/navigation";


const pricingData = {
  basic: {
    name: "Basic",
    prices: {
      weekly: 1500,
      monthly: 5000,
      yearly: 50000,
    },
    features: [
      "High (ads before, during, and after content)",
      "Unskippable, targeted ads",
      "Limited (partial content library or restricted features)",
      "Basic ad targeting based on user data",
      "Single user or device",
      "Lower quality (e.g., SD, 480p)",
      "No Ad free access",
      "Limited or basic features like fewer skips in content playlists",
      "Minimal or self service support",
    ],
  },
  standard: {
    name: "Standard",
    prices: {
      weekly: 3000,
      monthly: 10000,
      yearly: 100000,
    },
    features: [
      "Moderate (fewer ads, but still present)",
      "Skippable after a few seconds, less intrusive",
      "Expanded library (access to more content/features)",
      "Targeted ads with more refined customization",
      "Multiple users (e.g., 2 devices simultaneously)",
      "HD or higher (e.g., 720p-1080p)",
      "Limited Ad access",
      "Access to some premium features like exclusive content or moderate content skips",
      "Standard support (e.g., email, regular hours)",
    ],
  },
  premium: {
    name: "Premium",
    prices: {
      weekly: 5000,
      monthly: 15000,
      yearly: 150000,
    },
    features: [
      "Minimal (rare ads or ads only before/after content)",
      "Skippable, relevant, or opt-in ads with perks",
      "Full library (access to unrestricted content/features)",
      "Fully personalized, highly relevant ads based on detailed user data",
      "Multiple users (e.g., 5 devices simultaneously)",
      "Highest quality (e.g., Ultra HD, 4K)",
      "Almost ad-free",
      "Premium features like exclusive content, offline access, and ad rewards",
      "Premium customer support (24/7, fast response)",
    ],
  },
};

import React from 'react'


const CheckoutPage = () => {
  const currentUser = useAppSelector(selectCurrentUser)
  const cartListing = useAppSelector(selectCartListing)
  const subscription = useAppSelector(selectSubscription)
  const router = useRouter();


  const { plan, price, paymentLink } = subscription || {}
  const { id, details } = cartListing || {}
  const { title } = details || {}
  const { fullName, photoURL } = currentUser || {}

  // Hard-coded values for UI
  const displayPlan = "standard"
  const displayPrice = 10000 // ₦100.00
  const displayTitle = "2 Bedroom Flat"
  const displayId = "1234567890"
  const displayName = "Israel Ventures"
  const displayPhoto = "/placeholder.svg?height=40&width=40&text=IV"

  const formatPrice = (amount) => {
    return `₦${(amount).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  const handleBack = () => {
    // Handle back navigation
    window.history.back()
  }

  const handleProceedToPayment = () => {
    router.push(paymentLink);
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Left side - Property Image as background */}
        <div
          className="property-image-section"
          style={{
            backgroundImage: "url('/checkout-img.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "600px",
            width: "100%",
            height: "100%"
          }}
        ></div>

        {/* Right side - Checkout Details */}
        <div className="checkout-details">
          {/* Header */}
          <div className="checkout-header">
            <div className="logo-section">
              <img src="/logo.svg" alt="Logo" className="logo-icon" />
            </div>
            <button className="back-button" onClick={handleBack}>
              
              <span>Back</span>
            </button>
          </div>

          {/* Plan Summary */}
          <div className="plan-summary">
            <h1 className="summary-title">Plan Summary</h1>
            <p className="summary-subtitle">Kindly choose a payment method.</p>

            <div className="plan-card">
              <div className="plan-info">
                <span className="plan-name">{plan} Plan</span>
                <span className="plan-price">{formatPrice(price)}</span>
              </div>
            </div>
          </div>

          {/* Subscribed By */}
          <div className="subscriber-section">
            <h3 className="section-title">Subscribed by</h3>
            <div className="subscriber-info">
              <img src={photoURL?.url || "/placeholder.svg"} alt={fullName} className="subscriber-avatar" />
              <span className="subscriber-name">{fullName}</span>
            </div>
          </div>

          {/* Listing Details */}
          <div className="listing-section">
            <h3 className="section-title">Listing Details</h3>
            <div className="listing-details">
              <div className="detail-row">
                <span className="detail-label">Listing Type</span>
                <span className="detail-value">{title}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Listing ID</span>
                <span className="detail-value">{id}</span>
              </div>
            </div>
          </div>

          {/* Proceed Button */}
          <button className="proceed-button" onClick={handleProceedToPayment}>
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
