"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const FluidBackground = () => {
  const { scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Parallax effects based on scroll
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);
  const rotate = useTransform(scrollY, [0, 1000], [0, 45]);

  // Smooth mouse tracking
  const springConfig = { damping: 25, stiffness: 100 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position (-1 to 1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x * 50); // Move orbs slightly with mouse
      mouseY.set(y * 50);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-50 bg-background">
      {/* 1. The Moving Gradients (The Liquid) */}
      <div className="absolute inset-0 opacity-40">
        {/* Orb 1: Primary Gold */}
        <motion.div
          style={{ y: y1, x: mouseX, rotate }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] rounded-full blur-[120px] bg-primary/20 mix-blend-screen"
        />

        {/* Orb 2: Deep Secondary (Depth) */}
        <motion.div
          style={{ y: y2, x: mouseY }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[140px] bg-[hsl(30,100%,20%)]/20 mix-blend-screen"
        />

        {/* Orb 3: Accent Highlight (Movement) */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full blur-[100px] bg-primary/10 mix-blend-screen"
        />
      </div>

      {/* 2. The 3D Grid Floor (Perspective) */}
      <div className="absolute inset-0 w-full h-[200%] top-[-50%] bg-grid-perspective opacity-20" />

      {/* 3. The Vignette (Cinematic Focus) */}
      <div className="absolute inset-0 bg-vignette" />

      {/* 4. Film Grain (Texture) */}
      <div className="bg-noise" />
    </div>
  );
};
