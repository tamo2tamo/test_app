import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AllocationMap } from "@/lib/types";

const COLORS = ["#114b5f", "#1a936f", "#88d498", "#f3e9d2", "#f4a259", "#ef5b5b", "#3f72af", "#8e9aaf", "#f28482", "#84a59d", "#f6bd60", "#9a8c98"];
const ALLOCATION_LABELS: Record<string, string> = {
  stock_jp: "株（国内）",
  stock_global: "株（海外）",
  fund_jp_index: "投信（国内インデックス）",
  fund_global_index: "投信（海外インデックス）",
  fund_jp_active: "投信（国内アクティブ）",
  fund_global_active: "投信（海外アクティブ）",
  reit: "不動産（REIT）",
  bond_jp: "債券（国内）",
  bond_global: "債券（海外）",
  fx: "FX",
  gold: "金",
  other: "その他",
};

export function AllocationPie({ allocations, pieClassName }: { allocations: AllocationMap; pieClassName?: string }) {
  const entries = Object.entries(allocations)
    .map(([key, value]) => {
      const numeric = Number(String(value).replace("%", ""));
      return [key, Number.isFinite(numeric) ? numeric : 0] as const;
    })
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1]);
  let angle = 0;
  const stops: string[] = [];
  entries.forEach(([, value], index) => {
    const next = angle + value * 3.6;
    stops.push(`${COLORS[index % COLORS.length]} ${angle}deg ${next}deg`);
    angle = next;
  });

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div
          className={cn("mx-auto h-44 w-44 rounded-full border border-border", pieClassName)}
          style={{ background: stops.length ? `conic-gradient(${stops.join(",")})` : "#e5e7eb" }}
          aria-label="配分円グラフ"
        />
        {entries.length > 0 ? (
          <div className="grid flex-1 grid-cols-2 gap-2 text-xs">
            {entries.map(([key, value], index) => (
              <Badge key={key} className="justify-between gap-2">
                <span>{ALLOCATION_LABELS[key] ?? key}</span>
                <span style={{ color: COLORS[index % COLORS.length] }}>{value}%</span>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">配分データが未設定です。</p>
        )}
      </div>
    </Card>
  );
}
