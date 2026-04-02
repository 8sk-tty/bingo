"use client";

import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EffectProps } from "@/types";
import { EFFECT_DURATION } from "@/constants/config";

const SPARKLE_COUNT = 12;
const COIN_PARTICLE_COUNT = 8;

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  angle: number;
}

interface CoinParticle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  delay: number;
}

export function MarioBlock({ targetNumber, onComplete }: EffectProps) {
  const duration = EFFECT_DURATION.MARIO_BLOCK;

  // Pre-compute sparkle positions so they are stable across renders
  const sparkles: Sparkle[] = useMemo(
    () =>
      Array.from({ length: SPARKLE_COUNT }, (_, i) => ({
        id: i,
        x: (i / SPARKLE_COUNT) * 360,
        y: Math.sin(i * 1.8) * 40,
        size: 4 + (i % 3) * 4,
        delay: 1.8 + i * 0.06,
        duration: 0.4 + (i % 4) * 0.15,
        angle: (i / SPARKLE_COUNT) * 360,
      })),
    [],
  );

  const coinParticles: CoinParticle[] = useMemo(
    () =>
      Array.from({ length: COIN_PARTICLE_COUNT }, (_, i) => ({
        id: i,
        angle: (i / COIN_PARTICLE_COUNT) * 360,
        distance: 60 + (i % 3) * 30,
        size: 3 + (i % 3) * 2,
        delay: 1.6 + i * 0.04,
      })),
    [],
  );

  useEffect(() => {
    const timer = setTimeout(onComplete, duration);
    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0e27]">
      {/* Starfield background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }, (_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: 1 + (i % 3),
              height: 1 + (i % 3),
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{
              duration: 1.5 + (i % 3),
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>

      {/* Ground bricks */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-wrap">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={`brick-${i}`}
            className="h-10 border border-[#1a1a3a] bg-[#12163a]"
            style={{ width: "5%" }}
          />
        ))}
      </div>

      {/* Main animation container */}
      <div className="relative flex flex-col items-center">
        {/* Coin that pops out of the block */}
        <motion.div
          className="absolute flex items-center justify-center"
          initial={{ y: 0, opacity: 0, scale: 0.3 }}
          animate={{
            y: [0, -180, -200, -160],
            opacity: [0, 1, 1, 1],
            scale: [0.3, 1.2, 1, 1],
            rotateY: [0, 720, 1080, 1080],
          }}
          transition={{
            duration: 1.0,
            delay: 0.8,
            times: [0, 0.5, 0.8, 1],
            ease: "easeOut",
          }}
        >
          {/* Coin body */}
          <div className="relative flex h-20 w-20 items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 35% 35%, #ffd700, #d4af37 50%, #b8960c)",
                boxShadow:
                  "0 0 30px rgba(212, 175, 55, 0.6), inset 0 -3px 6px rgba(0,0,0,0.3), inset 0 3px 6px rgba(255,255,255,0.3)",
              }}
            />
            <motion.div
              className="absolute inset-[3px] rounded-full border-2 border-[#ffd70088]"
              style={{
                background:
                  "radial-gradient(circle at 40% 40%, transparent 30%, rgba(255,215,0,0.2))",
              }}
            />
          </div>
        </motion.div>

        {/* Number reveal - replaces coin */}
        <AnimatePresence>
          <motion.div
            className="absolute flex items-center justify-center"
            initial={{ y: -160, opacity: 0, scale: 0.5 }}
            animate={{
              y: -180,
              opacity: 1,
              scale: [0.5, 1.4, 1.2],
            }}
            transition={{
              delay: 1.8,
              duration: 0.6,
              ease: "easeOut",
            }}
          >
            <motion.span
              className="relative text-8xl font-black tabular-nums tracking-tight"
              style={{
                color: "#d4af37",
                textShadow:
                  "0 0 40px rgba(212, 175, 55, 0.8), 0 0 80px rgba(212, 175, 55, 0.4), 0 4px 8px rgba(0,0,0,0.5)",
                WebkitTextStroke: "1px rgba(255, 215, 0, 0.3)",
              }}
              animate={{
                textShadow: [
                  "0 0 40px rgba(212, 175, 55, 0.8), 0 0 80px rgba(212, 175, 55, 0.4), 0 4px 8px rgba(0,0,0,0.5)",
                  "0 0 60px rgba(212, 175, 55, 1), 0 0 120px rgba(212, 175, 55, 0.6), 0 4px 8px rgba(0,0,0,0.5)",
                  "0 0 40px rgba(212, 175, 55, 0.8), 0 0 80px rgba(212, 175, 55, 0.4), 0 4px 8px rgba(0,0,0,0.5)",
                ],
              }}
              transition={{
                delay: 2.0,
                duration: 1.0,
                repeat: Infinity,
              }}
            >
              {targetNumber}
            </motion.span>
          </motion.div>
        </AnimatePresence>

        {/* Sparkle ring around number */}
        {sparkles.map((sparkle) => {
          const rad = (sparkle.angle * Math.PI) / 180;
          const radius = 80;
          return (
            <motion.div
              key={`sparkle-${sparkle.id}`}
              className="absolute rounded-full"
              style={{
                width: sparkle.size,
                height: sparkle.size,
                background:
                  sparkle.id % 3 === 0
                    ? "#ffd700"
                    : sparkle.id % 3 === 1
                      ? "#ffffff"
                      : "#d4af37",
                boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.id % 3 === 0 ? "#ffd700" : "#ffffff"}`,
              }}
              initial={{ opacity: 0, scale: 0, x: 0, y: -180 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1.5, 1, 0],
                x: Math.cos(rad) * radius,
                y: -180 + Math.sin(rad) * radius,
              }}
              transition={{
                delay: sparkle.delay,
                duration: sparkle.duration,
                ease: "easeOut",
              }}
            />
          );
        })}

        {/* Coin burst particles */}
        {coinParticles.map((particle) => {
          const rad = (particle.angle * Math.PI) / 180;
          return (
            <motion.div
              key={`particle-${particle.id}`}
              className="absolute rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                background:
                  "radial-gradient(circle, #ffd700, #d4af37)",
                boxShadow: "0 0 6px #ffd700",
              }}
              initial={{ opacity: 0, x: 0, y: -160 }}
              animate={{
                opacity: [0, 1, 0],
                x: Math.cos(rad) * particle.distance,
                y: -160 + Math.sin(rad) * particle.distance,
                scale: [0, 1, 0],
              }}
              transition={{
                delay: particle.delay,
                duration: 0.6,
                ease: "easeOut",
              }}
            />
          );
        })}

        {/* Question mark block */}
        <motion.div
          className="relative flex h-28 w-28 items-center justify-center"
          initial={{ y: 0 }}
          animate={{
            y: [0, 0, -30, 0, -4, 0],
          }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            times: [0, 0.1, 0.35, 0.6, 0.8, 1],
            ease: "easeInOut",
          }}
        >
          {/* Block outer shell */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background:
                "linear-gradient(135deg, #c8941e 0%, #a06e0a 40%, #8b5e0a 100%)",
              boxShadow:
                "0 4px 0 #6b4a08, 0 -4px 0 #e8b830, 4px 0 0 #8b5e0a, -4px 0 0 #e8b830, 0 8px 20px rgba(0,0,0,0.5)",
            }}
          />

          {/* Block inner border */}
          <div
            className="absolute inset-[6px] rounded-md"
            style={{
              background:
                "linear-gradient(135deg, #e8b830 0%, #c8941e 50%, #a06e0a 100%)",
              boxShadow:
                "inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.3)",
            }}
          />

          {/* Corner rivets */}
          {[
            { top: 10, left: 10 },
            { top: 10, right: 10 },
            { bottom: 10, left: 10 },
            { bottom: 10, right: 10 },
          ].map((pos, i) => (
            <div
              key={`rivet-${i}`}
              className="absolute h-3 w-3 rounded-full"
              style={{
                ...pos,
                background:
                  "radial-gradient(circle at 40% 40%, #ffd700, #8b5e0a)",
                boxShadow: "inset 0 1px 2px rgba(255,255,255,0.4)",
              }}
            />
          ))}

          {/* Question mark */}
          <motion.span
            className="relative z-10 text-5xl font-black"
            style={{
              color: "#0a0e27",
              textShadow:
                "0 2px 0 rgba(255,215,0,0.3), 0 -1px 0 rgba(0,0,0,0.5)",
            }}
            animate={{
              opacity: [1, 1, 1, 0.3],
            }}
            transition={{
              duration: 1.2,
              delay: 0.8,
              times: [0, 0.5, 0.8, 1],
            }}
          >
            ?
          </motion.span>
        </motion.div>

        {/* Hit impact flash */}
        <motion.div
          className="pointer-events-none absolute"
          style={{
            width: 160,
            height: 160,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,215,0,0.6) 0%, transparent 70%)",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 2],
          }}
          transition={{
            delay: 0.5,
            duration: 0.4,
            ease: "easeOut",
          }}
        />

        {/* Block debris particles on hit */}
        {Array.from({ length: 6 }, (_, i) => {
          const angle = ((i / 6) * Math.PI - Math.PI) * 0.8 - 0.3;
          return (
            <motion.div
              key={`debris-${i}`}
              className="absolute rounded-sm"
              style={{
                width: 6 + (i % 3) * 2,
                height: 6 + (i % 3) * 2,
                background: i % 2 === 0 ? "#c8941e" : "#e8b830",
              }}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                x: Math.cos(angle) * (40 + i * 10),
                y: [0, Math.sin(angle) * 50 - 30, 60],
              }}
              transition={{
                delay: 0.5,
                duration: 0.7,
                ease: "easeOut",
              }}
            />
          );
        })}
      </div>

      {/* Radial glow pulse behind everything at reveal */}
      <motion.div
        className="pointer-events-none absolute"
        style={{
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 40%, transparent 70%)",
        }}
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{
          opacity: [0, 0.8, 0.4],
          scale: [0.3, 1.2, 1],
        }}
        transition={{
          delay: 1.8,
          duration: 0.8,
          ease: "easeOut",
        }}
      />
    </div>
  );
}
