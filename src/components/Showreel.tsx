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
  Play,
  X,
  Clock,
  Image as ImageIcon,
  Eye,
  FileText,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Replace these imports with your actual image paths
import project1 from "@/assets/project1.jpg";
import project2 from "@/assets/project2.jpeg";
import project3 from "@/assets/project3.jpeg";
import project4 from "@/assets/project4.png";

interface Project {
  id: number;
  title: string;
  category: string;
  image: any;
  description: string;
  videoUrl: string;
  videoPlatform?: "youtube" | "tiktok" | "none";
  pdfUrl?: string;
  duration?: string;
  tags: string[];
}

const categories = [
  "All",
  "Commercial",
  "Documentary",
  "Promotional",
  // "Graphic Design",
];

const projects: Project[] = [
  {
    id: 1,
    title: "Company Profile",
    category: "Documentary",
    image: project1,
    description:
      "36 years of craftsmanship, comfort, and timeless furniture design built for homes, offices, and generations.",
    videoUrl: "https://www.youtube.com/embed/LTiIC6xnKy4",
    videoPlatform: "youtube",
    duration: "3:26",
    tags: ["Company Profile", "Brand Story", "36 Years"],
  },

  {
    id: 2,
    title: "Generations of Comfort",
    category: "Commercial",
    image: project2,
    description:
      "Furniture becomes the backdrop for cherished family memories, honoring 30 years of comfort.",
    videoUrl: "https://www.youtube.com/embed/KUYCEMLSqYg",
    videoPlatform: "youtube",
    pdfUrl: "/generations-proposal.pdf",
    duration: "1:30",
    tags: ["Storytelling", "Family", "Legacy"],
  },

  {
    id: 3,
    title: "Daily Water Giveaway",
    category: "Promotional",
    image: project3,
    description:
      "Exciting moments from Daily Water’s giveaway event, celebrating and rewarding our customers.",
    videoUrl: "https://www.youtube.com/embed/k1dxutyil98",
    videoPlatform: "youtube",
    duration: "1:00",
    tags: ["Daily Water", "Giveaway", "Promotion", "Event Highlights"],
  },

  // Example TikTok project – REPLACE videoUrl with real embed URL
  {
    id: 4,
    title: "Showroom Showcase",
    category: "Commercial",
    image: project4,
    description:
      "A quick tour of our showroom, highlighting featured furniture pieces.",
    videoUrl: "https://www.tiktok.com/embed/v2/7496900746877717766",
    videoPlatform: "tiktok",
    duration: "0:45",
    tags: ["TikTok", "Showroom", "Furniture", "Brand Experience"],
  },

  // You can add more TikTok videos the same way
  // {
  //   id: 5,
  //   title: "Another TikTok Clip",
  //   category: "Commercial",
  //   image: project2,
  //   description: "...",
  //   videoUrl: "https://www.tiktok.com/embed/v2/ANOTHER_VIDEO_ID",
  //   videoPlatform: "tiktok",
  //   duration: "0:32",
  //   tags: ["TikTok", "Promotion"],
  // },
];

const Showreel = () => {
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

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY],
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
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
      id="showreel"
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
        style={{ background: dynamicGradient }}
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
            className="text-xs font-light text-primary/80 tracking-[0.2em] uppercase mb-4"
            variants={itemVariants}
          >
            Selected Works
          </motion.div>

          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6"
            variants={itemVariants}
          >
            <span className="block bg-gradient-to-b from-white to-white/90 bg-clip-text text-transparent">
              VISUAL
            </span>
            <span className="block bg-gradient-to-br from-primary to-yellow-600 bg-clip-text text-transparent mt-2">
              PORTFOLIO
            </span>
          </motion.h2>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variants={itemVariants}
              className={`px-4 py-2 text-xs md:text-sm rounded-full font-medium transition-all duration-200 border ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background/50 text-muted-foreground border-primary/10 hover:border-primary/30"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          key={selectedCategory}
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              custom={index}
              className="group relative cursor-pointer"
              onClick={() => setSelectedProject(project)}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative overflow-hidden rounded-xl bg-background/50 backdrop-blur-sm border border-primary/10 group-hover:border-primary/30 transition-all duration-300">
                <div className="relative aspect-video overflow-hidden">
                  <motion.img
                    src={project.image.src || project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-black/60 backdrop-blur-md rounded px-2 py-1 text-[10px] uppercase tracking-wider font-medium text-white border border-white/10">
                      {project.category}
                    </span>
                  </div>

                  {/* Duration (Only for videos) */}
                  {project.category !== "Graphic Design" &&
                    project.duration && (
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded px-2 py-1 border border-white/10">
                          <Clock className="h-3 w-3 text-white/80" />
                          <span className="text-[10px] text-white/90 font-medium">
                            {project.duration}
                          </span>
                        </div>
                      </div>
                    )}

                  {/* Center Icon */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-lg border border-white/20 backdrop-blur-sm">
                      {project.category === "Graphic Design" ? (
                        <Eye className="w-5 h-5 text-primary-foreground" />
                      ) : (
                        <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                      )}
                    </div>
                  </motion.div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-primary/5 text-primary/80 rounded px-2 py-0.5 border border-primary/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Modal / Dialog */}
      <Dialog
        open={!!selectedProject}
        onOpenChange={() => setSelectedProject(null)}
      >
        <DialogContent className="max-w-4xl p-0 bg-background border-primary/20 rounded-lg overflow-hidden">
          <AnimatePresence>
            {selectedProject && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative"
              >
                <div className="relative aspect-video bg-black flex items-center justify-center">
                  {selectedProject.category === "Graphic Design" ? (
                    // Image Display
                    <img
                      src={selectedProject.image.src || selectedProject.image}
                      alt={selectedProject.title}
                      className="h-full w-auto object-contain max-h-[80vh]"
                    />
                  ) : selectedProject.videoPlatform === "youtube" ? (
                    // YouTube
                    <iframe
                      width="100%"
                      height="100%"
                      src={selectedProject.videoUrl}
                      title={selectedProject.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-t-lg"
                    />
                  ) : selectedProject.videoPlatform === "tiktok" ? (
                    // TikTok
                    <iframe
                      width="100%"
                      height="100%"
                      src={selectedProject.videoUrl}
                      title={selectedProject.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-t-lg"
                    />
                  ) : (
                    // Fallback
                    <div className="text-white flex items-center justify-center h-full">
                      No video available
                    </div>
                  )}
                </div>

                <div className="p-6 flex items-start justify-between gap-4">
                  <div className="space-y-2 w-full">
                    <h3 className="text-2xl font-bold text-foreground">
                      {selectedProject.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {selectedProject.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {selectedProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-primary/10 text-primary rounded px-2 py-1 border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {selectedProject.pdfUrl && (
                      <div className="pt-4">
                        <a
                          href={selectedProject.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-sm font-medium transition-all group"
                        >
                          <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          View Production Proposal
                        </a>
                      </div>
                    )}
                  </div>

                  <motion.button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 rounded-full bg-background/50 border border-primary/10 hover:bg-primary/10 transition-colors shrink-0"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Showreel;
