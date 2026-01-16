import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { useTheme } from "next-themes"; // If you use theme provider, otherwise ignore
import { motion } from "framer-motion";

// --- 1. The Floating Particles ---
function ParticleField(props: any) {
  const ref = useRef<any>();

  // Generate 2000 random points inside a sphere
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(3000), { radius: 1.5 })
  );

  useFrame((state, delta) => {
    if (!ref.current) return;

    // Rotate the entire galaxy of particles slowly
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;

    // Optional: Make them "breathe" or pulse based on mouse
    // const time = state.clock.getElapsedTime();
    // ref.current.position.y = Math.sin(time / 4) * 0.1;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={sphere}
        stride={3}
        frustumCulled={false}
        {...props}
      >
        <PointMaterial
          transparent
          color="#FFD700" // Gold Accent
          size={0.002} // Very fine dust
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
}

// --- 2. Interactive Mouse Light ---
function MouseLight() {
  const lightRef = useRef<any>();

  useFrame(({ mouse, viewport }) => {
    if (!lightRef.current) return;
    // Convert 2D mouse (0..1) to 3D Viewport coordinates
    const x = (mouse.x * viewport.width) / 2;
    const y = (mouse.y * viewport.height) / 2;

    // Smooth lerp could be added here, but direct mapping is snappier for lights
    lightRef.current.position.set(x, y, 0);
  });

  return (
    <pointLight ref={lightRef} distance={2} intensity={2} color="#ffffff" />
  );
}

// --- 3. Main Composition ---
const CinematicBackground = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="fixed inset-0 z-[-1] w-full h-full bg-[#0a0a0a]" // Fallback color
    >
      <Canvas camera={{ position: [0, 0, 1] }}>
        {/* Atmosphere */}
        <ambientLight intensity={0.1} />

        {/* The Particles */}
        <ParticleField />

        {/* Interactive Element */}
        <MouseLight />
      </Canvas>

      {/* --- Cinematic Overlays (CSS) --- */}

      {/* 1. Vignette: Darkens the corners to focus attention */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />

      {/* 2. Noise/Film Grain: Adds texture to prevent 'digital' look */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 3. Gradient Wash: Subtle gold tint at the bottom */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-black opacity-80" />
    </motion.div>
  );
};

export default CinematicBackground;
