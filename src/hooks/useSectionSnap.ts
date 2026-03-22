import { useRef, useEffect, useCallback } from "react";

// Power4.inOut easing
function power4InOut(t: number): number {
  if (t < 0.5) return 8 * t * t * t * t;
  const f = t - 1;
  return 1 - 8 * f * f * f * f;
}

const MOBILE_BREAKPOINT = 1024;

export function useSectionSnap(sectionIds: string[], duration = 1300) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const currentIndex = useRef(0);
  const touchStartY = useRef(0);
  const isMobile = useRef(false);

  // Check if we're on mobile/tablet
  const checkMobile = useCallback(() => {
    isMobile.current = window.innerWidth < MOBILE_BREAKPOINT;
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container || isAnimating.current) return;
      const clamped = Math.max(0, Math.min(index, sectionIds.length - 1));
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
        const eased = power4InOut(progress);
        container!.scrollTop = start + distance * eased;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setTimeout(() => {
            isAnimating.current = false;
          }, 100);
        }
      }

      requestAnimationFrame(step);
    },
    [sectionIds, duration]
  );

  // Find which section index corresponds to a scroll position
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

  // Check if current section has more content to scroll within
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
        // Scrolling down — is there more section below the viewport?
        return sectionBottom - viewportBottom > 10;
      } else {
        // Scrolling up — is there more section above the viewport?
        return viewportTop - sectionTop > 10;
      }
    },
    [sectionIds]
  );

  // Smooth scroll within section (partial scroll)
  const scrollWithinSection = useCallback(
    (delta: number) => {
      const container = containerRef.current;
      if (!container || isAnimating.current) return;

      const idx = currentIndex.current;
      const section = document.getElementById(sectionIds[idx]);
      if (!section) return;

      const sectionTop = section.offsetTop - container.offsetTop;
      const sectionBottom = sectionTop + section.scrollHeight;

      // Scroll by a fixed amount within the section bounds
      const scrollAmount = Math.min(Math.abs(delta) * 2, 300);
      const direction = delta > 0 ? 1 : -1;
      let targetScroll = container.scrollTop + direction * scrollAmount;

      // Clamp within section
      targetScroll = Math.max(sectionTop, Math.min(targetScroll, sectionBottom - container.clientHeight));

      isAnimating.current = true;
      const start = container.scrollTop;
      const distance = targetScroll - start;
      const startTime = performance.now();
      const scrollDuration = 400;

      function step(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / scrollDuration, 1);
        const eased = power4InOut(progress);
        container!.scrollTop = start + distance * eased;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setTimeout(() => {
            isAnimating.current = false;
          }, 50);
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
      // On mobile/tablet, allow normal scrolling
      if (isMobile.current) return;

      e.preventDefault();
      if (isAnimating.current) return;
      if (Math.abs(e.deltaY) < 5) return;

      const direction = e.deltaY > 0 ? 1 : -1;

      // Check if current section has more content to scroll
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
      // On mobile/tablet, allow normal scrolling
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
        const direction = 1;
        if (canScrollWithinSection(direction)) {
          scrollWithinSection(200);
        } else {
          scrollToIndex(currentIndex.current + direction);
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        const direction = -1;
        if (canScrollWithinSection(direction)) {
          scrollWithinSection(-200);
        } else {
          scrollToIndex(currentIndex.current + direction);
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
    };
  }, [scrollToIndex, checkMobile, canScrollWithinSection, scrollWithinSection]);

  return { containerRef, scrollToIndex, currentIndex };
}
