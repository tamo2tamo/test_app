import { NextResponse } from "next/server";

import { getSessionContext } from "@/lib/server/auth";

export async function GET() {
  const { supabase, user } = await getSessionContext();
  if (!supabase || !user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("profiles")
    .select("display_name,age_group,occupation,annual_income_band,investment_history,nisa_type,risk_tolerance,investment_policy,family_type,housing_type,invest_cash_ratio,mfa_enabled")
    .eq("id", user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({
    profile: data
      ? {
          displayName: data.display_name ?? "",
          ageGroup: data.age_group ?? null,
          occupation: data.occupation ?? null,
          annualIncomeBand: data.annual_income_band ?? null,
          investmentHistory: data.investment_history ?? null,
          nisaType: data.nisa_type ?? null,
          riskTolerance: data.risk_tolerance ?? null,
          investmentPolicy: data.investment_policy ?? null,
          familyType: data.family_type ?? null,
          housingType: data.housing_type ?? null,
          investCashRatio: data.invest_cash_ratio ?? null,
          mfaEnabled: Boolean(data.mfa_enabled),
        }
      : null,
  });
}

export async function PUT(req: Request) {
  const { supabase, user } = await getSessionContext();
  if (!supabase || !user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const payload = {
    id: user.id,
    display_name: body.displayName ?? null,
    age_group: body.ageGroup ?? null,
    occupation: body.occupation ?? null,
    annual_income_band: body.annualIncomeBand ?? null,
    investment_history: body.investmentHistory ?? null,
    nisa_type: body.nisaType ?? null,
    risk_tolerance: body.riskTolerance ?? null,
    investment_policy: body.investmentPolicy ?? null,
    family_type: body.familyType ?? null,
    housing_type: body.housingType ?? null,
    invest_cash_ratio: body.investCashRatio ?? null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
