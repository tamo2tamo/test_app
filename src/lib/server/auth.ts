import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getSessionContext() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { supabase: null, user: null, isAdmin: false, aal: "aal1" as const };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();
    isAdmin = Boolean(data?.is_admin);
  }

  const aal = ((user?.app_metadata as Record<string, unknown> | undefined)?.aal ?? "aal1") as "aal1" | "aal2";

  return { supabase, user, isAdmin, aal };
}

export function ensureAdmin(isAdmin: boolean) {
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 });
  }
  return null;
}

export function ensureUser(user: { id: string } | null) {
  if (!user) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  }
  return null;
}
