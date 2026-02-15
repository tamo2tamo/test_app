import { NextResponse } from "next/server";

import { hitRateLimit } from "@/lib/rate-limit";
import { getSessionContext } from "@/lib/server/auth";
import { mapReportRow } from "@/lib/server/mappers";

export async function GET() {
  const { supabase, isAdmin } = await getSessionContext();
  if (!supabase || !isAdmin) return NextResponse.json({ items: [] });

  const { data, error } = await supabase
    .from("reports")
    .select("id,post_id,reason,memo,status,created_at")
    .order("created_at", { ascending: false })
    .limit(80);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ items: (data ?? []).map(mapReportRow) });
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (hitRateLimit(`report:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const { supabase, user, aal } = await getSessionContext();
  const body = await req.json();

  if (!supabase || !user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (aal !== "aal2") {
    return NextResponse.json({ error: "aal2_required" }, { status: 403 });
  }

  const { error } = await supabase.from("reports").insert({
    post_id: body.postId,
    reporter_id: user.id,
    reason: body.reason,
    memo: body.memo,
    status: "open",
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ status: "open" });
}
