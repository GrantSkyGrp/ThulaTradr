import Link from "next/link";
import { updatePageContentAction } from "@/app/actions";
import { requireAdmin } from "@/lib/auth";
import { getAllPageContent } from "@/lib/local-db";

export default async function AdminCmsPage() {
  await requireAdmin();
  const pages = await getAllPageContent();

  return (
    <main className="admin-shell">
      <div className="container-shell">
        <div className="admin-header">
          <div className="thula-kicker">Admin CMS</div>
          <h1 className="admin-title">Managed page content</h1>
          <p className="admin-copy">
            This gives the rewrite a first CMS-style layer for public page messaging without
            changing the underlying page structure.
          </p>
        </div>

        <div className="admin-toolbar">
          <Link href="/admin" className="site-nav__button">
            Overview
          </Link>
          <Link href="/admin/cms" className="site-nav__button">
            CMS
          </Link>
          <Link href="/admin/enquiries" className="site-nav__button">
            Enquiries
          </Link>
        </div>

        <div className="account-list">
          {pages.map((page) => (
            <article key={page.slug} className="account-card">
              <div className="transaction-panel__head">
                <h3>{page.slug}</h3>
                <p>Edit the managed copy for this public page.</p>
              </div>

              <form action={updatePageContentAction} className="auth-form">
                <input type="hidden" name="slug" value={page.slug} />
                <label className="auth-field">
                  <span>Eyebrow</span>
                  <input type="text" name="eyebrow" defaultValue={page.eyebrow} />
                </label>
                <label className="auth-field">
                  <span>Title</span>
                  <input type="text" name="title" defaultValue={page.title} />
                </label>
                <label className="auth-field">
                  <span>Description</span>
                  <textarea
                    name="description"
                    className="auth-textarea"
                    defaultValue={page.description}
                  />
                </label>
                <button type="submit" className="site-nav__button">
                  Save Page Content
                </button>
              </form>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
