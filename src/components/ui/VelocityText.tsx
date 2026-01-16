"use client";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useVelocity,
  useSpring,
} from "framer-motion";

interface VelocityTextProps {
  content: string;
  baseSkew?: number; // Optional base skew
  className?: string;
}

const VelocityText = ({
  content,
  baseSkew = 0,
  className,
}: VelocityTextProps) => {
  const targetRef = useRef(null);
  const { scrollY } = useScroll();

  // Calculate scroll velocity
  const scrollVelocity = useVelocity(scrollY);

  // Smooth out the velocity value
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  // Map velocity to skew degrees
  // Faster scroll = More skew
  const skewX = useTransform(smoothVelocity, [-1000, 0, 1000], [-15, 0, 15]);

  return (
    <div ref={targetRef} className="overflow-hidden">
      <motion.p
        style={{ skewX }}
        className={`will-change-transform ${className}`}
      >
        {content}
      </motion.p>
    </div>
  );
};

export default VelocityText;
