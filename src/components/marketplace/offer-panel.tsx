"use client";

import { useState } from "react";
import { submitOfferAction } from "@/app/actions";
import { formatCurrency, parseCurrency } from "@/lib/marketplace/format";

type OfferPanelProps = {
  listingSlug: string;
  model: string;
  currentListPrice: string;
  status: "open" | "under-offer";
  userEmail: string | null;
};

export function OfferPanel({
  listingSlug,
  model,
  currentListPrice,
  status,
  userEmail,
}: OfferPanelProps) {
  const [offerInput, setOfferInput] = useState("");
  const [numericOffer, setNumericOffer] = useState(0);

  const listPrice = parseCurrency(currentListPrice);
  const totalCost = numericOffer;
  const serviceFee = totalCost * 0.015;
  const payableNow = Math.max(totalCost - listPrice, 0) + serviceFee;

  const disabled = status !== "open";

  return (
    <div className="offer-panel">
      <div className="offer-panel__summary">
        <div>
          <h5>Current Thula List Price</h5>
          <strong>{currentListPrice}</strong>
        </div>
        <div>
          <h5>Your Offer</h5>
          <input
            className="offer-panel__input"
            inputMode="decimal"
            placeholder={String(listPrice)}
            name="amount"
            value={offerInput}
            onChange={(event) => {
              const digits = event.target.value.replace(/[^\d]/g, "");
              setOfferInput(digits);
              setNumericOffer(Number(digits || 0));
            }}
            disabled={disabled}
          />
        </div>
        <div>
          <h5>Total Cost Of {model}</h5>
          <strong>{formatCurrency(totalCost)}</strong>
        </div>
        <div>
          <h5>Service Fee</h5>
          <strong>{formatCurrency(serviceFee)}</strong>
        </div>
        <div>
          <h5>Total Amount Payable Now</h5>
          <strong>{formatCurrency(payableNow)}</strong>
        </div>
      </div>

      <p className="offer-panel__note">
        All prices are exclusive of VAT/GST and other taxes. Tax obligations are
        solely between buyer and seller.
      </p>

      {userEmail ? (
        <form action={submitOfferAction} className="offer-panel__form">
          <input type="hidden" name="listingSlug" value={listingSlug} />
          <input type="hidden" name="listingModel" value={model} />
          <input type="hidden" name="userEmail" value={userEmail} />
          <input type="hidden" name="amount" value={offerInput} />
          <button
            type="submit"
            className="button-primary offer-panel__button"
            disabled={disabled}
          >
            {disabled ? "Listing Under Offer" : "Submit Offer Request"}
          </button>
        </form>
      ) : (
        <a href="/login" className="button-primary offer-panel__button offer-panel__link">
          Sign In To Make An Offer
        </a>
      )}
    </div>
  );
}
