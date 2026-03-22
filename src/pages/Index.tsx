import { useState, useCallback, useEffect } from "react";
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
import { useSectionSnap } from "@/hooks/useSectionSnap";

const SECTION_IDS = ["about", "projects", "awards", "contact", "footer"];

const Index = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { containerRef, scrollToIndex } = useSectionSnap(SECTION_IDS, 1300);

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  // Scroll to section based on URL path
  useEffect(() => {
    if (loading) return;
    const pathToSection: Record<string, number> = {
      "/about": 0,
      "/projects": 1,
      "/awards": 2,
      "/contact": 3,
    };
    const idx = pathToSection[location.pathname];
    if (idx !== undefined) {
      setTimeout(() => scrollToIndex(idx), 100);
    }
  }, [location.pathname, loading, scrollToIndex]);

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
        className="h-screen overflow-hidden lg:overflow-hidden overflow-y-auto bg-background"
      >
        <Navbar />
        <div className="pt-16">
          <section id="about" className="min-h-screen">
            <AboutSection />
          </section>
          <div className="h-[10vh] bg-background" />
          <section id="projects">
            <ProjectsSection />
          </section>
          <div className="h-[10vh] bg-background" />
          <section id="awards" className="min-h-screen">
            <AwardsSection />
          </section>
          <div className="h-[10vh] bg-background" />
          <section id="contact" className="min-h-screen">
            <ContactSection />
          </section>
          <section id="footer">
            <Footer />
          </section>
        </div>
        <ChatBot />
      </motion.div>
    </>
  );
};

export default Index;
