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

const Index = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

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

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="min-h-screen bg-background"
      >
        <Navbar />
        <div className="pt-16">
          <AboutSection />
          <ProjectsSection />
          <AwardsSection />
          <ContactSection />
          <Footer />
        </div>
        <ChatBot />
      </motion.div>
    </>
  );
};

export default Index;
