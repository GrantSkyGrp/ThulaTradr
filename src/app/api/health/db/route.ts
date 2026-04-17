import { NextResponse } from "next/server";
import { getAllUsers, getSiteSettings } from "@/lib/local-db";

export async function GET() {
  try {
    const [users, settings] = await Promise.all([getAllUsers(), getSiteSettings()]);

    return NextResponse.json({
      ok: true,
      users: users.length,
      hasSettings: Boolean(settings),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
