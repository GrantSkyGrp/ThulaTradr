import Link from "next/link";
import { submitVerificationDocumentAction } from "@/app/actions";
import { requireSeller } from "@/lib/auth";
import { getVerificationDocumentsByUserId } from "@/lib/local-db";

export default async function SellerProfilePage() {
  const seller = await requireSeller();
  const documents = await getVerificationDocumentsByUserId(seller.id);

  return (
    <main className="seller-shell">
      <div className="container-shell">
        <div className="seller-header">
          <div className="thula-kicker">Seller Workspace</div>
          <h1 className="admin-title">Seller profile and verification</h1>
          <p className="admin-copy">
            This reflects the seller-side identity and trust state that underpins
            listing visibility and payout-related workflow in the original platform.
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

        <article className="account-card">
          <div className="account-card__top">
            <div>
              <h3>{seller.name}</h3>
              <p>{seller.referenceNumber}</p>
            </div>
            <span
              className={`fleet-status ${
                seller.verificationStatus === "verified"
                  ? "fleet-status--accepted"
                  : seller.verificationStatus === "rejected"
                    ? "fleet-status--rejected"
                    : "fleet-status--pending"
              }`}
            >
              {seller.verificationStatus}
            </span>
          </div>

          <div className="account-card__grid">
            <div>
              <h5>Email</h5>
              <strong>{seller.email}</strong>
            </div>
            <div>
              <h5>Phone</h5>
              <strong>{seller.phone}</strong>
            </div>
            <div>
              <h5>Role</h5>
              <strong>{seller.role}</strong>
            </div>
            <div>
              <h5>Verification State</h5>
              <strong>{seller.verificationStatus}</strong>
            </div>
          </div>

          <div className="transaction-panel">
            <div className="transaction-panel__head">
              <h3>Seller compliance documents</h3>
              <p>Submit the ownership and compliance material required for listing and payout readiness.</p>
            </div>

            <form action={submitVerificationDocumentAction} className="auth-form">
              <input type="hidden" name="userEmail" value={seller.email} />
              <input type="hidden" name="profilePath" value="/seller/profile" />
              <label className="auth-field">
                <span>Document name</span>
                <input
                  type="text"
                  name="name"
                  defaultValue="Seller Compliance Pack"
                  placeholder="Seller Compliance Pack"
                />
              </label>
              <button type="submit" className="site-nav__button">
                Submit Compliance Document
              </button>
            </form>

            <div className="transaction-documents">
              {documents.map((document) => (
                <div key={document.id} className="transaction-documents__item">
                  <span>{document.name}</span>
                  <span>{document.party}</span>
                  <strong>{document.status}</strong>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
