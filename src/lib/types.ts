import {
  AGE_OPTIONS,
  ALLOCATION_KEYS,
  FAMILY_OPTIONS,
  HISTORY_OPTIONS,
  HOUSING_OPTIONS,
  INCOME_OPTIONS,
  INVEST_CASH_OPTIONS,
  NISA_OPTIONS,
  OCCUPATION_OPTIONS,
  POLICY_OPTIONS,
  REACTION_OPTIONS,
  REPORT_REASON_OPTIONS,
  RISK_OPTIONS,
} from "@/lib/constants";

export type AgeGroup = (typeof AGE_OPTIONS)[number];
export type FamilyType = (typeof FAMILY_OPTIONS)[number];
export type HousingType = (typeof HOUSING_OPTIONS)[number];
export type OccupationType = (typeof OCCUPATION_OPTIONS)[number];
export type IncomeType = (typeof INCOME_OPTIONS)[number];
export type HistoryType = (typeof HISTORY_OPTIONS)[number];
export type NisaType = (typeof NISA_OPTIONS)[number];
export type RiskType = (typeof RISK_OPTIONS)[number];
export type PolicyType = (typeof POLICY_OPTIONS)[number];
export type InvestCashType = (typeof INVEST_CASH_OPTIONS)[number];
export type AllocationKey = (typeof ALLOCATION_KEYS)[number];
export type ReactionType = (typeof REACTION_OPTIONS)[number];
export type ReportReason = (typeof REPORT_REASON_OPTIONS)[number];

export type PostStatus = "draft" | "pending" | "published" | "hidden" | "rejected";

export interface ProfileInput {
  age: AgeGroup;
  family: FamilyType;
  housing: HousingType;
  occupation: OccupationType;
  income: IncomeType;
  history: HistoryType;
  nisa: NisaType;
  risk: RiskType;
  policy: PolicyType;
  investCash: InvestCashType;
}

export type AllocationMap = Record<AllocationKey, number>;

export interface Performance {
  oneYear: number;
  sinceStart: number;
}

export interface PostRecord {
  id: string;
  authorId: string;
  profile: ProfileInput;
  allocations: AllocationMap;
  performance: Performance;
  memo: string;
  status: PostStatus;
  views: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  reactions: Record<ReactionType, number>;
  reports: number;
}

export interface ReportRecord {
  id: string;
  postId: string;
  reason: ReportReason;
  memo: string;
  status: "open" | "resolved";
  createdAt: string;
}

export interface SearchInput {
  profile: Partial<Omit<ProfileInput, "family" | "housing">>;
  allocations?: Partial<AllocationMap>;
  performance?: Partial<Performance>;
  sort: "popular" | "new" | "match";
}

export interface SearchResult {
  post: PostRecord;
  matchScore: number;
  reasons: string[];
  popularityScore: number;
}
