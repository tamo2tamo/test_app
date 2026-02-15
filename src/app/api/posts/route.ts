import { NextRequest, NextResponse } from "next/server";

import { hitRateLimit } from "@/lib/rate-limit";
import { getSessionContext } from "@/lib/server/auth";
import { applyReactionCounts, applyReportCounts, mapPostRow } from "@/lib/server/mappers";

export async function GET(req: NextRequest) {
  const { supabase, user, isAdmin } = await getSessionContext();
  if (!supabase) return NextResponse.json({ items: [] });

  const scope = req.nextUrl.searchParams.get("scope") ?? "default";

  let query = supabase
    .from("posts")
    .select("id,author_id,profile,allocations,performance,memo,status,view_count,created_at,updated_at,published_at")
    .order("created_at", { ascending: false });

  if (scope === "admin") {
    if (!isAdmin) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  } else if (user) {
    query = query.or(`status.eq.published,author_id.eq.${user.id}`);
  } else {
    query = query.eq("status", "published");
  }

  const { data: rows, error } = await query.limit(80);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const posts = (rows ?? []).map(mapPostRow);
  if (!posts.length) return NextResponse.json({ items: [] });

  const ids = posts.map((post) => post.id);
  const [{ data: reactionRows }, { data: reportRows }] = await Promise.all([
    supabase.from("reactions").select("post_id,type").in("post_id", ids),
    supabase.from("reports").select("post_id").in("post_id", ids).eq("status", "open"),
  ]);

  applyReactionCounts(posts, (reactionRows ?? []) as Array<{ post_id: string; type: "helpful" | "clear" | "support" }>);
  applyReportCounts(posts, (reportRows ?? []) as Array<{ post_id: string }>);

  return NextResponse.json({ items: posts });
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (hitRateLimit(`post:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const { supabase, user, aal } = await getSessionContext();
  const payload = await req.json();

  if (!supabase || !user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (aal !== "aal2") {
    return NextResponse.json({ error: "aal2_required" }, { status: 403 });
  }

  const { error } = await supabase.from("posts").insert({
    author_id: user.id,
    status: "pending",
    profile: payload.profile,
    allocations: payload.allocations,
    performance: payload.performance,
    memo: payload.memo,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ status: "pending" });
}
