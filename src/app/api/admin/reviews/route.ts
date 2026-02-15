import { NextResponse } from "next/server";

import { getSessionContext } from "@/lib/server/auth";

export async function POST(req: Request) {
  const { supabase, user, isAdmin } = await getSessionContext();
  const body = await req.json();

  if (!supabase || !user || !isAdmin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const action = body.action === "approve" ? "published" : body.action === "reject" ? "rejected" : "hidden";

  const { error } = await supabase.from("posts").update({ status: action }).eq("id", body.postId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await supabase.from("admin_actions").insert({
    admin_id: user.id,
    target_post_id: body.postId,
    action: body.action,
    note: body.note ?? null,
  });

  return NextResponse.json({ ok: true });
}
