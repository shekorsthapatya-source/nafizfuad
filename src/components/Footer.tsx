import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-8 border-t border-border"
    >
      <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <p className="font-display text-sm tracking-widest">
            <span className="font-light">MOHAMMAD</span>{" "}
            <span className="font-semibold">OBAIDULLAH</span>
          </p>
          <Link to="/admin" className="text-muted-foreground/40 hover:text-muted-foreground transition-colors" title="Admin">
            <Settings size={12} />
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} MD. Nafiz Fuad. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
