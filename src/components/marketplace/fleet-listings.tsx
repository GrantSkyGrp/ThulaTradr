import Link from "next/link";

type FleetListing = {
  slug: string;
  model: string;
  code: string;
  reservePrice: string;
  currentListPrice: string;
  serialLabel: string;
  status: "open" | "under-offer";
  verified: boolean;
  description: string;
  imageUrls?: string[];
};

type FleetSortValue =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "reserve-asc"
  | "reserve-desc"
  | "model-asc"
  | "model-desc";

type FleetListingsProps = {
  listings: FleetListing[];
  sort: FleetSortValue;
  onSortChange: (value: FleetSortValue) => void;
  favourites: string[];
  onToggleFavourite: (slug: string) => void;
};

export function FleetListings({
  listings,
  sort,
  onSortChange,
  favourites,
  onToggleFavourite,
}: FleetListingsProps) {
  return (
    <section className="fleet-panel__right">
      <div className="fleet-results-bar">
        <div className="fleet-results-copy">
          <h4>Results</h4>
          <span>({listings.length})</span>
        </div>
        <div className="fleet-results-actions">
          <label className="fleet-sort">
            <span className="sr-only">Sort listings</span>
            <select
              className="fleet-sort__select"
              value={sort}
              onChange={(event) => onSortChange(event.target.value as FleetSortValue)}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="reserve-asc">Reserve: Low to High</option>
              <option value="reserve-desc">Reserve: High to Low</option>
              <option value="model-asc">Model: A to Z</option>
              <option value="model-desc">Model: Z to A</option>
            </select>
          </label>
          <button type="button" className="fleet-filter-toggle">
            Filter
          </button>
        </div>
      </div>

      <div className="fleet-list">
        {listings.map((listing) => (
          <article key={listing.code} className="fleet-listing-card">
            <div className="fleet-listing-card__main">
              <div className="fleet-listing-thumb">
                {listing.status === "under-offer" ? (
                  <div className="fleet-listing-thumb__banner">Under Offer</div>
                ) : null}
                {listing.imageUrls?.[0] ? (
                  <img
                    src={listing.imageUrls[0]}
                    alt={listing.model}
                    className="fleet-listing-thumb__image"
                  />
                ) : null}
              </div>
              <div className="fleet-listing-copy">
                <div className="fleet-listing-title-row">
                  <h3>{listing.model}</h3>
                  {listing.verified ? (
                    <span className="fleet-verified-badge">Verified</span>
                  ) : null}
                  <button
                    type="button"
                    className="fleet-wishlist"
                    aria-label="Toggle favourite"
                    aria-pressed={favourites.includes(listing.slug)}
                    onClick={() => onToggleFavourite(listing.slug)}
                  >
                    {favourites.includes(listing.slug) ? "\u2605" : "\u2606"}
                  </button>
                </div>
                <p className="fleet-listing-code">{listing.code}</p>

                <div className="fleet-listing-meta">
                  <div>
                    <h5>Reserve Price</h5>
                    <strong>{listing.reservePrice}</strong>
                  </div>
                  <div>
                    <h5>Current Thula List Price</h5>
                    <strong>{listing.currentListPrice}</strong>
                  </div>
                  <div className="fleet-listing-meta__spacer" aria-hidden="true" />
                </div>

                <div className="fleet-listing-actions">
                  <Link
                    href={`/marketplace/${listing.slug}`}
                    className={`button-primary fleet-offer-button${listing.status === "under-offer" ? " fleet-offer-button--disabled" : ""}`}
                    aria-disabled={listing.status === "under-offer"}
                    tabIndex={listing.status === "under-offer" ? -1 : undefined}
                    onClick={(event) => {
                      if (listing.status === "under-offer") {
                        event.preventDefault();
                      }
                    }}
                  >
                    Make an Offer
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
