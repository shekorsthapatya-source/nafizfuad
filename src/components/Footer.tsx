import { motion } from "framer-motion";

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
        <p className="font-display text-sm tracking-widest">
          <span className="font-light">NAFIZ</span>{" "}
          <span className="font-semibold">FUAD</span>
        </p>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Md. Nafiz Fuad. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
