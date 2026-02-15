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
      <Link href="/post/new">
        <Button size="lg">投稿する</Button>
      </Link>
    </header>
  );
}
