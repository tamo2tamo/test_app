import { NextResponse } from "next/server";

import { getSessionContext } from "@/lib/server/auth";
import { applyReactionCounts, applyReportCounts, mapPostRow } from "@/lib/server/mappers";
import { computeMatch, sortResults } from "@/lib/scoring";
import { SearchInput } from "@/lib/types";

export async function POST(req: Request) {
  const body = (await req.json()) as SearchInput;
  const { supabase } = await getSessionContext();

  if (!supabase) return NextResponse.json({ items: [] });

  const { data: rows, error } = await supabase
    .from("posts")
    .select("id,author_id,profile,allocations,performance,memo,status,view_count,created_at,updated_at,published_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(80);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const posts = (rows ?? []).map(mapPostRow);
  const ids = posts.map((post) => post.id);
  if (ids.length) {
    const [{ data: reactionRows }, { data: reportRows }] = await Promise.all([
      supabase.from("reactions").select("post_id,type").in("post_id", ids),
      supabase.from("reports").select("post_id").in("post_id", ids).eq("status", "open"),
    ]);
    applyReactionCounts(posts, (reactionRows ?? []) as Array<{ post_id: string; type: "helpful" | "clear" | "support" }>);
    applyReportCounts(posts, (reportRows ?? []) as Array<{ post_id: string }>);
  }

  const results = sortResults(posts.map((post) => computeMatch(post, body)), body.sort ?? "popular");

  return NextResponse.json({
    items: results,
    algorithm: {
      scoreRange: "0-100",
      profile: "max 40",
      allocation: "max 40 by L1 distance",
      performance: "max 20",
    },
  });
}
