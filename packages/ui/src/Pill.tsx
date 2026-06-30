import * as React from "react";
import type { Semaforo } from "./scoreColor.js";

type Tone = Semaforo | "neutral";

const tones: Record<Tone, string> = {
  good: "bg-good-tint text-good",
  warn: "bg-warn-tint text-warn",
  urgent: "bg-urgent-tint text-urgent",
  neutral: "bg-cream text-ink-2",
};

export function Pill({
  tone = "neutral", className = "", ...rest
}: { tone?: Tone } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}
      {...rest}
    />
  );
}
