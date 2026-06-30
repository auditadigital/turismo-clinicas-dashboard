import * as React from "react";

type Variant = "primary" | "secondary" | "ghost" | "kakao";
type Size = "md" | "lg" | "block";

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = ""): string {
  const s = size === "lg" ? "btn-lg" : size === "block" ? "btn-block" : "";
  return ["btn", `btn-${variant}`, s, extra].filter(Boolean).join(" ");
}

type Props = {
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

export function Button({
  variant = "primary",
  size = "md",
  href,
  className = "",
  children,
  ...rest
}: Props) {
  const cls = buttonClass(variant, size, className);
  if (href)
    return (
      <a className={cls} href={href} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  return (
    <button className={cls} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
