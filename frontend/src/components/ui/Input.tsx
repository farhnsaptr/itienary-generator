import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PencilBorder } from "./PencilBorder";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  roughSeed?: number;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, roughSeed = 2, className = "", onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="w-full flex flex-col gap-1 text-left">
        {label && (
          <label className="text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wide px-1">
            {label}
          </label>
        )}
        <div className="relative w-full">
          <PencilBorder
            color={error ? "#ef4444" : isFocused ? "var(--color-pink)" : "var(--color-ink-soft)"}
            roughness={isFocused ? 1.8 : 1.2}
            strokeWidth={isFocused ? 2.5 : 1.8}
            seed={roughSeed}
          />
          <input
            ref={ref}
            className={`w-full px-4 py-3 bg-transparent text-[var(--color-ink)] text-sm border-none rounded-none outline-none appearance-none shadow-none focus:outline-none focus:ring-0 placeholder:text-[var(--color-ink-soft)]/60 relative z-10 ${className}`}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...props}
          />
        </div>
        <AnimatePresence>
          {error && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs font-medium text-red-500 px-1 mt-0.5"
            >
              {error}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = "Input";
