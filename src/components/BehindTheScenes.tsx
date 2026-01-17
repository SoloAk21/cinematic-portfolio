// src/components/BehindTheScenes.tsx
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
import {
  Camera,
  Film,
  Palette,
  ZoomIn,
  Play,
  Aperture,
  Clock,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import bts1 from "@/assets/bts1.jpeg";
import bts2 from "@/assets/bts2.jpg";
import bts3 from "@/assets/bts3.jpg";

interface BTSItem {
  id: number;
  image: string;
  caption: string;
  category: string;
  icon: React.ComponentType<any>;
  duration: string;
  equipment: string[];
  description: string;
  stats: { label: string; value: string }[];
}

const btsImages: BTSItem[] = [
  {
    id: 1,
    image: bts1,
    caption: "Mastering cinematic lighting techniques on set",
    category: "Cinematography",
    icon: Camera,
    duration: "8 Hours",
    equipment: [
      "Sony FX3 Cinema Line",
      "DJI Ronin Gimbal",
      "G-Master Lens",
      "Softbox Dome Light",
    ],
    description:
      "Professional cinematographer operating a rigged Sony FX3 on a gimbal in a modern studio, cinematic lighting and composition",
    stats: [
      { label: "Camera", value: "Sony FX3" },
      { label: "Lens", value: "G-Master Prime" },
    ],
  },

  {
    id: 2,
    image: bts2,
    caption: "Precision color grading in DaVinci Resolve",
    category: "Color Science",
    icon: Palette,
    duration: "6 Hours",
    equipment: ["DaVinci Resolve", "Flanders DM250", "Color Managed"],
    description:
      "Advanced color grading session achieving cinematic look with precise color management workflow",
    stats: [
      { label: "Software", value: "DaVinci" },
      { label: "Monitor", value: "Flanders" },
      { label: "Color Space", value: "ACES" },
    ],
  },
  {
    id: 3,
    image: bts3,
    caption: "Aerial cinematography at magic hour",
    category: "Drone Operation",
    icon: Aperture,
    duration: "4 Hours",
    equipment: ["DJI Inspire 3", "Zenmuse X9", "ProRes RAW"],
    description:
      "Aerial footage capture during golden hour with professional cinema drone and 8K camera system",
    stats: [
      { label: "Drone", value: "Inspire 3" },
      { label: "Camera", value: "Zenmuse X9" },
      { label: "Format", value: "ProRes RAW" },
    ],
  },
];

const BehindTheScenes = () => {
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

  const [selectedImage, setSelectedImage] = useState<BTSItem | null>(null);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    mouseX.set(x);
    mouseY.set(y);
  }, []);

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
      id="bts"
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
            Creative Laboratory
          </motion.div>

          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6"
            variants={itemVariants}
          >
            <span className="block bg-gradient-to-b from-white to-white/90 bg-clip-text text-transparent">
              BEHIND THE
            </span>
            <span className="block bg-gradient-to-br from-primary to-yellow-600 bg-clip-text text-transparent mt-2">
              SCENES
            </span>
          </motion.h2>

          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Exclusive access to the creative process, technical mastery, and
            artistic vision behind every project
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {btsImages.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              custom={index}
              className="group"
              onMouseEnter={() => setHoveredImage(item.id)}
              onMouseLeave={() => setHoveredImage(null)}
              onClick={() => setSelectedImage(item)}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative overflow-hidden rounded-xl bg-background/50 backdrop-blur-sm border border-primary/10 group-hover:border-primary/30 transition-all duration-300">
                <div className="relative aspect-square overflow-hidden">
                  <motion.img
                    src={item.image}
                    alt={item.caption}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3">
                    <span className="bg-black/80 backdrop-blur-sm rounded px-2 py-1 text-xs font-medium text-primary border border-primary/20">
                      {item.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1 bg-black/80 backdrop-blur-sm rounded px-2 py-1 border border-primary/20">
                      <Clock className="h-3 w-3 text-primary" />
                      <span className="text-xs text-muted-foreground font-medium">
                        {item.duration}
                      </span>
                    </div>
                  </div>

                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg border border-white/20">
                      <ZoomIn className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </motion.div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {item.caption}
                  </h3>

                  <div className="flex flex-wrap gap-1">
                    {item.equipment.slice(0, 2).map((equip) => (
                      <span
                        key={equip}
                        className="text-xs bg-primary/10 text-primary rounded px-2 py-1 border border-primary/20"
                      >
                        {equip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          {selectedImage && (
            <Dialog
              open={!!selectedImage}
              onOpenChange={() => setSelectedImage(null)}
            >
              <DialogContent className="max-w-4xl p-0 bg-background border-primary/20 rounded-lg overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative"
                >
                  <div className="grid lg:grid-cols-2 gap-0">
                    <div className="relative">
                      <img
                        src={selectedImage.image}
                        alt={selectedImage.caption}
                        className="w-full h-64 lg:h-full object-cover"
                      />
                    </div>

                    <div className="p-6 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <selectedImage.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <span className="text-primary font-semibold text-sm">
                            {selectedImage.category}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{selectedImage.duration}</span>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-foreground">
                        {selectedImage.caption}
                      </h3>

                      <p className="text-muted-foreground leading-relaxed">
                        {selectedImage.description}
                      </p>

                      <div>
                        <h4 className="text-sm font-semibold text-primary mb-3">
                          EQUIPMENT USED
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedImage.equipment.map((equip) => (
                            <span
                              key={equip}
                              className="text-sm bg-primary/10 text-primary rounded px-3 py-2 border border-primary/20"
                            >
                              {equip}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        {selectedImage.stats.map((stat) => (
                          <div
                            key={stat.label}
                            className="text-center bg-primary/5 rounded-xl p-3 border border-primary/10"
                          >
                            <div className="text-xs text-primary font-semibold mb-1">
                              {stat.label}
                            </div>
                            <div className="text-lg font-bold text-foreground">
                              {stat.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <motion.button
                    className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm rounded-lg p-2 border border-primary/10 hover:border-primary/30 transition-colors"
                    onClick={() => setSelectedImage(null)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default BehindTheScenes;
