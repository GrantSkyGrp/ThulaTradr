import Link from "next/link";
import { updatePartnerStatusAction } from "@/app/actions";
import { requireAdmin } from "@/lib/auth";
import { getAllPartners } from "@/lib/local-db";

export default async function AdminPartnersPage() {
  await requireAdmin();
  const partners = await getAllPartners();

  return (
    <main className="admin-shell">
      <div className="container-shell">
        <div className="admin-header">
          <div className="thula-kicker">Admin Partners</div>
          <h1 className="admin-title">Partner management</h1>
          <p className="admin-copy">
            This is the first partner-management surface for the rewrite, aligned to the
            broader platform-management layer in Laravel.
          </p>
        </div>

        <div className="admin-toolbar">
          <Link href="/admin" className="site-nav__button">
            Overview
          </Link>
          <Link href="/admin/leads" className="site-nav__button">
            Leads
          </Link>
          <Link href="/admin/partners" className="site-nav__button">
            Partners
          </Link>
          <Link href="/admin/reports" className="site-nav__button">
            Reports
          </Link>
        </div>

        <div className="admin-table">
          <div className="admin-table__row admin-table__row--head">
            <span>Name</span>
            <span>Category</span>
            <span>Status</span>
            <span>Created</span>
            <span>Action</span>
            <span />
          </div>
          {partners.map((partner) => (
            <div key={partner.id} className="admin-table__row">
              <span>{partner.name}</span>
              <span>{partner.category}</span>
              <span>{partner.status}</span>
              <span>{new Date(partner.createdAt).toLocaleDateString("en-ZA")}</span>
              <form action={updatePartnerStatusAction} className="admin-inline-form">
                <input type="hidden" name="id" value={partner.id} />
                <button
                  type="submit"
                  name="status"
                  value={partner.status === "draft" ? "active" : "draft"}
                  className="site-nav__button"
                >
                  {partner.status === "draft" ? "Activate" : "Move To Draft"}
                </button>
              </form>
              <span />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
