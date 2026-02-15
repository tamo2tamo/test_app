import { NextResponse } from "next/server";

import { getSessionContext } from "@/lib/server/auth";

export async function GET() {
  const { supabase, isAdmin } = await getSessionContext();
  if (!supabase || !isAdmin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { data, error } = await supabase
    .from("posts")
    .select("id,status,created_at,published_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(1000);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const lines = ["id,status,created_at,published_at"];
  (data ?? []).forEach((row) => {
    lines.push(`${row.id},${row.status},${row.created_at},${row.published_at ?? ""}`);
  });

  const csv = `${lines.join("\n")}\n`;
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=approved_posts.csv",
    },
  });
}
