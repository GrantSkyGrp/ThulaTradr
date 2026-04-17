import Link from "next/link";
import { submitVerificationDocumentAction } from "@/app/actions";
import { requireUser } from "@/lib/auth";
import { getVerificationDocumentsByUserId } from "@/lib/local-db";

export default async function AccountProfilePage() {
  const user = await requireUser();
  const documents = await getVerificationDocumentsByUserId(user.id);

  return (
    <main className="account-shell">
      <div className="container-shell">
        <div className="account-header">
          <div className="thula-kicker">Profile</div>
          <h1 className="account-title">Buyer profile and verification</h1>
          <p className="account-copy">
            This profile layer mirrors the identity and trust checkpoints in the current
            platform before deeper transaction stages.
          </p>
        </div>

        <div className="admin-toolbar">
          <Link href="/account/offers" className="site-nav__button">
            My Offers
          </Link>
          <Link href="/account/transactions" className="site-nav__button">
            Transactions
          </Link>
          <Link href="/account/profile" className="site-nav__button">
            Profile
          </Link>
        </div>

        <article className="account-card">
          <div className="account-card__top">
            <div>
              <h3>{user.name}</h3>
              <p>{user.referenceNumber}</p>
            </div>
            <span
              className={`fleet-status ${
                user.verificationStatus === "verified"
                  ? "fleet-status--accepted"
                  : user.verificationStatus === "rejected"
                    ? "fleet-status--rejected"
                    : "fleet-status--pending"
              }`}
            >
              {user.verificationStatus}
            </span>
          </div>

          <div className="account-card__grid">
            <div>
              <h5>Email</h5>
              <strong>{user.email}</strong>
            </div>
            <div>
              <h5>Phone</h5>
              <strong>{user.phone}</strong>
            </div>
            <div>
              <h5>Role</h5>
              <strong>{user.role}</strong>
            </div>
            <div>
              <h5>Verification State</h5>
              <strong>{user.verificationStatus}</strong>
            </div>
          </div>

          <div className="transaction-panel">
            <div className="transaction-panel__head">
              <h3>Verification documents</h3>
              <p>Submit the same identity and onboarding material the trust workflow depends on.</p>
            </div>

            <form action={submitVerificationDocumentAction} className="auth-form">
              <input type="hidden" name="userEmail" value={user.email} />
              <input type="hidden" name="profilePath" value="/account/profile" />
              <label className="auth-field">
                <span>Document name</span>
                <input
                  type="text"
                  name="name"
                  defaultValue="Buyer Identity Pack"
                  placeholder="Buyer Identity Pack"
                />
              </label>
              <button type="submit" className="site-nav__button">
                Submit Verification Document
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
