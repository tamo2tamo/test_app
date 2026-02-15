import { NextResponse } from "next/server";

import { getSessionContext } from "@/lib/server/auth";

export async function GET() {
  const { user, isAdmin, aal } = await getSessionContext();
  return NextResponse.json({
    userId: user?.id ?? null,
    email: user?.email ?? null,
    aal,
    isAdmin,
  });
}
