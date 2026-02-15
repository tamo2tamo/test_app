"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/lib/app-state";

export default function MePage() {
  const { auth, refresh } = useAppState();

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>マイページ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">メール: {auth.email ?? "未ログイン"}</p>
          <p className="text-sm text-muted-foreground">現在の認証強度: {auth.aal}</p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => refresh()}>認証状態を再取得</Button>
            <Link href="/post/new">
              <Button variant="outline">投稿へ</Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">TOTPはSupabase AuthのMFA設定で有効化してください。`aal2`で投稿/通報/リアクションが可能です。</p>
        </CardContent>
      </Card>
    </main>
  );
}
