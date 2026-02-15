import { NextResponse } from "next/server";

import { hitRateLimit } from "@/lib/rate-limit";
import { getSessionContext } from "@/lib/server/auth";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (hitRateLimit(`reaction:${ip}`, 20, 60_000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const { supabase, user, aal } = await getSessionContext();
  const body = await req.json();

  if (!supabase || !user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (aal !== "aal2") return NextResponse.json({ error: "aal2_required" }, { status: 403 });

  const { error } = await supabase.from("reactions").upsert({
    post_id: body.postId,
    user_id: user.id,
    type: body.type,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
