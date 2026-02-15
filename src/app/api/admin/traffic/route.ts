import { NextResponse } from "next/server";

import { getSessionContext } from "@/lib/server/auth";

export async function GET() {
  const { supabase, isAdmin } = await getSessionContext();
  if (!supabase || !isAdmin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { data, error } = await supabase
    .from("traffic_attributions")
    .select("tracked_date,utm_source,referrer,landing")
    .order("tracked_date", { ascending: false })
    .limit(500);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const grouped = new Map<string, { date: string; utm_source: string; referrer: string; landing: string; visits: number }>();
  (data ?? []).forEach((row) => {
    const key = `${row.tracked_date}|${row.utm_source}|${row.referrer}|${row.landing}`;
    const current = grouped.get(key) ?? {
      date: String(row.tracked_date),
      utm_source: row.utm_source ?? "",
      referrer: row.referrer ?? "",
      landing: row.landing ?? "",
      visits: 0,
    };
    current.visits += 1;
    grouped.set(key, current);
  });

  return NextResponse.json({ items: [...grouped.values()] });
}
