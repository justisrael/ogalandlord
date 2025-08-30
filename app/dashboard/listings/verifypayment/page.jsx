"use client";

import { useEffect, useState } from "react";
// import "./pricing.css"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import {
  selectCartListing,
  setSubscription,
  selectSubscription,
  selectVerifyIsLoading,
  selectPaymentStatus,
  verifypayments,
} from "@/lib/store/slices/listingUpload.reducer";

import { selectCurrentUser } from "@/lib/store/slices/user.reducer";
import { useRouter, useSearchParams } from "next/navigation";
import { PaymentSuccess } from "@/components";

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

import React from "react";

const VerifyPage = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const cartListing = useAppSelector(selectCartListing);
  const subscription = useAppSelector(selectSubscription);
  const verifyIsLoading = useAppSelector(selectVerifyIsLoading);
  const paymentStatus = useAppSelector(selectPaymentStatus);
  const router = useRouter();
  const query = useSearchParams();
  const reference = query?.get("reference");
  const dispatch = useAppDispatch();
  const { plan, price, paymentLink } = subscription || {};
  const { id, details } = cartListing || {};
  const { fullName, photoURL } = currentUser || {};

  const formatPrice = (amount) => {
    return `₦${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleBack = () => {
    router.push("/dashboard/listings");
  };

  const handleProceedToPayment = () => {
    router.push(paymentLink);
  };

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      if (reference) {
        dispatch(verifypayments(reference));
      }
    }

    return () => {
      ignore = true;
    };
  }, [reference, dispatch]);

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
            height: "100%",
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

          <div className="verify-details">
            {verifyIsLoading && (
              <>
                <h3 className="verify-title">Payment Verification </h3>
                <p className="verify-subtitle">
                  Kindly wait while we verify your payment
                </p>
                <span className="spinner dark"></span>
              </>
            )}

            {paymentStatus === "failed" ? (
              <PaymentSuccess
                amount={price}
                transactionId={id}
                onClose={handleBack}
                onBackToDashboard={handleBack}
                success={false}
              />
            ) : paymentStatus === "completed" ? (
              <PaymentSuccess
                amount={price}
                transactionId={id}
                onClose={handleBack}
                onBackToDashboard={handleBack}
                success={true}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;

