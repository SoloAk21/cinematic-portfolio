// src/components/Hero.tsx
"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Play,
  Mail,
  ArrowDown,
  Star,
  Camera,
  Film,
  Aperture,
} from "lucide-react";
import heroImage from "@/assets/hero-bg.jpeg";
import { useRef, useState, useCallback } from "react";

const Hero = () => {
  const { scrollY } = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);

  // Advanced parallax with depth layers
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const foregroundY = useTransform(scrollY, [0, 500], [0, 50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // CHANGED: Start scale at 1.05 to hide the soft edges caused by the blur
  const scale = useTransform(scrollY, [0, 300], [1.05, 1.2]);

  // Mouse tracking with smooth physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const cursorX = useSpring(mouseX, { damping: 25, stiffness: 400 });
  const cursorY = useSpring(mouseY, { damping: 25, stiffness: 400 });

  const [isHovering, setIsHovering] = useState(false);

  // Enhanced mouse tracking
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    mouseX.set(x);
    mouseY.set(y);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Advanced animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 80,
      filter: "blur(12px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  };

  // Dynamic gradient based on mouse position
  const dynamicGradient = useMotionTemplate`
    radial-gradient(
      400px circle at ${cursorX}% ${cursorY}%,
      rgba(212, 175, 55, 0.2) 0%,
      rgba(212, 175, 55, 0.05) 30%,
      transparent 70%
    )
  `;

  // Floating cinematic elements - smaller and fewer on mobile
  const floatingElements = [
    { id: 1, icon: Camera, x: 10, y: 20, delay: 0, size: 20, mobileSize: 16 },
    { id: 2, icon: Film, x: 85, y: 30, delay: 0.5, size: 24, mobileSize: 18 },
    { id: 3, icon: Aperture, x: 15, y: 70, delay: 1, size: 18, mobileSize: 14 },
    { id: 4, icon: Star, x: 90, y: 75, delay: 1.5, size: 16, mobileSize: 12 },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-16 md:pt-20"
      id="home"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Advanced Background System */}
      <motion.div
        // CHANGED: Added 'blur-[3px]' here
        className="absolute inset-0 bg-cover bg-center blur-[3px]"
        style={{
          // Use .src if heroImage is an object (typical in Next.js)
          backgroundImage: `url(${heroImage.src || heroImage})`,
          y: backgroundY,
          scale,
        }}
      >
        {/* Multi-layer Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/70 to-background/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

        {/* Animated Light Leaks */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-yellow-600/10"
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </motion.div>

      {/* Interactive Mouse Gradient - smaller on mobile */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: dynamicGradient,
        }}
      />

      {/* Floating Cinematic Elements - conditionally rendered on larger screens */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute text-primary/20 hidden sm:block"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut",
            }}
          >
            <element.icon
              size={element.size}
              className="w-4 h-4 md:w-6 md:h-6"
            />
          </motion.div>
        ))}
      </div>

      {/* Subtle Particle System - reduced on mobile */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-primary/10 rounded-full"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 15 - 7.5, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center px-4 sm:px-6 mx-auto w-full max-w-4xl lg:max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          opacity,
          y: foregroundY,
        }}
      >
        {/* Premium Header */}
        <motion.div variants={itemVariants} className="mb-8 md:mb-12">
          <motion.div
            className="text-sm md:text-lg font-light text-primary/80 mb-6 md:mb-8 tracking-widest uppercase"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
          >
            <motion.span
              animate={{
                opacity: [0.6, 1, 0.6],
                letterSpacing: ["0.1em", "0.2em", "0.1em"],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-xs md:text-sm"
            >
              Cinematic Storyteller
            </motion.span>
          </motion.div>

          {/* Master Headline - Responsive sizes */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-4 md:mb-6 tracking-tighter leading-[0.9]"
            variants={itemVariants}
          >
            <motion.span
              className="block bg-gradient-to-b from-white via-white/95 to-white/90 bg-clip-text text-transparent"
              style={{
                textShadow: "0 0 60px rgba(212,175,55,0.3)",
              }}
            >
              NIGUS
            </motion.span>
            <motion.span
              className="block bg-gradient-to-br from-primary via-yellow-400 to-yellow-600 bg-clip-text text-transparent mt-2 md:mt-4"
              style={{
                textShadow: "0 0 80px rgba(212,175,55,0.5)",
              }}
            >
              DAWIT
            </motion.span>
          </motion.h1>
        </motion.div>

        {/* Enhanced Tagline - Responsive text */}
        <motion.div variants={itemVariants} className="mb-12 md:mb-16">
          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-light tracking-wide max-w-2xl md:max-w-4xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.8 }}
          >
            Crafting{" "}
            <span className="text-primary font-medium">
              immersive visual stories
            </span>{" "}
            through the art of{" "}
            <span className="text-primary font-medium">motion and light</span>
          </motion.p>
        </motion.div>

        {/* Minimalistic CTA Section */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4"
          variants={itemVariants}
        >
          {/* Primary CTA - Minimal */}
          <motion.div
            whileHover={{
              scale: 1.02,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 17,
              },
            }}
            className="w-full sm:w-auto"
          >
            <Button
              size="default"
              className="relative bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 md:px-8 py-4 text-sm rounded-lg group overflow-hidden border border-primary/30 min-w-[140px] md:min-w-[150px]"
              onClick={() => scrollToSection("showreel")}
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                <Play className="h-4 w-4 fill-current" />
                <span>View Showreel</span>
              </div>
            </Button>
          </motion.div>

          {/* Secondary CTA - Minimal */}
          <motion.div
            whileHover={{
              scale: 1.02,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 17,
              },
            }}
            className="w-full sm:w-auto"
          >
            <Button
              size="default"
              variant="outline"
              className="relative bg-background/5 backdrop-blur-sm border-border hover:bg-accent hover:text-accent-foreground font-medium px-6 md:px-8 py-4 text-sm rounded-lg min-w-[140px] md:min-w-[150px]"
              onClick={() => scrollToSection("contact")}
            >
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Start Project</span>
              </div>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Cinematic Vignette */}
      <motion.div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_40%,rgba(0,0,0,0.8)_100%)]"
        animate={{
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Elegant Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 md:gap-3 text-primary/60"
          animate={{
            y: [0, 6, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <span className="text-xs font-light tracking-widest">EXPLORE</span>
          <ArrowDown className="h-4 w-4 md:h-5 md:w-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
