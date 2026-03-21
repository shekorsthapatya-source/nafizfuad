import { useRef, useEffect, useCallback } from "react";

// Power4.inOut easing
function power4InOut(t: number): number {
  if (t < 0.5) return 8 * t * t * t * t;
  const f = t - 1;
  return 1 - 8 * f * f * f * f;
}

export function useSectionSnap(sectionIds: string[], duration = 1300) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const currentIndex = useRef(0);
  const touchStartY = useRef(0);

  const scrollToIndex = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container || isAnimating.current) return;
      const clamped = Math.max(0, Math.min(index, sectionIds.length - 1));
      if (clamped === currentIndex.current && container.scrollTop !== 0) {
        // allow if it's actually different position
      }
      const target = document.getElementById(sectionIds[clamped]);
      if (!target) return;

      isAnimating.current = true;
      currentIndex.current = clamped;

      const start = container.scrollTop;
      const end = target.offsetTop - container.offsetTop;
      const distance = end - start;
      const startTime = performance.now();

      function step(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = power4InOut(progress);
        container!.scrollTop = start + distance * eased;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          // Small cooldown to prevent re-triggering
          setTimeout(() => {
            isAnimating.current = false;
          }, 100);
        }
      }

      requestAnimationFrame(step);
    },
    [sectionIds, duration]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimating.current) return;
      if (Math.abs(e.deltaY) < 5) return;
      const direction = e.deltaY > 0 ? 1 : -1;
      scrollToIndex(currentIndex.current + direction);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimating.current) return;
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < 40) return;
      const direction = deltaY > 0 ? 1 : -1;
      scrollToIndex(currentIndex.current + direction);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        scrollToIndex(currentIndex.current + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        scrollToIndex(currentIndex.current - 1);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [scrollToIndex]);

  return { containerRef, scrollToIndex, currentIndex };
}
