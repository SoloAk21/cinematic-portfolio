// src/components/Testimonials.tsx
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
import { useRef, useState, useEffect, useCallback } from "react";
import { useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  project: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Michael Chen",
    role: "Creative Director",
    company: "Apex Studios",
    content:
      "Solomon's ability to capture emotion and tell stories through the lens is unmatched. His work on our commercial campaign exceeded all expectations and brought our vision to life beautifully.",
    rating: 5,
    project: "Luxury Automotive Campaign",
    avatar: "MC",
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "Music Producer",
    company: "Soundwave Records",
    content:
      "Working with Solomon on our music videos has been incredible. He understands the rhythm and mood of each track and translates it into stunning visual narratives.",
    rating: 5,
    project: "Chart-Topping Music Video",
    avatar: "SW",
  },
  {
    id: 3,
    name: "David Rodriguez",
    role: "Film Director",
    company: "Independent",
    content:
      "Solomon's technical mastery and artistic eye make him one of the best cinematographers I've collaborated with. His color grading work is particularly exceptional.",
    rating: 5,
    project: "Award-Winning Short Film",
    avatar: "DR",
  },
];

const Testimonials = () => {
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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    mouseX.set(x);
    mouseY.set(y);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const next = () => {
    setIsAutoPlaying(false);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setIsAutoPlaying(false);
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
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

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
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
      id="testimonials"
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
            Client Stories
          </motion.div>

          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6"
            variants={itemVariants}
          >
            <span className="block bg-gradient-to-b from-white to-white/90 bg-clip-text text-transparent">
              CLIENT
            </span>
            <span className="block bg-gradient-to-br from-primary to-yellow-600 bg-clip-text text-transparent mt-2">
              TESTIMONIALS
            </span>
          </motion.h2>

          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            What collaborators and clients say about working together on
            creative projects
          </motion.p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          <div className="relative h-[400px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                }}
                className="absolute inset-0"
              >
                <div className="relative rounded-2xl bg-background/50 backdrop-blur-sm border border-primary/10 p-8 h-full">
                  <Quote className="w-12 h-12 text-primary/20 mb-6" />

                  <div className="flex gap-2 mb-6">
                    {[...Array(testimonials[currentIndex].rating)].map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-yellow-400"
                        />
                      )
                    )}
                  </div>

                  <blockquote className="text-xl text-muted-foreground leading-relaxed mb-8 italic">
                    "{testimonials[currentIndex].content}"
                  </blockquote>

                  <div className="border-t border-primary/10 pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <span className="text-lg font-bold text-primary">
                          {testimonials[currentIndex].avatar}
                        </span>
                      </div>
                      <div>
                        <p className="text-foreground font-bold text-lg">
                          {testimonials[currentIndex].name}
                        </p>
                        <p className="text-muted-foreground text-base">
                          {testimonials[currentIndex].role} at{" "}
                          {testimonials[currentIndex].company}
                        </p>
                        <p className="text-primary font-medium text-sm mt-1">
                          {testimonials[currentIndex].project}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-6 mt-12">
            <motion.button
              onClick={prev}
              className="w-12 h-12 rounded-xl bg-background/50 border border-primary/10 hover:border-primary/30 flex items-center justify-center transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="h-5 w-5 text-primary" />
            </motion.button>

            <div className="flex items-center gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-primary"
                      : "w-2 bg-primary/30 hover:bg-primary/50"
                  }`}
                />
              ))}
            </div>

            <motion.button
              onClick={next}
              className="w-12 h-12 rounded-xl bg-background/50 border border-primary/10 hover:border-primary/30 flex items-center justify-center transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="h-5 w-5 text-primary" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
