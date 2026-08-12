import { useEffect, useRef, memo } from "react";
import rough from "roughjs";

interface PencilBorderProps {
  width?: number | string;
  height?: number | string;
  color?: string;
  roughness?: number;
  bowing?: number;
  strokeWidth?: number;
  seed?: number;
  className?: string;
}

export const PencilBorder = memo(function PencilBorder({
  color = "#3A3238",
  roughness = 1.5,
  bowing = 1.8,
  strokeWidth = 2,
  seed = 1,
  className = "",
}: PencilBorderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const lastSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;

    const updateSvg = () => {
      if (!containerRef.current || !svgRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      if (clientWidth === 0 || clientHeight === 0) return;

      // Skip redrawing if dimension change is trivial (< 2px) to save CPU cycles
      if (
        Math.abs(lastSizeRef.current.width - clientWidth) < 2 &&
        Math.abs(lastSizeRef.current.height - clientHeight) < 2
      ) {
        return;
      }

      lastSizeRef.current = { width: clientWidth, height: clientHeight };

      svgRef.current.setAttribute("width", `${clientWidth}`);
      svgRef.current.setAttribute("height", `${clientHeight}`);
      svgRef.current.innerHTML = "";

      const rc = rough.svg(svgRef.current);
      const node = rc.rectangle(2, 2, clientWidth - 4, clientHeight - 4, {
        roughness,
        bowing,
        stroke: color,
        strokeWidth,
        fill: "none",
        seed,
      });

      svgRef.current.appendChild(node);
    };

    updateSvg();

    let animationFrameId: number;
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(updateSvg);
    });

    resizeObserver.observe(containerRef.current);
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [color, roughness, bowing, strokeWidth, seed]);

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none ${className}`}>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
});
