"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useInView,
} from "framer-motion";
import { useRef, useState, useCallback } from "react";
import emailjs from "@emailjs/browser";

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

import { Instagram, Send, MapPin, Phone, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// You may need to install a TikTok icon package or use a custom SVG
// For now, I'll use a simple text component as a placeholder
const TiktokIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const TelegramIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21.5 2.5 2.5 9.5l7 2.5L15.5 7l-6 6.5 6 3.5 3.5-8Z" />
  </svg>
);

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

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY],
  );

  // =======================
  // EMAIL SUBMIT HANDLER
  // =======================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 🔑 REPLACE WITH YOUR EMAILJS VALUES
    const SERVICE_ID = "service_ocbssjj";
    const TEMPLATE_ID = "template_wckxzcr";
    const PUBLIC_KEY = "ec_2OePgPn79mQ66f";

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name: formData.name,
          email: formData.email,
          projectType: formData.projectType,
          message: formData.message,
        },
        PUBLIC_KEY,
      );

      toast({
        title: "Message Sent Successfully!",
        description:
          "Thank you for reaching out. I'll respond within 24 hours.",
      });

      setFormData({
        name: "",
        email: "",
        projectType: "",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast({
        variant: "destructive",
        title: "Message Failed",
        description:
          "Unable to send message. Please try again later or contact me directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const dynamicGradient = useMotionTemplate`
    radial-gradient(
      600px circle at ${cursorX}% ${cursorY}%,
      rgba(212, 175, 55, 0.08) 0%,
      transparent 60%
    )
  `;

  const contactInfo = [
    {
      icon: MapPin,
      label: "Location",
      value: "Addis Ababa, Ethiopia",
      description: "Available worldwide",
    },
    {
      icon: Clock,
      label: "Response Time",
      value: "Within 24 Hours",
      description: "Fast & reliable",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+251 92 034 8215",
      description: "Call or WhatsApp",
    },
  ];

  // Updated social links with your provided URLs
  const socialLinks = [
    {
      icon: Instagram,
      url: "https://www.instagram.com/the_kingdawit/",
      label: "Instagram",
    },
    {
      icon: TiktokIcon,
      url: "https://www.tiktok.com/@the_kingdawit",
      label: "TikTok",
    },
    {
      icon: TelegramIcon,
      url: "https://t.me/the_kingdawit",
      label: "Telegram",
    },
  ];

  return (
    <section
      id="contact"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen py-24 bg-background overflow-hidden"
      style={{ y }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: dynamicGradient, opacity }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            LET'S CREATE TOGETHER
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Have a project in mind? Let's bring it to life with cinematic
            excellence.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* FORM */}
          <div className="rounded-2xl border border-primary/10 bg-background/50 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                placeholder="Full Name"
                value={formData.name}
                required
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                required
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <Select
                value={formData.projectType}
                onValueChange={(value) =>
                  setFormData({ ...formData, projectType: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Project Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="music-video">Music Video</SelectItem>
                  <SelectItem value="short-film">Short Film</SelectItem>
                  <SelectItem value="documentary">Documentary</SelectItem>
                  <SelectItem value="event">Event Coverage</SelectItem>
                </SelectContent>
              </Select>

              <Textarea
                placeholder="Tell me about your project..."
                rows={5}
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />

              <Button
                type="submit"
                className="w-full h-14"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="mr-2" /> Send Message
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* INFO */}
          <div className="space-y-6">
            {contactInfo.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-xl border p-4"
              >
                <item.icon className="text-primary" />
                <div>
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-sm">{item.value}</p>
                  <p className="text-xs text-primary">{item.description}</p>
                </div>
              </div>
            ))}

            <div>
              <p className="font-semibold mb-3">Connect with me</p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 border rounded-xl hover:bg-primary/5 hover:border-primary/30 transition-colors group"
                    aria-label={social.label}
                  >
                    <div className="flex flex-col items-center">
                      <social.icon className="group-hover:scale-110 transition-transform" />
                      <span className="text-xs mt-1 opacity-70">
                        {social.label}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
