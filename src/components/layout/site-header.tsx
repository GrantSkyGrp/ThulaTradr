import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import type { BrandConfig } from "@/lib/branding/types";
import { logoutAction } from "@/app/actions";
import { BrandLogo } from "@/components/layout/brand-logo";

type SiteHeaderProps = {
  brand: BrandConfig;
};

export async function SiteHeader({ brand }: SiteHeaderProps) {
  const user = await getCurrentUser();
  const navigationItems =
    user?.role === "admin" ? [{ href: "/admin", label: "Admin Portal" }] : brand.navigation;
  const profileLinks = user
    ? [
        ...(user.role !== "admin"
          ? [
              { href: "/account/offers", label: "My Offers" },
              { href: "/account/transactions", label: "Transactions" },
            ]
          : []),
        ...(user.role === "user"
          ? [
              { href: "/account/wallet", label: "Wallet" },
              { href: "/account/notifications", label: "Activity" },
              { href: "/account/profile", label: "Profile" },
            ]
          : []),
        ...(user.role === "seller"
          ? [
              { href: "/seller/listings", label: "My Fleet" },
              { href: "/seller/offers", label: "Offer Inbox" },
              { href: "/seller/notifications", label: "Activity" },
              { href: "/seller/profile", label: "Seller Profile" },
            ]
          : []),
        ...(user.role === "operator" ? [{ href: "/operations", label: "Operations" }] : []),
      ]
    : [];
  const profileInitial = user?.name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <header className="site-header">
      <div className="container-shell site-header__inner">
        <BrandLogo href="/" priority />

        <nav className="site-nav" aria-label="Main navigation">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          {user ? (
            <details className="profile-menu">
              <summary className="profile-menu__trigger" aria-label="Open profile menu">
                <span className="profile-menu__avatar" aria-hidden="true">
                  {profileInitial}
                </span>
              </summary>
              <div className="profile-menu__panel">
                <div className="profile-menu__identity">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                  <small>{user.role}</small>
                </div>
                <div className="profile-menu__links">
                  {profileLinks.map((item) => (
                    <Link key={item.href} href={item.href}>
                      {item.label}
                    </Link>
                  ))}
                </div>
                <form action={logoutAction}>
                  <button type="submit" className="profile-menu__sign-out">
                    Sign Out
                  </button>
                </form>
              </div>
            </details>
          ) : (
            <Link href="/login">Sign In</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
