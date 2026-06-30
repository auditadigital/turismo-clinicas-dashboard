import * as React from "react";

export function Badge({ className = "", ...rest }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border border-line-2 bg-bg-2 px-2 py-0.5 text-xs text-ink-2 ${className}`}
      {...rest}
    />
  );
}
