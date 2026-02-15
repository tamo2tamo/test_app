import { AllocationMap, PostRecord, ProfileInput, ReportRecord } from "@/lib/types";

const profiles: ProfileInput[] = [
  { age: "20", family: "single", housing: "rent", occupation: "employee", income: "b300_500", history: "u1", nisa: "tsumitate_only", risk: "mid", policy: "long_term", investCash: "10_90" },
  { age: "30", family: "married_no_child", housing: "rent", occupation: "employee", income: "b500_800", history: "b1_3", nisa: "both", risk: "mid", policy: "balanced", investCash: "25_75" },
  { age: "40", family: "married_with_child", housing: "own", occupation: "public_servant", income: "b800_1200", history: "b3_5", nisa: "both", risk: "mid", policy: "balanced", investCash: "50_50" },
  { age: "50", family: "married_with_child", housing: "own", occupation: "self_employed", income: "o1200", history: "b5_10", nisa: "growth_only", risk: "high", policy: "aggressive", investCash: "50_50" },
  { age: "60+", family: "other", housing: "own", occupation: "unemployed", income: "u300", history: "o10", nisa: "tsumitate_only", risk: "low", policy: "long_term", investCash: "10_90" },
];

const allocationPatterns: AllocationMap[] = [
  { stock_jp: 8, stock_global: 24, fund_jp_index: 8, fund_global_index: 36, fund_jp_active: 3, fund_global_active: 6, reit: 4, bond_jp: 5, bond_global: 4, fx: 1, gold: 1, other: 0 },
  { stock_jp: 20, stock_global: 18, fund_jp_index: 8, fund_global_index: 20, fund_jp_active: 6, fund_global_active: 8, reit: 5, bond_jp: 6, bond_global: 6, fx: 1, gold: 2, other: 0 },
  { stock_jp: 5, stock_global: 12, fund_jp_index: 10, fund_global_index: 24, fund_jp_active: 5, fund_global_active: 8, reit: 8, bond_jp: 12, bond_global: 10, fx: 2, gold: 3, other: 1 },
  { stock_jp: 28, stock_global: 24, fund_jp_index: 4, fund_global_index: 16, fund_jp_active: 3, fund_global_active: 7, reit: 4, bond_jp: 4, bond_global: 4, fx: 3, gold: 2, other: 1 },
];

function makePost(index: number): PostRecord {
  const profile = profiles[index % profiles.length];
  const allocations = allocationPatterns[index % allocationPatterns.length];
  const now = Date.now();
  return {
    id: `post-${index + 1}`,
    authorId: `user-${(index % 4) + 1}`,
    profile,
    allocations,
    performance: {
      oneYear: Number((Math.random() * 25 - 5).toFixed(1)),
      sinceStart: Number((Math.random() * 80 - 10).toFixed(1)),
    },
    memo: "長期積立を軸に、下落局面ではリバランス。金融助言ではなく、自己申告データです。",
    status: "published",
    views: 200 + index * 14,
    createdAt: new Date(now - index * 1000 * 60 * 60 * 17).toISOString(),
    updatedAt: new Date(now - index * 1000 * 60 * 60 * 8).toISOString(),
    publishedAt: new Date(now - index * 1000 * 60 * 60 * 16).toISOString(),
    reactions: {
      helpful: 10 + index,
      clear: 7 + (index % 5),
      support: 5 + (index % 4),
    },
    reports: index % 6 === 0 ? 1 : 0,
  };
}

export const mockPosts: PostRecord[] = Array.from({ length: 16 }).map((_, idx) => makePost(idx));

export const mockReports: ReportRecord[] = [
  {
    id: "report-1",
    postId: "post-3",
    reason: "other",
    memo: "表現が強めに感じました",
    status: "open",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
];
