import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

const adminNavigation = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/listings", label: "Listings" },
  { href: "/admin/offers", label: "Offers" },
  { href: "/admin/transactions", label: "Transactions" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/cms", label: "CMS" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/partners", label: "Partners" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/staff", label: "Staff" },
  { href: "/admin/wallet", label: "Wallet" },
  { href: "/admin/activity", label: "Activity" },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminLayoutInner>{children}</AdminLayoutInner>
  );
}

async function AdminLayoutInner({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await requireAdmin();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <p className="admin-sidebar__eyebrow">Admin Portal</p>
        <h1 className="admin-sidebar__title">Thula Control Panel</h1>
        <p className="admin-sidebar__user">{admin.name}</p>

        <nav className="admin-sidebar__nav" aria-label="Admin navigation">
          {adminNavigation.map((item) => (
            <Link key={item.href} href={item.href} className="admin-sidebar__link">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="admin-layout__content">{children}</div>
    </div>
  );
}
