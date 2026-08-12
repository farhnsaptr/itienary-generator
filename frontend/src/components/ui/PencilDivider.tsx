interface PencilDividerProps {
  color?: string;
  className?: string;
}

export function PencilDivider({ color = "var(--color-ink)", className = "" }: PencilDividerProps) {
  return (
    <div className={`relative my-4 w-full flex items-center justify-center ${className}`}>
      <svg className="hidden">
        <defs>
          <filter id="pencil-wobble">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" result="noise" seed="3" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
          </filter>
        </defs>
      </svg>
      <div
        className="w-full border-t-2"
        style={{
          borderColor: color,
          filter: "url(#pencil-wobble)",
          opacity: 0.7,
        }}
      />
    </div>
  );
}
