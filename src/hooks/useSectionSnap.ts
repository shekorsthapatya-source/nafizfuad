import { useRef, useEffect, useCallback } from "react";

// Quintic ease-in-out for buttery smooth transitions
function quinticInOut(t: number): number {
  if (t < 0.5) {
    return 16 * t * t * t * t * t;
  }
  const f = t - 1;
  return 1 + 16 * f * f * f * f * f;
}

// Smooth lerp for within-section scrolling
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

const MOBILE_BREAKPOINT = 1024;

export function useSectionSnap(sectionIds: string[], duration = 1100) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const currentIndex = useRef(0);
  const touchStartY = useRef(0);
  const isMobile = useRef(false);
  const wheelAccumulator = useRef(0);
  const wheelTimeout = useRef<ReturnType<typeof setTimeout>>();
  const lastWheelTime = useRef(0);

  const checkMobile = useCallback(() => {
    isMobile.current = window.innerWidth < MOBILE_BREAKPOINT;
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container || isAnimating.current) return;
      const clamped = Math.max(0, Math.min(index, sectionIds.length - 1));
      if (clamped === currentIndex.current) return;
      const target = document.getElementById(sectionIds[clamped]);
      if (!target) return;

      isAnimating.current = true;
      currentIndex.current = clamped;

      const start = container.scrollTop;
      const end = target.offsetTop - container.offsetTop;
      const distance = end - start;
      if (Math.abs(distance) < 2) {
        isAnimating.current = false;
        return;
      }
      const startTime = performance.now();

      function step(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = quinticInOut(progress);
        container!.scrollTop = start + distance * eased;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          container!.scrollTop = end;
          setTimeout(() => {
            isAnimating.current = false;
          }, 80);
        }
      }

      requestAnimationFrame(step);
    },
    [sectionIds, duration]
  );

  const findCurrentSection = useCallback(() => {
    const container = containerRef.current;
    if (!container) return 0;
    const scrollTop = container.scrollTop;
    let closest = 0;
    let closestDist = Infinity;
    for (let i = 0; i < sectionIds.length; i++) {
      const el = document.getElementById(sectionIds[i]);
      if (!el) continue;
      const top = el.offsetTop - container.offsetTop;
      const dist = Math.abs(scrollTop - top);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    }
    return closest;
  }, [sectionIds]);

  const canScrollWithinSection = useCallback(
    (direction: number) => {
      const container = containerRef.current;
      if (!container) return false;
      const idx = currentIndex.current;
      const section = document.getElementById(sectionIds[idx]);
      if (!section) return false;

      const sectionTop = section.offsetTop - container.offsetTop;
      const sectionBottom = sectionTop + section.scrollHeight;
      const viewportTop = container.scrollTop;
      const viewportBottom = viewportTop + container.clientHeight;

      if (direction > 0) {
        return sectionBottom - viewportBottom > 10;
      } else {
        return viewportTop - sectionTop > 10;
      }
    },
    [sectionIds]
  );

  const scrollWithinSection = useCallback(
    (delta: number) => {
      const container = containerRef.current;
      if (!container || isAnimating.current) return;

      const idx = currentIndex.current;
      const section = document.getElementById(sectionIds[idx]);
      if (!section) return;

      const sectionTop = section.offsetTop - container.offsetTop;
      const sectionBottom = sectionTop + section.scrollHeight;

      // Smoother, more responsive within-section scroll
      const scrollAmount = Math.min(Math.abs(delta) * 1.8, 250);
      const direction = delta > 0 ? 1 : -1;
      let targetScroll = container.scrollTop + direction * scrollAmount;

      targetScroll = Math.max(sectionTop, Math.min(targetScroll, sectionBottom - container.clientHeight));

      isAnimating.current = true;
      const start = container.scrollTop;
      const distance = targetScroll - start;
      const startTime = performance.now();
      const scrollDuration = 350;

      function step(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / scrollDuration, 1);
        const eased = easeOutExpo(progress);
        container!.scrollTop = start + distance * eased;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setTimeout(() => {
            isAnimating.current = false;
          }, 30);
        }
      }

      requestAnimationFrame(step);
    },
    [sectionIds]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleWheel = (e: WheelEvent) => {
      if (isMobile.current) return;
      e.preventDefault();
      if (isAnimating.current) return;

      const now = performance.now();
      const timeDelta = now - lastWheelTime.current;
      lastWheelTime.current = now;

      // Reset accumulator if there's a pause in scrolling
      if (timeDelta > 200) {
        wheelAccumulator.current = 0;
      }

      wheelAccumulator.current += e.deltaY;

      // Clear existing timeout
      if (wheelTimeout.current) {
        clearTimeout(wheelTimeout.current);
      }

      const absDelta = Math.abs(wheelAccumulator.current);

      // Debounce: require meaningful scroll intent
      if (absDelta < 30) {
        wheelTimeout.current = setTimeout(() => {
          wheelAccumulator.current = 0;
        }, 150);
        return;
      }

      const direction = wheelAccumulator.current > 0 ? 1 : -1;
      wheelAccumulator.current = 0;

      if (canScrollWithinSection(direction)) {
        scrollWithinSection(e.deltaY);
      } else {
        scrollToIndex(currentIndex.current + direction);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isMobile.current) return;
      if (isAnimating.current) return;
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < 40) return;
      const direction = deltaY > 0 ? 1 : -1;

      if (canScrollWithinSection(direction)) {
        scrollWithinSection(deltaY);
      } else {
        scrollToIndex(currentIndex.current + direction);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isMobile.current) return;
      if (isAnimating.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        if (canScrollWithinSection(1)) {
          scrollWithinSection(200);
        } else {
          scrollToIndex(currentIndex.current + 1);
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        if (canScrollWithinSection(-1)) {
          scrollWithinSection(-200);
        } else {
          scrollToIndex(currentIndex.current - 1);
        }
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
      window.removeEventListener("resize", checkMobile);
      if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
    };
  }, [scrollToIndex, checkMobile, canScrollWithinSection, scrollWithinSection]);

  return { containerRef, scrollToIndex, currentIndex };
}
