import Link from "next/link";
import { sendTestEmailAction, updateSiteSettingsAction } from "@/app/actions";
import { requireAdmin } from "@/lib/auth";
import { getSiteSettings } from "@/lib/local-db";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSiteSettings();

  return (
    <main className="admin-shell">
      <div className="container-shell">
        <div className="admin-header">
          <div className="thula-kicker">Admin Settings</div>
          <h1 className="admin-title">Site settings and test email</h1>
          <p className="admin-copy">
            This is the lightweight equivalent of the settings/test-email surface in Laravel.
          </p>
        </div>

        <div className="admin-toolbar">
          <Link href="/admin" className="site-nav__button">
            Overview
          </Link>
          <Link href="/admin/settings" className="site-nav__button">
            Settings
          </Link>
          <Link href="/admin/staff" className="site-nav__button">
            Staff
          </Link>
        </div>

        <article className="account-card">
          <form action={updateSiteSettingsAction} className="auth-form">
            <label className="auth-field">
              <span>Support Email</span>
              <input type="email" name="supportEmail" defaultValue={settings?.supportEmail ?? ""} />
            </label>
            <label className="auth-field">
              <span>Support Phone</span>
              <input type="text" name="supportPhone" defaultValue={settings?.supportPhone ?? ""} />
            </label>
            <label className="auth-field">
              <span>Global Thula List Price</span>
              <input
                type="text"
                name="globalListPrice"
                defaultValue={settings?.globalListPrice ?? ""}
              />
            </label>
            <button type="submit" className="site-nav__button">
              Save Settings
            </button>
          </form>

          <div className="account-card__actions">
            <form action={sendTestEmailAction}>
              <button type="submit" className="site-nav__button">
                Send Test Email Event
              </button>
            </form>
          </div>

          <div className="account-card__grid">
            <div>
              <h5>Current Support Email</h5>
              <strong>{settings?.supportEmail ?? "Not set"}</strong>
            </div>
            <div>
              <h5>Current Global Thula List Price</h5>
              <strong>{settings?.globalListPrice ?? "Not set"}</strong>
            </div>
            <div>
              <h5>Test Email Status</h5>
              <strong>{settings?.testEmailStatus ?? "idle"}</strong>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
