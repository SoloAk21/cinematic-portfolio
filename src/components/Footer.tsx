// src/components/Footer.tsx
"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Mail, ArrowUp, Heart } from "lucide-react";

const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [currentYear] = useState(new Date().getFullYear());

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <footer className="relative bg-background border-t border-primary/10">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="py-16"
        >
          {/* Main Content */}
          <div className="flex flex-col items-center text-center space-y-8 mb-12">
            {/* Brand */}
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-light text-foreground mb-2">
                Nigus Dawit
              </h3>
              <p className="text-muted-foreground font-light">
                Cinematographer & Video Editor
              </p>
            </motion.div>

            {/* Contact */}
            <motion.div variants={itemVariants}>
              <a
                href="mailto:hello@nigusdawit.com"
                className="text-foreground hover:text-primary transition-colors text-lg font-light flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                kingdav818@gmail.com
              </a>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            variants={itemVariants}
            className="border-t border-primary/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
          >
            {/* Copyright */}
            <div className="flex items-center gap-2 text-muted-foreground font-light">
              <span>© {currentYear} Nigus Dawit</span>
              <Heart className="w-4 h-4 text-primary fill-primary" />
            </div>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-lg border border-primary/20 hover:border-primary/40 flex items-center justify-center transition-colors"
            >
              <ArrowUp className="w-4 h-4 text-primary" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
