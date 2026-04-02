"use client";

import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EFFECT_DURATION } from "@/constants/config";
import type { EffectProps } from "@/types";

/** ガラポン（抽選機）演出 */
export function Garapon({ targetNumber, onComplete }: EffectProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, EFFECT_DURATION.GARAPON);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Generate stable random-ish ball positions based on targetNumber
  const innerBalls = useMemo(() => {
    const colors = [
      "#e74c3c",
      "#3498db",
      "#2ecc71",
      "#f39c12",
      "#9b59b6",
      "#1abc9c",
      "#e67e22",
      "#ec407a",
      "#26c6da",
      "#66bb6a",
      "#ab47bc",
      "#ff7043",
    ];
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      x: ((i * 37 + 13) % 100) - 50,
      y: ((i * 53 + 7) % 80) - 40,
      size: 14 + (i % 3) * 4,
    }));
  }, []);

  return (
    <div className="flex items-center justify-center h-full overflow-hidden">
      <div className="relative flex flex-col items-center">
        {/* === Machine Body === */}
        <motion.div
          className="relative"
          animate={{
            rotate: [0, -2, 3, -3, 2, -1, 3, -2, 1, 0, 0, 0],
          }}
          transition={{
            duration: 2.4,
            ease: "easeInOut",
            times: [0, 0.08, 0.16, 0.24, 0.32, 0.4, 0.48, 0.56, 0.64, 0.72, 0.85, 1],
          }}
        >
          {/* Top funnel / dome */}
          <div className="relative mx-auto w-48 h-12 rounded-t-full bg-gradient-to-b from-gold to-gold-dark border-2 border-gold-light/50 flex items-center justify-center">
            <div className="w-32 h-3 rounded-full bg-gold-light/40" />
          </div>

          {/* Glass globe */}
          <div className="relative mx-auto w-56 h-56 rounded-full border-4 border-gold/80 bg-navy-light/90 overflow-hidden shadow-[inset_0_0_40px_rgba(10,14,39,0.8),0_0_30px_rgba(212,175,55,0.3)]">
            {/* Glass reflection */}
            <div className="absolute top-4 left-6 w-16 h-24 rounded-full bg-white/5 rotate-[-20deg] blur-sm" />

            {/* Bouncing balls inside the globe */}
            {innerBalls.map((ball) => (
              <motion.div
                key={ball.id}
                className="absolute rounded-full shadow-lg"
                style={{
                  width: ball.size,
                  height: ball.size,
                  backgroundColor: ball.color,
                  left: "50%",
                  top: "50%",
                  boxShadow: `inset -2px -2px 4px rgba(0,0,0,0.3), inset 2px 2px 4px rgba(255,255,255,0.2)`,
                }}
                animate={{
                  x: [ball.x, -ball.x * 0.8, ball.x * 0.6, -ball.x * 1.1, ball.x * 0.4, 0],
                  y: [ball.y, -ball.y * 0.7, ball.y * 0.9, -ball.y * 0.5, ball.y * 1.2, ball.y * 0.3],
                }}
                transition={{
                  duration: 2.0,
                  ease: "easeInOut",
                  repeat: 0,
                  delay: ball.id * 0.03,
                }}
              />
            ))}

            {/* Center axle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gold-dark border-2 border-gold-light/60 shadow-md z-10" />
          </div>

          {/* Handle / crank arm */}
          <motion.div
            className="absolute top-1/2 -right-16 -translate-y-1/2 origin-left"
            animate={{
              rotate: [0, 360, 720],
            }}
            transition={{
              duration: 2.0,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {/* Arm */}
            <div className="w-14 h-3 bg-gradient-to-r from-gold-dark to-gold rounded-r-full shadow-md" />
            {/* Knob */}
            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gradient-to-br from-gold-light to-gold-dark border-2 border-gold shadow-lg" />
          </motion.div>

          {/* Base / pedestal */}
          <div className="relative mx-auto flex flex-col items-center">
            {/* Neck / chute connector */}
            <div className="w-20 h-6 bg-gradient-to-b from-gold-dark to-gold border-x-2 border-gold-light/50" />

            {/* Exit chute */}
            <div className="relative w-32 h-10 bg-gradient-to-b from-gold to-gold-dark rounded-b-2xl border-2 border-t-0 border-gold-light/50 flex items-center justify-center overflow-visible">
              {/* Chute opening */}
              <div className="w-12 h-5 rounded-b-xl bg-navy-light border border-gold/30" />
            </div>
          </div>
        </motion.div>

        {/* === Gold Ball Rolling Out === */}
        <AnimatePresence>
          <motion.div
            className="absolute bottom-[-120px] flex items-center justify-center"
            initial={{ y: -60, x: 0, opacity: 0, scale: 0.3 }}
            animate={{
              y: [null, -30, 0, 10, 0],
              x: [null, 0, 0, 0, 0],
              opacity: [0, 1, 1, 1, 1],
              scale: [0.3, 0.6, 1, 1.1, 1],
            }}
            transition={{
              duration: 1.0,
              delay: 2.2,
              ease: "easeOut",
              times: [0, 0.3, 0.6, 0.8, 1],
            }}
          >
            {/* The gold ball */}
            <motion.div
              className="relative w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(ellipse at 35% 30%, #f5d77a, #d4af37 50%, #b8960c 80%, #8a6d08)",
                boxShadow:
                  "0 8px 32px rgba(212,175,55,0.5), inset 0 -4px 12px rgba(0,0,0,0.3), inset 0 4px 8px rgba(255,255,255,0.3)",
              }}
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 0.8,
                delay: 2.2,
                ease: "easeOut",
              }}
            >
              {/* Ball shine */}
              <div className="absolute top-2 left-3 w-8 h-5 rounded-full bg-white/30 blur-[2px] rotate-[-20deg]" />

              {/* Number reveal inside the ball */}
              <motion.span
                className="relative text-navy text-4xl font-bold font-mono z-10 drop-shadow-[0_1px_2px_rgba(255,255,255,0.3)]"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 3.0,
                  ease: "backOut",
                }}
              >
                {targetNumber}
              </motion.span>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* === Final Big Number Reveal === */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2, duration: 0.3 }}
        >
          {/* Glow backdrop */}
          <motion.div
            className="absolute w-80 h-80 rounded-full bg-gold/15 blur-3xl"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 1.2] }}
            transition={{ delay: 3.2, duration: 0.8, ease: "easeOut" }}
          />

          {/* Big number */}
          <motion.span
            className="relative text-[10rem] font-bold text-gold leading-none font-mono drop-shadow-[0_0_40px_rgba(212,175,55,0.7)]"
            initial={{ scale: 0, opacity: 0, filter: "blur(12px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{
              delay: 3.3,
              duration: 0.5,
              ease: "backOut",
            }}
          >
            {targetNumber}
          </motion.span>
        </motion.div>

        {/* === Celebratory Particles === */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const distance = 120 + (i % 3) * 60;
          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: i % 2 === 0 ? "#d4af37" : "#f5d77a",
                top: "50%",
                left: "50%",
              }}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
              animate={{
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                opacity: [0, 1, 1, 0],
                scale: [0, 1.5, 1, 0],
              }}
              transition={{
                delay: 3.3 + i * 0.03,
                duration: 0.7,
                ease: "easeOut",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
