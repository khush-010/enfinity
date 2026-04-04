import { useState, useRef, useCallback } from "react";

interface ImageComparisonProps {
  original: string;
  segmented: string;
}

const ImageComparison = ({ original, segmented }: ImageComparisonProps) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, x)));
  }, []);

  const handlePointerDown = () => { isDragging.current = true; };
  const handlePointerUp = () => { isDragging.current = false; };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging.current) updatePosition(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video rounded-lg overflow-hidden cursor-col-resize select-none border border-border"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerMove={handlePointerMove}
      onClick={(e) => updatePosition(e.clientX)}
    >
      {/* Segmented (full background) */}
      <img src={segmented} alt="Segmented result" className="absolute inset-0 w-full h-full object-contain bg-background" />

      {/* Original (clipped) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <img src={original} alt="Original image" className="w-full h-full object-contain bg-background" />
      </div>

      {/* Divider */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-primary" style={{ left: `${position}%` }}>
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
          <span className="text-primary-foreground text-xs font-bold">⟷</span>
        </div>
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 text-xs font-mono px-2 py-1 rounded bg-background/80 text-foreground">Original</span>
      <span className="absolute top-3 right-3 text-xs font-mono px-2 py-1 rounded bg-primary/80 text-primary-foreground">Segmented</span>
    </div>
  );
};

export default ImageComparison;
