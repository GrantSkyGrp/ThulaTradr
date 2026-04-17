import Link from "next/link";
import {
  updateListingStatusAction,
  updateListingUpdateRequestStatusAction,
} from "@/app/actions";
import { requireAdmin } from "@/lib/auth";
import { getAllListings, getListingUpdateRequests } from "@/lib/local-db";

export default async function AdminListingsPage() {
  await requireAdmin();
  const listings = await getAllListings();
  const updateRequests = await getListingUpdateRequests();

  return (
    <main className="admin-shell">
      <div className="container-shell">
        <div className="admin-header">
          <div className="thula-kicker">Admin Listings</div>
          <h1 className="admin-title">Fleet inventory oversight</h1>
          <p className="admin-copy">
            This is the first managed listing surface for the rewrite. The public fleet
            page is now reading from the local application database, not hard-coded brand config.
          </p>
        </div>

        <div className="admin-toolbar">
          <Link href="/admin/listings" className="site-nav__button">
            Listings
          </Link>
          <Link href="/admin/offers" className="site-nav__button">
            Offers
          </Link>
          <Link href="/admin/activity" className="site-nav__button">
            Activity
          </Link>
        </div>

        <div className="admin-table">
          <div className="admin-table__row admin-table__row--head">
            <span>Model</span>
            <span>Code</span>
            <span>Status</span>
            <span>Reserve</span>
            <span>Current List</span>
            <span>Action</span>
          </div>
          {listings.map((listing) => (
            <div key={listing.slug} className="admin-table__row">
              <span>{listing.model}</span>
              <span>{listing.code}</span>
              <span>{listing.status}</span>
              <span>{listing.reservePrice}</span>
              <span>{listing.currentListPrice}</span>
              <form action={updateListingStatusAction} className="admin-inline-form">
                <input type="hidden" name="slug" value={listing.slug} />
                <input
                  type="hidden"
                  name="status"
                  value={listing.status === "open" ? "under-offer" : "open"}
                />
                <button type="submit" className="site-nav__button">
                  {listing.status === "open" ? "Mark Under Offer" : "Reopen"}
                </button>
              </form>
            </div>
          ))}
        </div>

        <section className="account-card admin-section-gap">
          <div className="transaction-panel__head">
            <h3>Seller update requests</h3>
            <p>
              Seller-side listing edits stay reviewable here before they affect the public
              fleet or listing-detail surfaces.
            </p>
          </div>

          <div className="account-list">
            {updateRequests.length === 0 ? (
              <article className="account-card">
                <h3>No pending or historical update requests</h3>
                <p>Seller-submitted listing edits will appear here for moderation.</p>
              </article>
            ) : (
              updateRequests.map((request) => (
                <article key={request.id} className="account-card">
                  <div className="account-card__top">
                    <div>
                      <h3>{request.listingSlug}</h3>
                      <p>{request.createdAt}</p>
                    </div>
                    <span
                      className={`fleet-status ${
                        request.status === "approved"
                          ? "fleet-status--accepted"
                          : request.status === "rejected"
                            ? "fleet-status--rejected"
                            : "fleet-status--pending"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="account-card__grid">
                    <div>
                      <h5>Requested Reserve</h5>
                      <strong>{request.requestedReservePrice}</strong>
                    </div>
                    <div>
                      <h5>Current Thula List Price</h5>
                      <strong>Managed globally in Admin Settings</strong>
                    </div>
                  </div>

                  <div className="transaction-panel">
                    <div className="transaction-panel__head">
                      <h3>Requested description</h3>
                    </div>
                    <p className="account-copy">{request.requestedDescription}</p>
                  </div>

                  {request.status === "pending" ? (
                    <div className="account-card__actions">
                      <form action={updateListingUpdateRequestStatusAction} className="admin-inline-form">
                        <input type="hidden" name="id" value={request.id} />
                        <button
                          type="submit"
                          name="status"
                          value="approved"
                          className="site-nav__button"
                        >
                          Approve Request
                        </button>
                        <button
                          type="submit"
                          name="status"
                          value="rejected"
                          className="site-nav__button"
                        >
                          Reject Request
                        </button>
                      </form>
                    </div>
                  ) : null}
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
