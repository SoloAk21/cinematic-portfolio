// src/components/Contact.tsx
"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Youtube,
  Instagram,
  Linkedin,
  Send,
  MapPin,
  Phone,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const ref = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();

  const { scrollY } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const y = useTransform(scrollY, [0, 500], [0, -20]);
  const opacity = useTransform(scrollY, [0, 300, 500], [1, 0.98, 0.95]);

  const cursorX = useSpring(mouseX, { damping: 25, stiffness: 500 });
  const cursorY = useSpring(mouseY, { damping: 25, stiffness: 500 });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredField, setHoveredField] = useState<string | null>(null);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    mouseX.set(x);
    mouseY.set(y);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: "Message Sent Successfully!",
      description:
        "Thank you for reaching out. I'll get back to you within 24 hours.",
    });

    setFormData({ name: "", email: "", projectType: "", message: "" });
    setIsSubmitting(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const dynamicGradient = useMotionTemplate`
    radial-gradient(
      600px circle at ${cursorX}% ${cursorY}%,
      rgba(212, 175, 55, 0.08) 0%,
      transparent 60%
    )
  `;

  const socialLinks = [
    {
      platform: "YouTube",
      icon: Youtube,
      url: "https://youtube.com",
    },
    {
      platform: "Instagram",
      icon: Instagram,
      url: "https://instagram.com",
    },
    {
      platform: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com",
    },
  ];

  const contactInfo = [
    {
      icon: MapPin,
      label: "Based In",
      value: "Addis Ababa, Ethiopia",
      description: "Available worldwide",
    },
    {
      icon: Clock,
      label: "Response Time",
      value: "Within 24 Hours",
      description: "Usually faster",
    },
    {
      icon: Phone,
      label: "Direct Contact",
      value: "+251 912 345 678",
      description: "Call or WhatsApp",
    },
  ];

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative min-h-screen py-20 md:py-24 bg-background overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{ y }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"
        style={{ opacity }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: dynamicGradient,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.div
            className="text-lg font-light text-primary/80 tracking-widest uppercase mb-6"
            variants={itemVariants}
          >
            Get In Touch
          </motion.div>

          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6"
            variants={itemVariants}
          >
            <span className="block bg-gradient-to-b from-white to-white/90 bg-clip-text text-transparent">
              LET'S CREATE
            </span>
            <span className="block bg-gradient-to-br from-primary to-yellow-600 bg-clip-text text-transparent mt-2">
              TOGETHER
            </span>
          </motion.h2>

          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Have a project in mind? Let's discuss how we can bring your vision
            to life with cinematic excellence
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div
              className="relative rounded-2xl bg-background/50 backdrop-blur-sm border border-primary/10 p-8"
              variants={itemVariants}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredField("name")}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <Input
                    placeholder="Your Full Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="bg-background/50 border-primary/20 h-14 text-base rounded-xl transition-colors focus:border-primary/40"
                  />
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredField("email")}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="bg-background/50 border-primary/20 h-14 text-base rounded-xl transition-colors focus:border-primary/40"
                  />
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredField("projectType")}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <Select
                    value={formData.projectType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, projectType: value })
                    }
                    required
                  >
                    <SelectTrigger className="bg-background/50 border-primary/20 h-14 text-base rounded-xl transition-colors focus:border-primary/40">
                      <SelectValue placeholder="Select Project Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-primary/20">
                      <SelectItem value="commercial">
                        Commercial Advertisement
                      </SelectItem>
                      <SelectItem value="music-video">
                        Music Video Production
                      </SelectItem>
                      <SelectItem value="short-film">Short Film</SelectItem>
                      <SelectItem value="documentary">Documentary</SelectItem>
                      <SelectItem value="event">Event Coverage</SelectItem>
                      <SelectItem value="corporate">Corporate Video</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredField("message")}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <Textarea
                    placeholder="Tell me about your project vision, timeline, and any specific requirements..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    rows={5}
                    className="bg-background/50 border-primary/20 text-base rounded-xl resize-none transition-colors focus:border-primary/40 min-h-[120px]"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-base font-semibold rounded-xl transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Sending Message...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Send Message
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-8"
          >
            <motion.div
              className="rounded-2xl bg-background/50 backdrop-blur-sm border border-primary/10 p-8"
              variants={itemVariants}
            >
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Contact Information
              </h3>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.label}
                    className="flex items-center gap-4 p-4 rounded-xl bg-background/30 border border-primary/5 hover:border-primary/10 transition-colors"
                    variants={itemVariants}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground text-base">
                        {info.label}
                      </p>
                      <p className="text-foreground/80 text-base">
                        {info.value}
                      </p>
                      <p className="text-primary text-sm font-medium mt-1">
                        {info.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="rounded-2xl bg-background/50 backdrop-blur-sm border border-primary/10 p-8"
              variants={itemVariants}
            >
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Connect With Me
              </h3>

              <div className="grid grid-cols-3 gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-4 rounded-xl bg-background/30 border border-primary/5 hover:border-primary/20 transition-colors group"
                    variants={itemVariants}
                    whileHover={{ y: -2, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <social.icon className="w-8 h-8 text-primary mb-2 group-hover:text-primary/80 transition-colors" />
                    <span className="text-sm font-medium text-foreground text-center">
                      {social.platform}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
