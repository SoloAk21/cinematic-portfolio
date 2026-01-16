// src/components/Services.tsx
"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { useInView } from "framer-motion";
import {
  Camera,
  Film,
  Palette,
  AudioWaveform,
  Sparkles,
  ArrowRight,
  Play,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Camera,
    title: "Cinematography/DP",
    description:
      "Professional camera operation and visual storytelling for commercials, music videos, and films",
  },
  {
    icon: Film,
    title: "Video Editing",
    description:
      "Crafting compelling narratives through expert cutting, pacing, and post-production techniques",
  },
  {
    icon: Palette,
    title: "Color Grading",
    description:
      "Cinematic color correction and grading to enhance mood, emotion, and visual consistency",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Discovery",
    description: "Understanding your vision, goals, and project requirements",
    icon: Play,
  },
  {
    number: "02",
    title: "Pre-Production",
    description: "Planning, storyboarding, and preparing for the shoot",
    icon: Camera,
  },
  {
    number: "03",
    title: "Production",
    description: "Capturing stunning footage with professional equipment",
    icon: Film,
  },
  {
    number: "04",
    title: "Post-Production",
    description: "Editing, color grading, and adding finishing touches",
    icon: Palette,
  },
  {
    number: "05",
    title: "Delivery",
    description: "Final review and delivery in your preferred formats",
    icon: Sparkles,
  },
];

const Services = () => {
  const ref = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { scrollY } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const y = useTransform(scrollY, [0, 500], [0, -20]);
  const opacity = useTransform(scrollY, [0, 300, 500], [1, 0.98, 0.95]);

  const cursorX = useSpring(mouseX, { damping: 25, stiffness: 500 });
  const cursorY = useSpring(mouseY, { damping: 25, stiffness: 500 });

  const [hoveredService, setHoveredService] = useState<number | null>(null);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    mouseX.set(x);
    mouseY.set(y);
  }, []);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
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

  return (
    <section
      id="services"
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
            Professional Services
          </motion.div>

          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6"
            variants={itemVariants}
          >
            <span className="block bg-gradient-to-b from-white to-white/90 bg-clip-text text-transparent">
              CREATIVE
            </span>
            <span className="block bg-gradient-to-br from-primary to-yellow-600 bg-clip-text text-transparent mt-2">
              SERVICES
            </span>
          </motion.h2>

          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Comprehensive video production services from concept to final
            delivery, crafted with cinematic excellence
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              custom={index}
              className="group"
              onMouseEnter={() => setHoveredService(index)}
              onMouseLeave={() => setHoveredService(null)}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-primary/10 group-hover:border-primary/30 transition-all duration-300 h-full">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3">
                  {service.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed text-base mb-4">
                  {service.description}
                </p>

                <div className="flex items-center gap-2 pt-4 border-t border-primary/10">
                  <span className="text-sm text-primary font-medium">
                    Learn More
                  </span>
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-20"
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <motion.div
              className="text-lg font-light text-primary/80 tracking-widest uppercase mb-6"
              variants={itemVariants}
            >
              Work Process
            </motion.div>

            <motion.h2
              className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6"
              variants={itemVariants}
            >
              <span className="block bg-gradient-to-b from-white to-white/90 bg-clip-text text-transparent">
                THE
              </span>
              <span className="block bg-gradient-to-br from-primary to-yellow-600 bg-clip-text text-transparent mt-2">
                PROCESS
              </span>
            </motion.h2>

            <motion.p
              className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              A streamlined workflow designed for excellence at every stage of
              production
            </motion.p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.number}
                  variants={itemVariants}
                  custom={index}
                  className="text-center group"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative w-20 h-20 mx-auto mb-6 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                    <step.icon className="w-8 h-8 text-primary-foreground" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border border-primary/30 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center"
        >
          <motion.div
            className="bg-background/50 backdrop-blur-sm rounded-2xl p-8 border border-primary/10 max-w-md mx-auto"
            variants={itemVariants}
          >
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Create
              <span className="block text-primary mt-1">
                Something Amazing?
              </span>
            </h3>

            <p className="text-muted-foreground text-base mb-6">
              Let's bring your vision to life
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={scrollToContact}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-xl flex items-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Start Project
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  document
                    .getElementById("showreel")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="border-primary/20 text-foreground font-semibold px-6 py-3 rounded-xl flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                View Showreel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
