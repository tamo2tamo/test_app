import { NextResponse } from "next/server";

import { getSessionContext } from "@/lib/server/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, user, aal } = await getSessionContext();
  const body = await req.json();
  const { id } = await params;

  if (!supabase || !user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (aal !== "aal2") {
    return NextResponse.json({ error: "aal2_required" }, { status: 403 });
  }

  const { error } = await supabase
    .from("posts")
    .update({
      profile: body.profile,
      allocations: body.allocations,
      performance: body.performance,
      memo: body.memo,
      status: "pending",
    })
    .eq("id", id)
    .eq("author_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ postId: id, status: "pending" });
}
