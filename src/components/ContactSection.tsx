import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const contactInfo = [
  { icon: MapPin, label: "Location", value: "Dhaka, Bangladesh" },
  { icon: Phone, label: "Phone", value: "+88 01752-171 478" },
  { icon: Mail, label: "Email", value: "ar.nafizfuad@gmail.com" },
  { icon: Clock, label: "Working Hours", value: "Available for projects" },
];

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message,
      });
      if (error) throw error;
      toast({ title: "Message sent!", description: "Thank you, I'll get back to you soon." });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast({ title: "Failed to send", description: "Please try again later.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 lg:py-32 bg-secondary/40">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-sm tracking-[0.2em] uppercase text-accent mb-4">Get In Touch</p>
          <h2 className="text-3xl md:text-5xl font-sans font-bold mb-4">Start Your Project</h2>
          <p className="text-muted-foreground max-w-xl">
            Ready to bring your vision to life? Reach out to discuss your project, and let's create something extraordinary together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {contactInfo.map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <item.icon size={20} strokeWidth={1.2} className="text-accent mt-1 shrink-0" />
                <div>
                  <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-0 py-3 bg-transparent border-b border-border text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none transition-colors"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-0 py-3 bg-transparent border-b border-border text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none transition-colors"
              required
            />
            <input
              type="tel"
              placeholder="Phone (Optional)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-0 py-3 bg-transparent border-b border-border text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none transition-colors"
            />
            <textarea
              placeholder="Your Message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-0 py-3 bg-transparent border-b border-border text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none transition-colors resize-none"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-10 py-3 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-primary/90 disabled:opacity-50 transition-colors duration-300"
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
