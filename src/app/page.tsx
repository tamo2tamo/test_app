"use client";

import { AdPlaceholder } from "@/components/ad-placeholder";
import { AllocationPie } from "@/components/allocation-pie";
import { Disclaimer } from "@/components/disclaimer";
import { PostCard } from "@/components/post-card";
import { useSearchResults } from "@/components/search-hook";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
            <p className="mb-2 text-sm font-semibold">サンプル情報</p>
            {results[0] ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge>{results[0].post.profile.age}代</Badge>
                  <Badge>{results[0].post.profile.occupation}</Badge>
                  <Badge>一致 {results[0].matchScore}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  利回り過去1年: {results[0].post.performance.oneYear}% / 利回り開始来: {results[0].post.performance.sinceStart}%
                </p>
                <AllocationPie allocations={results[0].post.allocations} pieClassName="h-72 w-72" />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">サンプル表示データがありません。</p>
            )}
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
