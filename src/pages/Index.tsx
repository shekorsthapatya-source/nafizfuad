import { useState, useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import AwardsSection from "@/components/AwardsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import LoadingScreen from "@/components/LoadingScreen";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const currentSectionRef = useRef(0);
  const isScrollingRef = useRef(false);

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  // Scroll to section based on URL path
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

  // Custom scroll snap logic
  useEffect(() => {
    if (loading) return;

    const goToSection = (index: number) => {
      const sections = document.querySelectorAll('.snap-section');
      if (index < 0 || index >= sections.length) return;
      isScrollingRef.current = true;
      currentSectionRef.current = index;
      sections[index].scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => { isScrollingRef.current = false; }, 1000);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrollingRef.current) return;
      if (e.deltaY > 0) goToSection(currentSectionRef.current + 1);
      else goToSection(currentSectionRef.current - 1);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrollingRef.current) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); goToSection(currentSectionRef.current + 1); }
      if (e.key === 'ArrowUp') { e.preventDefault(); goToSection(currentSectionRef.current - 1); }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrollingRef.current) return;
      const diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goToSection(currentSectionRef.current + 1);
        else goToSection(currentSectionRef.current - 1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [loading]);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-background"
      >
        <Navbar />
        <div className="pt-16">
          <div className="min-h-screen snap-section" id="about">
            <AboutSection />
          </div>
          <div className="min-h-screen snap-section" id="projects">
            <ProjectsSection />
          </div>
          <div className="min-h-screen snap-section" id="awards">
            <AwardsSection />
          </div>
          <div className="min-h-screen snap-section" id="contact">
            <ContactSection />
          </div>
          <div className="snap-section">
            <Footer />
          </div>
        </div>
        <ChatBot />
      </motion.div>
    </>
  );
};

export default Index;
