// src/components/Navigation.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Play, Mail, Video, Camera, Sparkles } from "lucide-react";
import LogoImage from "@/assets/logo.png";

// Types
interface NavLink {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

interface Particle {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

// Debounce utility
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  // Enhanced scroll transforms
  const backgroundOpacity = useTransform(scrollY, [0, 100], [0, 0.98]);
  const blurAmount = useTransform(scrollY, [0, 100], [0, 20]);
  const navY = useTransform(scrollY, [0, 100], [0, 0]);
  const borderOpacity = useTransform(scrollY, [0, 50], [0, 1]);

  // Mouse tracking for interactive effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useSpring(mouseX, { damping: 30, stiffness: 400 });
  const cursorY = useSpring(mouseY, { damping: 30, stiffness: 400 });

  const navLinks: NavLink[] = [
    { name: "Showreel", href: "#showreel", icon: Play },
    { name: "Work", href: "#work", icon: Video },
    { name: "About", href: "#about", icon: Camera },
    { name: "Contact", href: "#contact", icon: Mail },
  ];

  // Enhanced scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setIsScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    const debouncedScroll = debounce(handleScroll, 10);
    window.addEventListener("scroll", debouncedScroll, { passive: true });

    return () => window.removeEventListener("scroll", debouncedScroll);
  }, [lastScrollY]);

  // Touch device detection
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // Enhanced mouse move with debouncing
  const handleMouseMove = useCallback(
    debounce((event: React.MouseEvent) => {
      if (!navRef.current || isTouchDevice) return;

      const rect = navRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      mouseX.set(x * 100);
      mouseY.set(y * 100);
    }, 16),
    [isTouchDevice]
  );

  // Enhanced scroll to section with offset
  const scrollToSection = useCallback((href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const navHeight = navRef.current?.offsetHeight || 0;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setIsMobileMenuOpen(false);
  }, []);

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, href: string) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        scrollToSection(href);
      }
    },
    [scrollToSection]
  );

  // Enhanced animations
  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1,
      },
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17,
      },
    },
  };

  // Enhanced particles for navigation
  const navParticles: Particle[] = [...Array(8)].map((_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 6 + Math.random() * 8,
    delay: i * 0.3,
  }));

  // Clean up motion values
  useEffect(() => {
    return () => {
      mouseX.clearListeners();
      mouseY.clearListeners();
    };
  }, []);

  // Hover props for touch devices
  const hoverProps = !isTouchDevice
    ? {
        whileHover: "hover",
        onHoverStart: () => setActiveHover,
        onHoverEnd: () => setActiveHover(null),
      }
    : {};

  return (
    <motion.header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 transform-gpu"
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      style={{
        y: navY,
        background: isScrolled
          ? `rgba(4, 4, 4, ${backgroundOpacity})`
          : "transparent",
        backdropFilter: isScrolled ? `blur(${blurAmount}px)` : "none",
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Enhanced Animated Border Bottom */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        style={{ opacity: borderOpacity }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isScrolled ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Navigation Particles */}
      {isScrolled && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {navParticles.map((particle) => (
            <motion.span
              key={particle.id}
              className="absolute bg-primary/20 rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                top: `${particle.y}%`,
                left: `${particle.x}%`,
              }}
              animate={{
                opacity: [0.1, 0.4, 0.1],
                y: [-10, 20],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                repeatType: "mirror",
                delay: particle.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Dynamic Glow Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 30% 0%, rgba(212,175,55,0.08) 0%, transparent 50%)",
            "radial-gradient(circle at 70% 0%, rgba(212,175,55,0.05) 0%, transparent 50%)",
            "radial-gradient(circle at 30% 0%, rgba(212,175,55,0.08) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo with Hero-style Effects */}
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group relative flex items-center gap-3 overflow-hidden"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            aria-label="Scroll to top"
          >
            <motion.div className="relative">
              <img
                src={LogoImage}
                alt="Nigus Dawit Logo"
                className="h-14 w-auto object-contain"
              />

              {/* Logo Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-primary/30 rounded-full blur-lg -z-10"
                initial={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1.3, opacity: 0.6 }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          </motion.button>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <motion.button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                onKeyDown={(e) => handleKeyDown(e, link.href)}
                className="text-foreground/80 hover:text-primary font-medium relative py-3 px-4 group"
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                {...hoverProps}
                transition={{ duration: 0.3 }}
                tabIndex={0}
                role="button"
                aria-label={`Navigate to ${link.name} section`}
              >
                <div className="flex items-center gap-2 relative z-10">
                  <link.icon className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                  <span>{link.name}</span>
                </div>

                {/* Enhanced Underline Animation */}
                <motion.span
                  className="absolute bottom-2 left-4 right-4 h-0.5 bg-gradient-to-r from-primary to-yellow-200 rounded-full"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: activeHover === link.name ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />

                {/* Glass Morphism Background */}
                <motion.span
                  className="absolute inset-0 bg-background/10 backdrop-blur-md rounded-xl border border-primary/10 -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeHover === link.name ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Particle Sparkle on Hover */}
                {activeHover === link.name && (
                  <motion.div
                    className="absolute -top-1 -right-1 text-primary"
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ scale: 1, rotate: 180 }}
                    exit={{ scale: 0, rotate: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Sparkles className="h-3 w-3" />
                  </motion.div>
                )}
              </motion.button>
            ))}

            {/* Enhanced CTA Button - Matching Hero Style */}
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                onClick={() => scrollToSection("#contact")}
                className="relative bg-gradient-to-r from-primary to-yellow-400 hover:from-primary/90 hover:to-yellow-400/90 text-primary-foreground font-semibold px-8 py-3 rounded-2xl shadow-2xl group overflow-hidden border-2 border-primary/30 min-w-[140px]"
                aria-label="Start a project with Nigus Dawit"
              >
                {/* Animated Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8 }}
                />

                <span className="relative z-10 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Let's Create
                </span>

                {/* Continuous Glow Animation */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-primary/40"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(212,175,55,0.4)",
                      "0 0 40px rgba(212,175,55,0.8)",
                      "0 0 20px rgba(212,175,55,0.4)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </Button>
            </motion.div>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <motion.button
            className="lg:hidden text-foreground hover:text-primary transition-colors relative p-3 rounded-xl bg-background/10 backdrop-blur-md border border-primary/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(212,175,55,0.1)",
            }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={isMobileMenuOpen ? "open" : "closed"}
              initial={false}
              className="relative"
            >
              {isMobileMenuOpen ? (
                <X size={24} className="relative z-10" />
              ) : (
                <Menu size={24} className="relative z-10" />
              )}
            </motion.div>

            {/* Animated Border */}
            <motion.div
              className="absolute inset-0 border-2 border-primary/30 rounded-xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </motion.button>
        </div>

        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="lg:hidden overflow-hidden bg-background/95 backdrop-blur-2xl rounded-2xl mt-4 border border-primary/20 shadow-2xl"
              role="dialog"
              aria-label="Mobile navigation menu"
            >
              <div className="flex flex-col gap-2 p-4">
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.name}
                    onClick={() => scrollToSection(link.href)}
                    onKeyDown={(e) => handleKeyDown(e, link.href)}
                    className="text-foreground hover:text-primary transition-colors font-medium text-left py-4 px-6 rounded-xl hover:bg-primary/5 relative overflow-hidden group"
                    variants={navItemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Navigate to ${link.name} section`}
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <link.icon className="h-5 w-5 opacity-70" />
                      <span className="text-lg">{link.name}</span>
                    </div>

                    {/* Mobile Menu Item Background Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent -z-10 rounded-xl"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.4 }}
                    />

                    {/* Mobile Underline */}
                    <motion.div
                      className="absolute bottom-2 left-6 right-6 h-0.5 bg-gradient-to-r from-primary to-transparent rounded-full"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="pt-4"
                >
                  <Button
                    onClick={() => scrollToSection("#contact")}
                    onKeyDown={(e) => handleKeyDown(e, "#contact")}
                    className="w-full bg-gradient-to-r from-primary to-yellow-400 hover:from-primary/90 hover:to-yellow-400/90 text-primary-foreground font-semibold py-4 rounded-xl shadow-2xl relative overflow-hidden border-2 border-primary/30"
                    tabIndex={0}
                    role="button"
                  >
                    {/* Shine Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.8 }}
                    />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Mail className="h-5 w-5" />
                      Let's Create
                    </span>

                    {/* Glow Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-xl border-2 border-primary/40"
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(212,175,55,0.4)",
                          "0 0 40px rgba(212,175,55,0.8)",
                          "0 0 20px rgba(212,175,55,0.4)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Navigation;
