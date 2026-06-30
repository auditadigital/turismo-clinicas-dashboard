import * as React from "react";

export function Card({ className = "", ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded bg-surface border border-line p-4 ${className}`}
      {...rest}
    />
  );
}
