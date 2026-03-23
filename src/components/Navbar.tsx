import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const navLinks = [
  { label: "About", href: "/about", section: "about" },
  { label: "Portfolio", href: "/projects", section: "projects" },
  { label: "Recognition", href: "/awards", section: "awards" },
  { label: "Photography", href: "/photography" },
  { label: "Contact", href: "/contact", section: "contact" },
];

const sectionPaths = ["/about", "/projects", "/awards", "/contact"];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePath, setActivePath] = useState("/about");
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Desktop: auto-open menu at top, collapse on scroll
  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      // Also check the snap container
      const container = document.querySelector('.overflow-y-auto.lg\\:overflow-hidden');
      const containerScroll = container ? container.scrollTop : 0;
      const totalScroll = scrollY + containerScroll;

      if (totalScroll > 80) {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Also listen on snap container
    const container = document.querySelector('.overflow-y-auto.lg\\:overflow-hidden');
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isMobile, location.pathname]);

  // Track active section from scroll
  useEffect(() => {
    if (!sectionPaths.includes(location.pathname) && location.pathname !== "/") return;

    const handleScroll = () => {
      const sections = navLinks.filter(l => l.section).map(l => l.section!);
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActivePath(`/${sections[i]}`);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    if (!sectionPaths.includes(location.pathname) && location.pathname !== "/") {
      setActivePath(location.pathname);
    }
  }, [location.pathname]);

  const handleClick = (link: typeof navLinks[0]) => {
    setIsOpen(false);
    if (link.section) {
      if (location.pathname === "/" || sectionPaths.includes(location.pathname)) {
        setTimeout(() => {
          const el = document.getElementById(link.section!);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 50);
        window.history.replaceState(null, "", link.href);
        setActivePath(link.href);
      } else {
        navigate(link.href);
      }
    } else {
      navigate(link.href);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            if (location.pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
            else navigate("/");
          }}
          className="font-display text-xl tracking-widest cursor-pointer group"
        >
          <span className="font-extralight transition-opacity duration-300 group-hover:opacity-60">NAFIZ</span>{" "}
          <span className="font-medium transition-opacity duration-300 group-hover:opacity-60">FUAD</span>
        </a>

        <button
          className="text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-background border-b border-border overflow-hidden"
          >
            <ul className="flex flex-col items-center py-6 gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleClick(link)}
                    className={`text-xs tracking-widest uppercase px-6 py-2 block transition-all duration-300 ease-in-out ${
                      activePath === link.href
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
