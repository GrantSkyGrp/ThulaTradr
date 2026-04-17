import Link from "next/link";
import { updateUserRoleAction } from "@/app/actions";
import { requireAdmin } from "@/lib/auth";
import { getAllUsers } from "@/lib/local-db";

export default async function AdminStaffPage() {
  await requireAdmin();
  const users = await getAllUsers();

  return (
    <main className="admin-shell">
      <div className="container-shell">
        <div className="admin-header">
          <div className="thula-kicker">Admin Staff</div>
          <h1 className="admin-title">Staff and role management</h1>
          <p className="admin-copy">
            This is a lightweight role-management layer for the local rewrite.
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

        <div className="admin-table">
          <div className="admin-table__row admin-table__row--head">
            <span>Name</span>
            <span>Email</span>
            <span>Reference</span>
            <span>Role</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {users.map((user) => (
            <div key={user.id} className="admin-table__row">
              <span>{user.name}</span>
              <span>{user.email}</span>
              <span>{user.referenceNumber}</span>
              <span>{user.role}</span>
              <span>{user.verificationStatus}</span>
              <form action={updateUserRoleAction} className="admin-inline-form">
                <input type="hidden" name="id" value={user.id} />
                <select name="role" defaultValue={user.role} className="auth-select">
                  <option value="user">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="operator">Operator</option>
                  <option value="admin">Admin</option>
                </select>
                <button type="submit" className="site-nav__button">
                  Update Role
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
