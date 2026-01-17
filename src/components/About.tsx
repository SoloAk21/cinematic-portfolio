// src/components/About.tsx
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
// 1. ADDED NEW ICONS HERE
import {
  Play,
  Clapperboard,
  Film,
  Zap,
  Sparkles,
  PenTool,
  Smartphone,
  Aperture,
} from "lucide-react";
import portraitImage from "@/assets/portrait.jpeg";

const About = () => {
  const ref = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { scrollY } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Enhanced parallax effects
  const y = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300, 500], [1, 0.8, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.05]);

  // Mouse tracking
  const cursorX = useSpring(mouseX, { damping: 30, stiffness: 400 });
  const cursorY = useSpring(mouseY, { damping: 30, stiffness: 400 });

  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    mouseX.set(x);
    mouseY.set(y);
  }, []);

  // Enhanced animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const dynamicGradient = useMotionTemplate`
    radial-gradient(
      600px circle at ${cursorX}% ${cursorY}%,
      rgba(212, 175, 55, 0.1) 0%,
      transparent 60%
    )
  `;

  // 2. DEFINED PROFESSIONS DATA
  const professions = [
    { label: "Cinematographer", icon: Aperture },
    { label: "Video Editor", icon: Clapperboard },
    { label: "Graphics Designer", icon: PenTool },
    { label: "Content Creator", icon: Smartphone },
  ];

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative min-h-screen py-20 md:py-28 bg-background overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background Elements (Unchanged) */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/3"
        style={{ opacity, scale }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: dynamicGradient }}
      />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.1)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* Floating Elements Loop (Unchanged) */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-primary/5 rounded-full"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, 20, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 8,
              repeat: Infinity,
              delay: i * 1.5,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Image Column (Unchanged) */}
          <motion.div
            className="relative order-2 lg:order-1"
            variants={itemVariants}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <motion.div
              className="relative aspect-[3/4] rounded-2xl overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.img
                src={portraitImage}
                alt="Nigus Dawit - Cinematographer"
                className="w-full h-full object-cover"
                initial={{ scale: 1.2, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.3, duration: 0.8 }}
              />
              <motion.div
                className="absolute inset-0 border border-primary/20 rounded-2xl"
                animate={{
                  borderColor: [
                    "rgba(212,175,55,0.2)",
                    "rgba(212,175,55,0.4)",
                    "rgba(212,175,55,0.2)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute top-4 right-4 w-12 h-12 bg-primary/10 rounded-full border border-primary/20 backdrop-blur-sm flex items-center justify-center"
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <Sparkles className="h-5 w-5 text-primary/60" />
              </motion.div>
              <AnimatePresence>
                {isHovering && (
                  <motion.div
                    className="absolute inset-0 bg-primary/5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
            <motion.div
              className="absolute -z-10 -bottom-4 -left-4 w-32 h-32 border border-primary/10 rounded-xl"
              animate={{ rotate: [0, -5, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
          </motion.div>

          {/* Content Column */}
          <motion.div
            className="space-y-8 order-1 lg:order-2"
            variants={containerVariants}
          >
            {/* Header Text (Unchanged) */}
            <motion.div
              variants={itemVariants}
              className="space-y-6 text-center lg:text-left"
            >
              <motion.div
                className="text-base md:text-lg font-light text-primary/80 tracking-widest uppercase"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <motion.span
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  The Visionary
                </motion.span>
              </motion.div>

              <motion.h2
                className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter"
                variants={itemVariants}
              >
                <motion.span
                  className="block bg-gradient-to-b from-white via-white/95 to-white/90 bg-clip-text text-transparent"
                  style={{ textShadow: "0 0 60px rgba(212,175,55,0.3)" }}
                >
                  CRAFTING
                </motion.span>
                <motion.span
                  className="block bg-gradient-to-br from-primary via-yellow-400 to-yellow-600 bg-clip-text text-transparent mt-2"
                  style={{ textShadow: "0 0 80px rgba(212,175,55,0.5)" }}
                >
                  VISIONS
                </motion.span>
              </motion.h2>

              <motion.div
                className="w-24 h-0.5 bg-gradient-to-r from-primary via-yellow-400 to-primary rounded-full mx-auto lg:mx-0"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
              />
            </motion.div>

            {/* Description (Unchanged) */}
            <motion.div
              className="space-y-4 text-muted-foreground text-base leading-relaxed"
              variants={itemVariants}
            >
              <motion.p variants={itemVariants} className="text-lg">
                Transforming concepts into{" "}
                <span className="text-primary font-semibold">
                  cinematic reality
                </span>{" "}
                through expert editing and visual storytelling.
              </motion.p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-2 pt-2 justify-center lg:justify-start"
            >
              {professions.map((role, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs md:text-sm font-medium text-foreground/80 hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <role.icon className="h-3.5 w-3.5" />
                  <span>{role.label}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Buttons (Unchanged) */}
            <motion.div
              variants={itemVariants}
              className="pt-6 flex flex-col sm:flex-row gap-3"
            >
              <Button
                size="default"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-4 rounded-lg flex-1"
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <div className="flex items-center gap-2 justify-center">
                  <Play className="h-4 w-4 fill-current" />
                  <span>Start Project</span>
                </div>
              </Button>

              <Button
                size="default"
                variant="outline"
                className="border-primary/20 hover:border-primary/40 text-foreground font-medium px-6 py-4 rounded-lg flex-1"
                onClick={() =>
                  document
                    .getElementById("showreel")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <div className="flex items-center gap-2 justify-center">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>View Showreel</span>
                </div>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.3)_70%)]"
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </section>
  );
};

export default About;
