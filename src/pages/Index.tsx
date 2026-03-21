import { useState, useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Navbar from "@/components/Navbar";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import AwardsSection from "@/components/AwardsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import LoadingScreen from "@/components/LoadingScreen";

gsap.registerPlugin(ScrollToPlugin);

const Index = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const isSnapping = useRef(false);
  const snapTimeout = useRef<ReturnType<typeof setTimeout>>();

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;
    const pathToSection: Record<string, string> = {
      "/about": "about",
      "/projects": "projects",
      "/awards": "awards",
      "/contact": "contact",
    };
    const section = pathToSection[location.pathname];
    if (section) {
      const el = document.getElementById(section);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [location.pathname, loading]);

  useEffect(() => {
    if (loading) return;
    const container = containerRef.current;
    if (!container) return;

    const getProjectsSection = () =>
      container.querySelector<HTMLElement>('[data-snap-section="projects"]');

    const isInProjectsZone = (scrollTop: number) => {
      const proj = getProjectsSection();
      if (!proj) return false;
      const top = proj.offsetTop - 100;
      const bottom = proj.offsetTop + proj.offsetHeight - container.clientHeight + 100;
      return scrollTop > top && scrollTop < bottom;
    };

    const snapToNearest = () => {
      if (isSnapping.current) return;
      const scrollTop = container.scrollTop;

      if (isInProjectsZone(scrollTop)) return;

      const sections = Array.from(
        container.querySelectorAll<HTMLElement>("[data-snap-section]")
      ).filter((s) => s.dataset.snapSection !== "projects");

      let closest: HTMLElement | null = null;
      let closestDist = Infinity;

      for (const sec of sections) {
        const dist = Math.abs(sec.offsetTop - scrollTop);
        if (dist < closestDist) {
          closestDist = dist;
          closest = sec;
        }
      }

      if (closest && closestDist < container.clientHeight * 0.4 && closestDist > 5) {
        isSnapping.current = true;
        gsap.to(container, {
          scrollTo: { y: closest.offsetTop, autoKill: true },
          duration: 1.3,
          ease: "power4.inOut",
          onComplete: () => {
            isSnapping.current = false;
          },
          onInterrupt: () => {
            isSnapping.current = false;
          },
        });
      }
    };

    const handleScroll = () => {
      if (isSnapping.current) return;
      clearTimeout(snapTimeout.current);
      snapTimeout.current = setTimeout(snapToNearest, 120);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(snapTimeout.current);
    };
  }, [loading]);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-screen overflow-y-scroll bg-background"
      >
        <Navbar />
        <div className="pt-16">
          <div data-snap-section="about">
            <AboutSection />
          </div>
          <div className="h-[10vh] bg-background" />
          <div data-snap-section="projects">
            <ProjectsSection />
          </div>
          <div className="h-[10vh] bg-background" />
          <div data-snap-section="awards">
            <AwardsSection />
          </div>
          <div className="h-[10vh] bg-background" />
          <div data-snap-section="contact">
            <ContactSection />
          </div>
          <div>
            <Footer />
          </div>
        </div>
        <ChatBot />
      </motion.div>
    </>
  );
};

export default Index;
