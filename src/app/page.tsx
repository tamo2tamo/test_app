"use client";

import { AdPlaceholder } from "@/components/ad-placeholder";
import { Disclaimer } from "@/components/disclaimer";
import { PostCard } from "@/components/post-card";
import { useSearchResults } from "@/components/search-hook";
import { SiteHeader } from "@/components/site-header";
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
        <CardContent>{controls}</CardContent>
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
