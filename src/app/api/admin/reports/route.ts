import { NextResponse } from "next/server";

import { getSessionContext } from "@/lib/server/auth";

export async function POST(req: Request) {
  const { supabase, user, isAdmin } = await getSessionContext();
  const body = await req.json();

  if (!supabase || !user || !isAdmin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  if (body.action === "hide") {
    await supabase.from("posts").update({ status: "hidden" }).eq("id", body.postId);
  }

  const { error } = await supabase
    .from("reports")
    .update({ status: "resolved", resolved_at: new Date().toISOString() })
    .eq("id", body.reportId);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await supabase.from("admin_actions").insert({
    admin_id: user.id,
    target_post_id: body.postId,
    target_report_id: body.reportId,
    action: body.action === "hide" ? "hide" : "restore",
    note: body.note ?? null,
  });

  return NextResponse.json({ ok: true });
}
