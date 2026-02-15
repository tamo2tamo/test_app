import * as React from "react";

import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn("min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm", className)} {...props} />;
}
