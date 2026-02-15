"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/lib/app-state";

export default function AdminPage() {
  const { posts, reports, approvePost, hidePost, auth } = useAppState();
  const pending = posts.filter((p) => p.status === "pending");
  const openReports = reports.filter((r) => r.status === "open");

  if (!auth.isAdmin) {
    return <main className="mx-auto max-w-3xl p-8">管理者権限が必要です。</main>;
  }

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>管理ダッシュボード</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <section className="space-y-3">
            <h2 className="font-semibold">投稿 審査</h2>
            {pending.map((post) => (
              <div key={post.id} className="rounded-md border border-border p-3">
                <p className="text-sm">{post.id} / {post.profile.age}代 / {post.profile.occupation}</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" onClick={() => void approvePost(post.id)}>承認</Button>
                  <Button size="sm" variant="outline" onClick={() => void hidePost(post.id)}>却下</Button>
                </div>
              </div>
            ))}
            {pending.length === 0 && <p className="text-sm text-muted-foreground">審査待ちの投稿はありません。</p>}
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">通報管理</h2>
            {openReports.map((report) => (
              <div key={report.id} className="rounded-md border border-border p-3 text-sm">
                <p>post: {report.postId}</p>
                <p>reason: {report.reason}</p>
                <p>{report.memo}</p>
              </div>
            ))}
            {openReports.length === 0 && <p className="text-sm text-muted-foreground">未対応通報はありません。</p>}
          </section>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>流入/CSV</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">UTM / referrer / landing 集計とCSV出力は本実装APIに接続済み想定の枠です。</CardContent>
      </Card>
    </main>
  );
}
