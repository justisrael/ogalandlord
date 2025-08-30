"use client";

import { useState } from "react";
// import "./pricing.css"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import {
  selectCartListing,
  setSubscription,
  getPaymentLink,
} from "@/lib/store/slices/listingUpload.reducer";
import { useRouter } from "next/navigation";

import { selectCurrentUser } from "@/lib/store/slices/user.reducer";

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

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState("monthly");

  const currentUser = useAppSelector(selectCurrentUser);
  const cartListing = useAppSelector(selectCartListing);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const handleBillingChange = (period) => {
    setBillingPeriod(period);
  };

  const [loading, setLoading] = useState(false);
  const [pickedPlan, setPickedPlan] = useState("");

  const handleChoosePlan = async (plan, price, billingPeriod) => {
    setLoading(true);
    dispatch(
      setSubscription({
        plan,
        price,
        billingPeriod,
        ...getTodayAndEndDate(),
      })
    );
    try {
      await dispatch(
        getPaymentLink({
          email: currentUser.email,
          amount: price,
          listing: plan,
          listingId: cartListing.id,
          duration: billingPeriod,
          userId: currentUser.id,
          fallback: () => {
            router.push("/dashboard/listings/checkout");
          },
        })
      ).unwrap(); // optional, unwrap to catch errors directly
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  function getTodayAndEndDate() {
    const now = new Date();
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return {
      start: now.toISOString(),
      end_date: endDate.toISOString(),
    };
  }

  return (
    <div className="pricing-container">
      <div className="pricing-header">
        <h1 className="pricing-title">
          Oga Landlord&apos;s <span className="pricing-highlight">Pricing</span>{" "}
          Model
        </h1>
        <p className="pricing-subtitle">
          Kindly choose a subscription plan for your listings
        </p>
        <p>{cartListing?.details?.title}</p>
      </div>

      <div className="billing-toggle">
        <button
          className={`toggle-option ${
            billingPeriod === "weekly" ? "active" : ""
          }`}
          onClick={() => handleBillingChange("weekly")}
        >
          Weekly
        </button>
        <button
          className={`toggle-option ${
            billingPeriod === "monthly" ? "active" : ""
          }`}
          onClick={() => handleBillingChange("monthly")}
        >
          Monthly
        </button>
        <button
          className={`toggle-option ${
            billingPeriod === "yearly" ? "active" : ""
          }`}
          onClick={() => handleBillingChange("yearly")}
        >
          Yearly
        </button>
      </div>

      <div className="pricing-cards">
        <div className="pricing-card basic">
          <h3 className="card-title">{pricingData.basic.name}</h3>
          <div className="card-price">
            {formatPrice(pricingData.basic.prices[billingPeriod])}
          </div>

          <ul className="feature-list">
            {pricingData.basic.features.map((feature, index) => (
              <li key={index} className="feature-item">
                <span className="checkmark">✓</span>
                {feature}
              </li>
            ))}
          </ul>

          <button
            className="choose-plan-btn basic-btn"
            onClick={() => {
              handleChoosePlan(
                pricingData.basic.name,
                pricingData.basic.prices[billingPeriod],
                billingPeriod
              );
              setPickedPlan(pricingData.basic.name);

            }}
          >
            Choose Plan
            {(loading && pickedPlan === pricingData.basic.name )  && <span className="spinner"></span>}

          </button>
        </div>

        <div className="pricing-card standard featured">
          <h3 className="card-title">{pricingData.standard.name}</h3>
          <div className="card-price">
            {formatPrice(pricingData.standard.prices[billingPeriod])}
          </div>

          <ul className="feature-list">
            {pricingData.standard.features.map((feature, index) => (
              <li key={index} className="feature-item">
                <span className="checkmark">✓</span>
                {feature}
              </li>
            ))}
          </ul>

          <button
            className="choose-plan-btn standard-btn"
            onClick={() => {
              handleChoosePlan(
                pricingData.standard.name,
                pricingData.standard.prices[billingPeriod],
                billingPeriod
              );
              setPickedPlan(pricingData.standard.name);

            }}
          >
            Choose Plan
            {(loading && pickedPlan === pricingData.standard.name )  && <span className="spinner"></span>}

          </button>
        </div>

        <div className="pricing-card premium">
          <h3 className="card-title">{pricingData.premium.name}</h3>
          <div className="card-price">
            {formatPrice(pricingData.premium.prices[billingPeriod])}
          </div>

          <ul className="feature-list">
            {pricingData.premium.features.map((feature, index) => (
              <li key={index} className="feature-item">
                <span className="checkmark">✓</span>
                {feature}
              </li>
            ))}
          </ul>

          <button
            className="choose-plan-btn premium-btn"
            onClick={() => {
              handleChoosePlan(
                pricingData.premium.name,
                pricingData.premium.prices[billingPeriod],
                billingPeriod
              );
              setPickedPlan(pricingData.premium.name);
            }}
          >
            Choose Plan 
            {(loading && pickedPlan === pricingData.premium.name )  && <span className="spinner"></span>}
          </button>
        </div>
      </div>
    </div>
  );
}

