import { Variants } from "framer-motion";

// Shared color scheme
export const CINEMATIC_COLORS = {
  primary: "rgba(212, 175, 55, 1)",
  primaryLight: "rgba(212, 175, 55, 0.6)",
  primaryDark: "rgba(212, 175, 55, 0.3)",
  background: "rgba(4, 4, 4, 1)",
  backgroundLight: "rgba(10, 10, 10, 0.95)",
};

// Shared animation configurations
export const SPRING_CONFIG = {
  stiffness: 400,
  damping: 17,
  mass: 0.8,
};

export const EASING = [0.25, 0.1, 0.25, 1] as const;

// Shared particle configurations
export const PARTICLE_CONFIG = {
  count: 20,
  size: { min: 1, max: 4 },
  duration: { min: 8, max: 15 },
};

// Shared text animations
export const textRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    rotateX: 45,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 1.2,
      ease: EASING,
    },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

// Shared hover animations
export const magneticVariants: Variants = {
  rest: {
    scale: 1,
    x: 0,
    y: 0,
  },
  hover: {
    scale: 1.05,
    x: 0,
    y: -2,
    transition: {
      type: "spring",
      ...SPRING_CONFIG,
    },
  },
};

// Shared glow animations
export const glowAnimation = {
  boxShadow: [
    "0 0 20px rgba(212,175,55,0.4)",
    "0 0 40px rgba(212,175,55,0.8)",
    "0 0 20px rgba(212,175,55,0.4)",
  ],
  transition: {
    duration: 2,
    repeat: Infinity,
  },
};
