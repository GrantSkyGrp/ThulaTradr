import Link from "next/link";
import {
  updateUserVerificationStatusAction,
  updateVerificationDocumentStatusAction,
} from "@/app/actions";
import { requireAdmin } from "@/lib/auth";
import {
  getAllUsers,
  getVerificationDocumentsByUserId,
  type LocalUserRecord,
  type LocalVerificationDocumentRecord,
} from "@/lib/local-db";

export default async function AdminUsersPage() {
  await requireAdmin();
  const users = await getAllUsers();
  const bundles = await Promise.all(
    users.map(async (user: LocalUserRecord) => ({
      user,
      documents: await getVerificationDocumentsByUserId(user.id),
    })),
  );

  return (
    <main className="admin-shell">
      <div className="container-shell">
        <div className="admin-header">
          <div className="thula-kicker">Admin Users</div>
          <h1 className="admin-title">Profile and verification oversight</h1>
          <p className="admin-copy">
            This brings the verification gate into the rewrite so admin can approve or
            reject buyer and seller identities as part of the trust workflow.
          </p>
        </div>

        <div className="admin-toolbar">
          <Link href="/admin/listings" className="site-nav__button">
            Listings
          </Link>
          <Link href="/admin/offers" className="site-nav__button">
            Offers
          </Link>
          <Link href="/admin/transactions" className="site-nav__button">
            Transactions
          </Link>
          <Link href="/admin/users" className="site-nav__button">
            Users
          </Link>
        </div>

        <div className="admin-table">
          <div className="admin-table__row admin-table__row--head">
            <span>Name</span>
            <span>Reference</span>
            <span>Role</span>
            <span>Email</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {bundles.map(({ user, documents }) => (
            <div key={user.id} className="admin-users-bundle">
              <div className="admin-table__row">
                <span>{user.name}</span>
                <span>{user.referenceNumber}</span>
                <span>{user.role}</span>
                <span>{user.email}</span>
                <span>{user.verificationStatus}</span>
                <form action={updateUserVerificationStatusAction} className="admin-inline-form admin-inline-form--stack">
                  <input type="hidden" name="id" value={user.id} />
                  <button type="submit" name="status" value="verified" className="site-nav__button">
                    Verify
                  </button>
                  <button type="submit" name="status" value="rejected" className="site-nav__button">
                    Reject
                  </button>
                  <button type="submit" name="status" value="pending" className="site-nav__button">
                    Reset
                  </button>
                </form>
              </div>

              {documents.length > 0 ? (
                <div className="admin-user-documents">
                  {documents.map((document: LocalVerificationDocumentRecord) => (
                    <div key={document.id} className="transaction-documents__item">
                      <span>{document.name}</span>
                      <span>{document.party}</span>
                      <strong>{document.status}</strong>
                      <form action={updateVerificationDocumentStatusAction} className="admin-inline-form">
                        <input type="hidden" name="id" value={document.id} />
                        <button
                          type="submit"
                          name="status"
                          value={document.status === "pending" ? "received" : "pending"}
                          className="site-nav__button"
                        >
                          {document.status === "pending" ? "Mark Received" : "Reset"}
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
