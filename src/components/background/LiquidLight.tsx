import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";

export default function LiquidLight() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Mouse Tracking Logic with Spring Physics (Smoothness)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    // Center the effect on the cursor
    mouseX.set(clientX);
    mouseY.set(clientY);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 2. Scroll Parallax (Creates 3D Depth)
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 400]); // Moves slow
  const y2 = useTransform(scrollY, [0, 1000], [0, -300]); // Moves fast (creates depth)
  const rotate = useTransform(scrollY, [0, 1000], [0, 45]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none"
    >
      {/* A. Global Grain Overlay (The Cinematic Texture) */}
      <div className="absolute inset-0 opacity-[0.03] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* B. The "God Ray" - Primary Gold Light (Follows Mouse) */}
      <motion.div
        style={{
          left: smoothX,
          top: smoothY,
          x: "-50%",
          y: "-50%",
        }}
        className="absolute w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-primary/20 blur-[100px] mix-blend-screen"
      />

      {/* C. Ambient Moving Blobs (Automatic Animation) */}
      <motion.div
        style={{ y: y1, rotate }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-purple-900/20 to-blue-900/20 blur-[120px] mix-blend-screen"
      />

      <motion.div
        style={{ y: y2 }}
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-10%] right-[-20%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-tl from-yellow-900/10 via-amber-900/10 to-transparent blur-[130px] mix-blend-screen"
      />

      {/* D. Center Vignette (Focus the user's eye on content) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] z-40" />

      {/* E. Gradient Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background/90 z-30" />
    </div>
  );
}
