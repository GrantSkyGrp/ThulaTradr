import Link from "next/link";
import { submitListingUpdateRequestAction } from "@/app/actions";
import { requireSeller } from "@/lib/auth";
import { getListingsBySellerId } from "@/lib/local-db";

export default async function SellerListingsPage() {
  const seller = await requireSeller();
  const listings = await getListingsBySellerId(seller.id);

  return (
    <main className="seller-shell">
      <div className="container-shell">
        <div className="seller-header">
          <div className="thula-kicker">Seller Workspace</div>
          <h1 className="admin-title">My fleet listings</h1>
          <p className="admin-copy">
            This is the seller-side equivalent of the current SkyTradr hangar view:
            owned listings, commercial status, and transaction readiness.
          </p>
        </div>

        <div className="admin-toolbar">
          <Link href="/seller/listings" className="site-nav__button">
            My Fleet
          </Link>
          <Link href="/seller/transactions" className="site-nav__button">
            Seller Transactions
          </Link>
          <Link href="/seller/profile" className="site-nav__button">
            Seller Profile
          </Link>
        </div>

        <div className="account-list">
          {listings.map((listing) => (
            <article key={listing.slug} className="account-card">
              <div className="account-card__top">
                <div>
                  <h3>{listing.model}</h3>
                  <p>{listing.code}</p>
                </div>
                <span
                  className={`fleet-status ${
                    listing.status === "under-offer"
                      ? "fleet-status--pending"
                      : "fleet-status--accepted"
                  }`}
                >
                  {listing.status}
                </span>
              </div>

              <div className="account-card__grid">
                <div>
                  <h5>Reserve Price</h5>
                  <strong>{listing.reservePrice}</strong>
                </div>
                <div>
                  <h5>Current List Price</h5>
                  <strong>{listing.currentListPrice}</strong>
                </div>
                <div>
                  <h5>Serial Range</h5>
                  <strong>{listing.serialLabel}</strong>
                </div>
                <div>
                  <h5>Verification</h5>
                  <strong>{listing.verified ? "Verified" : "Pending"}</strong>
                </div>
              </div>

              <div className="transaction-panel">
                <div className="transaction-panel__head">
                  <h3>Listing update request</h3>
                  <p>
                    Seller-side edits are submitted for admin review before they change the
                    live fleet presentation.
                  </p>
                </div>

                <div className="account-card__top">
                  <div>
                    <p>Moderation state</p>
                  </div>
                  <span
                    className={`fleet-status ${
                      listing.updateRequestStatus === "pending"
                        ? "fleet-status--pending"
                        : "fleet-status--accepted"
                    }`}
                  >
                    {listing.updateRequestStatus}
                  </span>
                </div>

                <form action={submitListingUpdateRequestAction} className="auth-form">
                  <input type="hidden" name="listingSlug" value={listing.slug} />
                  <label className="auth-field">
                    <span>Requested reserve price</span>
                    <input
                      type="text"
                      name="requestedReservePrice"
                      defaultValue={listing.reservePrice}
                    />
                  </label>
                  <div className="auth-field">
                    <span>Current Thula list price</span>
                    <input type="text" value={listing.currentListPrice} disabled />
                  </div>
                  <label className="auth-field">
                    <span>Requested description</span>
                    <textarea
                      name="requestedDescription"
                      defaultValue={listing.description}
                      className="auth-textarea"
                    />
                  </label>
                  <button type="submit" className="site-nav__button">
                    Submit Update Request
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
