import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AllocationMap } from "@/lib/types";

const COLORS = ["#114b5f", "#1a936f", "#88d498", "#f3e9d2", "#f4a259", "#ef5b5b", "#3f72af", "#8e9aaf", "#f28482", "#84a59d", "#f6bd60", "#9a8c98"];

export function AllocationPie({ allocations }: { allocations: AllocationMap }) {
  const entries = Object.entries(allocations).filter(([, v]) => v > 0);
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
          className="mx-auto h-44 w-44 rounded-full border border-border"
          style={{ background: `conic-gradient(${stops.join(",")})` }}
          aria-label="配分円グラフ"
        />
        <div className="grid flex-1 grid-cols-2 gap-2 text-xs">
          {entries.map(([key, value], index) => (
            <Badge key={key} className="justify-between gap-2">
              <span>{key}</span>
              <span style={{ color: COLORS[index % COLORS.length] }}>{value}%</span>
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
