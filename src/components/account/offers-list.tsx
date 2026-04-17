"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const offerExpiryDays = 30;
const millisecondsPerDay = 24 * 60 * 60 * 1000;

export type OfferListItem = {
  id: string;
  listingSlug: string;
  listingModel: string;
  listingCode: string | null;
  serialLabel: string | null;
  imageUrl: string | null;
  amount: number;
  currentListPrice: string;
  createdAt: string;
  status: string;
  transactionId: string | null;
  transactionStatus: string | null;
  ownershipTransferredAt?: string | null;
};

type OffersListProps = {
  offers: OfferListItem[];
};

type ModelFilter = "all" | "esv" | "eboat";
type StatusFilter = "pending" | "accepted" | "cancelled" | "owned";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getOfferDisplayStatus(offer: OfferListItem) {
  if (offer.transactionStatus === "completed" || offer.ownershipTransferredAt) {
    return "Owned";
  }

  if (offer.status === "accepted") {
    return "Accepted";
  }

  if (offer.status === "rejected") {
    return "Declined";
  }

  const ageInDays = (Date.now() - new Date(offer.createdAt).getTime()) / millisecondsPerDay;

  if (ageInDays >= offerExpiryDays) {
    return "Cancelled";
  }

  return "Pending";
}

function getOfferStatusClass(label: string) {
  return label.toLowerCase();
}

function formatOfferReference(id: string) {
  return id.replace(/^offer-/, "").replace(/-/g, "").slice(0, 5).toUpperCase();
}

function getModelType(offer: OfferListItem): Exclude<ModelFilter, "all"> {
  const label = `${offer.listingModel} ${offer.listingSlug}`.toLowerCase();
  return label.includes("boat") ? "eboat" : "esv";
}

export function OffersList({ offers }: OffersListProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [modelFilter, setModelFilter] = useState<ModelFilter>("all");
  const [statusFilters, setStatusFilters] = useState<StatusFilter[]>([]);

  const visibleOffers = useMemo(
    () =>
      offers.filter((offer) => {
        const displayStatus = getOfferDisplayStatus(offer).toLowerCase();
        const modelType = getModelType(offer);
        const matchesModel = modelFilter === "all" || modelFilter === modelType;
        const matchesStatus =
          statusFilters.length === 0 || statusFilters.includes(displayStatus as StatusFilter);

        return matchesModel && matchesStatus;
      }),
    [modelFilter, offers, statusFilters],
  );

  function toggleStatusFilter(status: StatusFilter) {
    setStatusFilters((current) =>
      current.includes(status)
        ? current.filter((entry) => entry !== status)
        : [...current, status],
    );
  }

  return (
    <>
      <div className="offers-board__top">
        <div className="offers-board__header">
          <div className="thula-kicker">My Offers</div>
          <button
            type="button"
            className="offers-board__filter"
            onClick={() => setIsFilterOpen(true)}
          >
            Filter
          </button>
        </div>

        {isFilterOpen ? (
          <div className="offers-filter" role="dialog" aria-modal="true" aria-label="Filter offers">
          <div className="offers-filter__head">
            <strong>Filter</strong>
            <button type="button" onClick={() => setIsFilterOpen(false)} aria-label="Close filters">
              x
            </button>
          </div>

          <div className="offers-filter__section">
            <h2>Model</h2>
            <div className="offers-filter__segments">
              {[
                ["all", "Show all"],
                ["esv", "ESV"],
                ["eboat", "Eboat"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={modelFilter === value ? "offers-filter__segment--active" : ""}
                  onClick={() => setModelFilter(value as ModelFilter)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="offers-filter__section">
            <h2>Status</h2>
            {[
              ["pending", "Pending"],
              ["accepted", "Accepted"],
              ["cancelled", "Cancelled"],
              ["owned", "Owned"],
            ].map(([value, label]) => (
              <label key={value} className="offers-filter__check">
                <input
                  type="checkbox"
                  checked={statusFilters.includes(value as StatusFilter)}
                  onChange={() => toggleStatusFilter(value as StatusFilter)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>

          <button
            type="button"
            className="offers-filter__apply"
            onClick={() => setIsFilterOpen(false)}
          >
            Filter
          </button>
          </div>
        ) : null}
      </div>

      <div className="offers-board">
        {visibleOffers.length === 0 ? (
          <article className="account-card">
            <h3>No matching offers</h3>
            <p>Adjust the filter to see more offers.</p>
          </article>
        ) : (
          visibleOffers.map((offer) => {
            const statusLabel = getOfferDisplayStatus(offer);

            return (
              <article key={offer.id} className="offer-row">
                <div className="offer-row__media">
                  {offer.imageUrl ? (
                    <Image
                      src={offer.imageUrl}
                      alt={offer.listingModel}
                      fill
                      sizes="(max-width: 900px) 100vw, 280px"
                    />
                  ) : (
                    <span>{offer.listingModel}</span>
                  )}
                </div>

                <div className="offer-row__vehicle">
                  <h2>{offer.listingModel}</h2>
                  <p>{offer.listingCode || offer.listingSlug}</p>
                  <dl>
                    <div>
                      <dt>Serial Number</dt>
                      <dd>{offer.serialLabel || offer.listingCode || "Pending"}</dd>
                    </div>
                    <div>
                      <dt>Offer ID</dt>
                      <dd>{formatOfferReference(offer.id)}</dd>
                    </div>
                  </dl>
                </div>

                <div className="offer-row__figures">
                  <dl>
                    <div>
                      <dt>Current List Price</dt>
                      <dd>{offer.currentListPrice}</dd>
                    </div>
                    <div>
                      <dt>Your Offer</dt>
                      <dd>{formatCurrency(offer.amount)}</dd>
                    </div>
                  </dl>
                </div>

                <div className="offer-row__status">
                  <span
                    className={`offer-row__status-badge offer-row__badge offer-row__badge--${getOfferStatusClass(
                      statusLabel,
                    )}`}
                  >
                    {statusLabel}
                  </span>
                </div>

                <div className="offer-row__actions">
                  {offer.transactionId ? (
                    <Link
                      href={`/account/transactions/${offer.transactionId}`}
                      className="offer-row__button"
                    >
                      View transaction
                    </Link>
                  ) : statusLabel === "Pending" ? (
                    <Link href={`/account/offers/${offer.id}/edit`} className="offer-row__button">
                      Update your offer
                    </Link>
                  ) : (
                    <Link href={`/marketplace/${offer.listingSlug}`} className="offer-row__button">
                      View listing
                    </Link>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </>
  );
}
