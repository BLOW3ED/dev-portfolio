import type { ReactNode } from "react";
import { Link } from "@/components/link";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors";

const sizes = {
  md: "px-4 py-2.5",
  sm: "px-3 py-1.5",
} as const;

const variants = {
  primary: "bg-accent text-accent-contrast hover:bg-fg hover:text-bg",
  secondary: "border border-border-strong text-fg hover:border-fg",
  ghost: "text-fg-muted hover:text-fg",
} as const;

export function ButtonLink({
  href,
  external = false,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: {
  href: string;
  external?: boolean;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
}) {
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  if (href.startsWith("#")) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

export function ArrowIcon({ direction = "right" }: { direction?: "right" | "down" | "left" | "up-right" }) {
  const rotate = { right: 0, down: 90, left: 180, "up-right": -45 }[direction];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}
