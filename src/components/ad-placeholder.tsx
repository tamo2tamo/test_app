import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdPlaceholder({ slot }: { slot: "list" | "detail" }) {
  return (
    <Card className="border-dashed border-amber-300 bg-amber-50/70">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">広告枠 ({slot === "list" ? "一覧" : "詳細"})</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">スポンサーコンテンツ表示エリア（プレースホルダー）</p>
      </CardContent>
    </Card>
  );
}
