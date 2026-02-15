"use client";

import { useParams } from "next/navigation";

import { AdPlaceholder } from "@/components/ad-placeholder";
import { AllocationPie } from "@/components/allocation-pie";
import { ReactionButtons } from "@/components/reaction-buttons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/lib/app-state";

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const { posts } = useAppState();
  const post = posts.find((item) => item.id === params.id && item.status === "published");

  if (!post) {
    return <main className="mx-auto max-w-3xl p-8">投稿が見つかりません。</main>;
  }

  return (
    <main className="mx-auto max-w-5xl space-y-4 p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>{post.profile.age}代 / {post.profile.occupation} の投稿</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AllocationPie allocations={post.allocations} />
          <div className="text-sm text-muted-foreground">過去1年: {post.performance.oneYear}% / 開始来: {post.performance.sinceStart}%</div>
          <div className="rounded-md bg-muted p-3 text-sm">{post.memo}</div>
          <ReactionButtons postId={post.id} />
          <AdPlaceholder slot="detail" />
        </CardContent>
      </Card>
    </main>
  );
}
