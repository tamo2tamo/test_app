import { ALLOCATION_KEYS } from "@/lib/constants";
import { AllocationMap, PostRecord, SearchInput, SearchResult } from "@/lib/types";

const PROFILE_WEIGHTS: Array<{ key: keyof SearchInput["profile"]; label: string; weight: number }> = [
  { key: "age", label: "年代", weight: 10 },
  { key: "occupation", label: "職業", weight: 7 },
  { key: "income", label: "年収帯", weight: 7 },
  { key: "history", label: "投資歴", weight: 6 },
  { key: "nisa", label: "NISA区分", weight: 4 },
  { key: "risk", label: "リスク許容度", weight: 3 },
  { key: "policy", label: "投資方針", weight: 3 },
];

function allocationL1Distance(a: AllocationMap, b: AllocationMap) {
  return ALLOCATION_KEYS.reduce((sum, key) => sum + Math.abs((a[key] ?? 0) - (b[key] ?? 0)), 0);
}

export function computeMatch(post: PostRecord, input: SearchInput): SearchResult {
  let profileScore = 0;
  const reasons: string[] = [];

  PROFILE_WEIGHTS.forEach(({ key, label, weight }) => {
    const expected = input.profile[key];
    if (expected && post.profile[key] === expected) {
      profileScore += weight;
      reasons.push(`${label}が一致`);
    }
  });

  const targetAllocation: AllocationMap = {
    ...post.allocations,
    ...input.allocations,
  };

  const l1 = allocationL1Distance(post.allocations, targetAllocation);
  const allocationScore = Math.max(0, Math.round(40 * (1 - l1 / 200)));
  const perfDelta = Math.abs((input.performance?.oneYear ?? post.performance.oneYear) - post.performance.oneYear)
    + Math.abs((input.performance?.sinceStart ?? post.performance.sinceStart) - post.performance.sinceStart);
  const performanceScore = Math.max(0, Math.round(20 * (1 - perfDelta / 2000)));

  if (allocationScore >= 30) reasons.push("配分が近い");
  if (performanceScore >= 14) reasons.push("成績のレンジが近い");

  const matchScore = Math.min(100, Math.round(profileScore + allocationScore + performanceScore));

  const hours = (Date.now() - Date.parse(post.createdAt)) / (1000 * 60 * 60);
  const freshness = Math.max(0, 20 - hours / 36);
  const reactionTotal = Object.values(post.reactions).reduce((a, b) => a + b, 0);
  const popularityScore = Math.round(reactionTotal * 2 + post.views * 0.12 + freshness - post.reports * 4);

  return {
    post,
    matchScore,
    reasons: reasons.slice(0, 3),
    popularityScore,
  };
}

export function sortResults(results: SearchResult[], sort: SearchInput["sort"]) {
  if (sort === "new") {
    return [...results].sort((a, b) => Date.parse(b.post.createdAt) - Date.parse(a.post.createdAt));
  }
  if (sort === "match") {
    return [...results].sort((a, b) => b.matchScore - a.matchScore);
  }
  return [...results].sort((a, b) => b.popularityScore - a.popularityScore);
}
