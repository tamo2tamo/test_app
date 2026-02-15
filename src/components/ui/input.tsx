import * as React from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn("h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm", className)} {...props} />;
}
