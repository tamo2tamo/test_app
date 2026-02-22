"use client";

import { AdPlaceholder } from "@/components/ad-placeholder";
import { AllocationPie } from "@/components/allocation-pie";
import { Disclaimer } from "@/components/disclaimer";
import { PostCard } from "@/components/post-card";
import { useSearchResults } from "@/components/search-hook";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AllocationMap } from "@/lib/types";

const FIXED_SAMPLE_CASES: Array<{
  id: string;
  title: string;
  tags: string[];
  oneYear: number;
  sinceStart: number;
  allocations: AllocationMap;
}> = [
  {
    id: "sample-domestic",
    title: "国内中心",
    tags: ["30代", "会社員", "安定志向"],
    oneYear: 7.8,
    sinceStart: 24.1,
    allocations: {
      stock_jp: 28,
      stock_global: 7,
      fund_jp_index: 18,
      fund_global_index: 12,
      fund_jp_active: 10,
      fund_global_active: 3,
      reit: 8,
      bond_jp: 8,
      bond_global: 2,
      fx: 1,
      gold: 2,
      other: 1,
    },
  },
  {
    id: "sample-global",
    title: "海外中心",
    tags: ["40代", "会社員", "成長重視"],
    oneYear: 12.9,
    sinceStart: 38.6,
    allocations: {
      stock_jp: 5,
      stock_global: 30,
      fund_jp_index: 5,
      fund_global_index: 30,
      fund_jp_active: 2,
      fund_global_active: 14,
      reit: 4,
      bond_jp: 3,
      bond_global: 4,
      fx: 1,
      gold: 1,
      other: 1,
    },
  },
  {
    id: "sample-balance",
    title: "国内と海外のバランス",
    tags: ["50代", "公務員", "バランス型"],
    oneYear: 9.4,
    sinceStart: 27.3,
    allocations: {
      stock_jp: 15,
      stock_global: 15,
      fund_jp_index: 14,
      fund_global_index: 14,
      fund_jp_active: 6,
      fund_global_active: 6,
      reit: 8,
      bond_jp: 8,
      bond_global: 8,
      fx: 2,
      gold: 2,
      other: 2,
    },
  },
];

export default function HomePage() {
  const { loading, results, controls, skeleton } = useSearchResults();

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-4 md:p-8">
      <SiteHeader />
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">検索（人気順）</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>{controls}</div>
          <div className="rounded-lg border border-border p-3">
            <p className="mb-2 text-sm font-semibold">サンプル事例（3件）</p>
            <div className="space-y-3">
              {FIXED_SAMPLE_CASES.map((sample) => (
                <div key={sample.id} className="rounded-md border border-border p-2">
                  <div className="mb-2 flex flex-wrap gap-2">
                    <Badge>{sample.title}</Badge>
                    {sample.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
                  </div>
                  <p className="mb-2 text-xs text-muted-foreground">
                    利回り過去1年: {sample.oneYear}% / 利回り開始来: {sample.sinceStart}%
                  </p>
                  <AllocationPie allocations={sample.allocations} pieClassName="h-48 w-48" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-4">
          {loading ? skeleton : results.map((result) => <PostCard key={result.post.id} result={result} />)}
          <AdPlaceholder slot="list" />
        </section>
        <aside className="space-y-4">
          <Disclaimer />
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-base">ガイド</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              検索条件は投稿フォームと同一設計です。検索側では家族構成・住居を除外しています。
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}
