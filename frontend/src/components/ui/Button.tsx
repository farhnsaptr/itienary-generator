import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { PencilBorder } from "./PencilBorder";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  roughSeed?: number;
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  roughSeed = 1,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "relative inline-flex items-center justify-center font-semibold transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

  const sizeStyles = {
    sm: "px-4 py-2 text-xs min-h-[38px]",
    md: "px-6 py-3 text-sm min-h-[44px]",
    lg: "px-8 py-4 text-base min-h-[52px]",
  };

  const variantBg = {
    primary: "bg-[var(--color-pink)] text-[var(--color-ink)] hover:bg-[#ff9eb6]",
    secondary: "bg-[var(--color-blue)] text-[var(--color-ink)] hover:bg-[#8ec5ff]",
    outline: "bg-[var(--color-cream)] text-[var(--color-ink)] hover:bg-amber-100/50",
    danger: "bg-red-400 text-white hover:bg-red-500",
    ghost: "bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-pink)]/20",
  };

  const pencilColor = variant === "danger" ? "#991b1b" : "var(--color-ink)";

  return (
    <motion.button
      whileHover={disabled || isLoading ? undefined : { y: -2, rotate: 0.5 }}
      whileTap={disabled || isLoading ? undefined : { scale: 0.96 }}
      className={`${baseStyles} ${sizeStyles[size]} ${variantBg[variant]} rounded-[18px] ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {variant !== "ghost" && (
        <PencilBorder
          color={pencilColor}
          roughness={1.2}
          seed={roughSeed}
          strokeWidth={2}
        />
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading && (
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </span>
    </motion.button>
  );
}
