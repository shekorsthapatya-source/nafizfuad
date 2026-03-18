import { useState, useCallback } from "react";
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

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <>
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <div className={`min-h-screen bg-background ${loading ? "overflow-hidden h-screen" : ""}`}>
        <Navbar />
        <div className="pt-16">
          <AboutSection />
          <ProjectsSection />
          <AwardsSection />
          <ContactSection />
          <Footer />
        </div>
        <ChatBot />
      </div>
    </>
  );
};

export default Index;
