export const AGE_OPTIONS = ["20", "30", "40", "50", "60+"] as const;
export const FAMILY_OPTIONS = ["single", "married_no_child", "married_with_child", "other"] as const;
export const HOUSING_OPTIONS = ["own", "rent"] as const;
export const OCCUPATION_OPTIONS = ["employee", "public_servant", "self_employed", "student", "unemployed", "other"] as const;
export const INCOME_OPTIONS = ["u300", "b300_500", "b500_800", "b800_1200", "o1200", "no_answer"] as const;
export const HISTORY_OPTIONS = ["u1", "b1_3", "b3_5", "b5_10", "o10"] as const;
export const NISA_OPTIONS = ["tsumitate_only", "growth_only", "both"] as const;
export const RISK_OPTIONS = ["low", "mid", "high"] as const;
export const POLICY_OPTIONS = ["long_term", "balanced", "aggressive"] as const;
export const INVEST_CASH_OPTIONS = ["5_95", "10_90", "25_75", "50_50"] as const;
export const REACTION_OPTIONS = ["helpful", "clear", "support"] as const;
export const REPORT_REASON_OPTIONS = ["abuse", "ad", "scam", "other"] as const;

export const ALLOCATION_KEYS = [
  "stock_jp",
  "stock_global",
  "fund_jp_index",
  "fund_global_index",
  "fund_jp_active",
  "fund_global_active",
  "reit",
  "bond_jp",
  "bond_global",
  "fx",
  "gold",
  "other",
] as const;

export const NG_WORDS = ["死ね", "バカ", "詐欺", "絶対儲かる", "必ず勝てる", "勧誘", "紹介コード"];
