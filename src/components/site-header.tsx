import Link from "next/link";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm md:flex-row md:items-center">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">NISA運用者の匿名投稿サイト</p>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">人気順で近いケースを探す</h1>
        <p className="mt-2 text-sm text-muted-foreground">金融助言ではありません。投稿は自己申告データです。</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Link href="/auth">
          <Button className="h-10 bg-blue-600 px-4 text-white hover:bg-blue-700">ログイン</Button>
        </Link>
        <Link href="/auth/signup">
          <Button className="h-10 bg-blue-600 px-4 text-white hover:bg-blue-700">新規登録</Button>
        </Link>
        <Link href="/post/new">
          <Button className="h-10 bg-blue-600 px-4 text-white hover:bg-blue-700">投稿する</Button>
        </Link>
      </div>
    </header>
  );
}
