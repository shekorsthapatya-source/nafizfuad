const Footer = () => {
  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-display text-sm tracking-widest">
          <span className="font-light">NAFIZ</span>{" "}
          <span className="font-semibold">FUAD</span>
        </p>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Md. Nafiz Fuad. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
