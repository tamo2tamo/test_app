import Link from "next/link";

import { AllocationPie } from "@/components/allocation-pie";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchResult } from "@/lib/types";

export function PostCard({ result }: { result: SearchResult }) {
  const { post, matchScore, reasons } = result;

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">{post.profile.age}代 / {post.profile.occupation}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-slate-900 text-white">一致スコア {matchScore}</Badge>
            <Link href={`/p/${post.id}`}>
              <Button variant="secondary" size="sm">詳細を見る</Button>
            </Link>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{reasons.join(" / ") || "条件を調整するとさらに近いケースが見つかります"}</p>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-[1fr_1fr]">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <Badge>年収: {post.profile.income}</Badge>
            <Badge>投資歴: {post.profile.history}</Badge>
            <Badge>NISA: {post.profile.nisa}</Badge>
            <Badge>方針: {post.profile.policy}</Badge>
          </div>
          <div className="text-sm text-muted-foreground">利回り過去1年: {post.performance.oneYear}% / 利回り開始来: {post.performance.sinceStart}%</div>
          <div className="text-sm text-muted-foreground">人気指標: 閲覧 {post.views} / 通報 {post.reports}</div>
        </div>
        <AllocationPie allocations={post.allocations} pieClassName="h-56 w-56" />
      </CardContent>
    </Card>
  );
}
