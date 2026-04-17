import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findUserById, type LocalUserRecord } from "@/lib/local-db";

const sessionCookieName = "thula_session";

export async function getCurrentUser(): Promise<LocalUserRecord | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(sessionCookieName)?.value;

  if (!session) {
    return null;
  }

  return findUserById(session);
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== "admin") {
    redirect("/account/offers");
  }

  return user;
}

export async function requireSeller() {
  const user = await requireUser();

  if (user.role !== "seller") {
    redirect("/account/offers");
  }

  return user;
}

export async function requireOperator() {
  const user = await requireUser();

  if (user.role !== "operator") {
    redirect("/account/offers");
  }

  return user;
}

export async function requireAdminOrOperator() {
  const user = await requireUser();

  if (user.role !== "admin" && user.role !== "operator") {
    redirect("/account/offers");
  }

  return user;
}

export { sessionCookieName };
