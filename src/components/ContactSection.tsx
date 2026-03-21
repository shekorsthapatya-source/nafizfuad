import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const contactInfo = [
  { label: "Location", value: "Dhaka, Bangladesh" },
  { label: "Phone", value: "+88 01752-171 478" },
  { label: "Email", value: "ar.nafizfuad@gmail.com" },
  { label: "Working Hours", value: "Available for projects" },
];

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });
      if (error) throw error;
      toast({ title: "Message sent!", description: "Thank you, I'll get back to you soon." });
      setFormData({ name: "", email: "", message: "" });
    } catch {
      toast({ title: "Failed to send", description: "Please try again later.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 lg:py-32 bg-secondary/40">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm tracking-[0.2em] uppercase text-accent mb-4">Get In Touch</p>
            <h2 className="text-3xl md:text-5xl font-sans font-bold mb-4">Start Your Project</h2>
            <p className="text-muted-foreground max-w-md mb-12">
              Ready to bring your vision to life? Reach out to discuss your project, and let's create something extraordinary together.
            </p>

            <div className="space-y-8">
              {contactInfo.map((item) => (
                <div key={item.label}>
                  <p className="text-xs font-bold tracking-[0.15em] uppercase text-foreground mb-1">{item.label}</p>
                  <p className="text-muted-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right column - Form */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="block text-xs font-bold tracking-[0.15em] uppercase text-foreground mb-2">Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-[0.15em] uppercase text-foreground mb-2">Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-[0.15em] uppercase text-foreground mb-2">Message</label>
              <textarea
                placeholder="Tell me about your project..."
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors resize-vertical"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-primary text-primary-foreground text-sm tracking-[0.2em] uppercase font-medium hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 transition-all duration-200"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
