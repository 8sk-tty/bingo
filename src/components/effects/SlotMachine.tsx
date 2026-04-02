"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EFFECT_DURATION } from "@/constants/config";
import type { EffectProps } from "@/types";

const DURATION = EFFECT_DURATION.SLOT_MACHINE;

/** How many number cells each reel renders while spinning */
const REEL_ITEMS = 20;
/** Height of each number cell in px */
const CELL_HEIGHT = 120;
/** Stagger between each reel stopping (ms) */
const REEL_STOP_STAGGER = 500;
/** Time before any reel stops (ms) – lets them all spin freely first */
const SPIN_PHASE = DURATION * 0.35;
/** Time for the celebration flash at the end (ms) */
const CELEBRATION_PHASE = 600;

function randomNumbers(count: number, exclude?: number): number[] {
  const nums: number[] = [];
  for (let i = 0; i < count; i++) {
    let n: number;
    do {
      n = Math.floor(Math.random() * 75) + 1;
    } while (n === exclude);
    nums.push(n);
  }
  return nums;
}

/* ------------------------------------------------------------------ */
/*  Single Reel                                                       */
/* ------------------------------------------------------------------ */

interface ReelProps {
  targetNumber: number;
  stopDelay: number; // ms after mount before this reel stops
  onStopped: () => void;
}

function Reel({ targetNumber, stopDelay, onStopped }: ReelProps) {
  const [spinning, setSpinning] = useState(true);
  const [numbers, setNumbers] = useState<number[]>(() =>
    randomNumbers(REEL_ITEMS)
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Shuffle visible numbers periodically while spinning
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setNumbers(randomNumbers(REEL_ITEMS));
    }, 80);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Schedule the stop
  useEffect(() => {
    stopTimerRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setSpinning(false);
      onStopped();
    }, stopDelay);

    return () => {
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
    };
  }, [stopDelay, onStopped]);

  return (
    <div className="relative h-[120px] w-[110px] overflow-hidden rounded-lg border-2 border-[#d4af37]/60 bg-[#0d1230]">
      {/* Gradient overlays for depth */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b from-[#0d1230] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t from-[#0d1230] to-transparent" />

      <AnimatePresence mode="wait">
        {spinning ? (
          <motion.div
            key="spinning"
            className="flex flex-col items-center"
            animate={{ y: [0, -CELL_HEIGHT * (REEL_ITEMS / 2)] }}
            transition={{
              y: {
                duration: 0.4,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          >
            {numbers.map((n, i) => (
              <div
                key={`${i}-${n}`}
                className="flex h-[120px] w-full items-center justify-center"
              >
                <span className="text-5xl font-extrabold tabular-nums text-white/70">
                  {n}
                </span>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="stopped"
            className="flex h-full w-full items-center justify-center"
            initial={{ y: -CELL_HEIGHT, opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 18,
              mass: 1.2,
            }}
          >
            <motion.span
              className="text-5xl font-extrabold tabular-nums text-[#d4af37] drop-shadow-[0_0_12px_rgba(212,175,55,0.6)]"
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
            >
              {targetNumber}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Slot Machine (main export)                                        */
/* ------------------------------------------------------------------ */

export function SlotMachine({ targetNumber, onComplete }: EffectProps) {
  const [stoppedCount, setStoppedCount] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const handleReelStopped = useCallback(() => {
    setStoppedCount((prev) => prev + 1);
  }, []);

  // When all 3 reels have stopped, trigger celebration then call onComplete
  useEffect(() => {
    if (stoppedCount < 3) return;

    setCelebrating(true);
    const timer = setTimeout(() => {
      onCompleteRef.current();
    }, CELEBRATION_PHASE);

    return () => clearTimeout(timer);
  }, [stoppedCount]);

  // Safety timeout: always complete even if something goes wrong
  useEffect(() => {
    const timer = setTimeout(() => {
      onCompleteRef.current();
    }, DURATION + 500);
    return () => clearTimeout(timer);
  }, []);

  const reelStopDelays = useMemo(
    () => [
      SPIN_PHASE,
      SPIN_PHASE + REEL_STOP_STAGGER,
      SPIN_PHASE + REEL_STOP_STAGGER * 2,
    ],
    []
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0e27]">
      {/* Starfield / ambient glow background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Radial glow behind the machine */}
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4af37]/5 blur-3xl" />
        {/* Decorative sparkles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-[#d4af37]/40"
            style={{
              left: `${10 + (i * 7.3) % 80}%`,
              top: `${5 + (i * 11.7) % 90}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 1.5 + (i % 3) * 0.4,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center gap-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold tracking-widest text-[#d4af37] uppercase drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
            Slot Machine
          </h2>
        </motion.div>

        {/* Machine frame */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative rounded-2xl border-2 border-[#d4af37]/40 bg-gradient-to-b from-[#111640] to-[#0a0e27] p-6 shadow-[0_0_40px_rgba(212,175,55,0.15)]"
        >
          {/* Corner accents */}
          <div className="absolute -left-1 -top-1 h-4 w-4 rounded-tl-xl border-l-2 border-t-2 border-[#d4af37]" />
          <div className="absolute -right-1 -top-1 h-4 w-4 rounded-tr-xl border-r-2 border-t-2 border-[#d4af37]" />
          <div className="absolute -bottom-1 -left-1 h-4 w-4 rounded-bl-xl border-b-2 border-l-2 border-[#d4af37]" />
          <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-br-xl border-b-2 border-r-2 border-[#d4af37]" />

          {/* Reels container */}
          <div className="flex items-center gap-4">
            {reelStopDelays.map((delay, i) => (
              <Reel
                key={i}
                targetNumber={targetNumber}
                stopDelay={delay}
                onStopped={handleReelStopped}
              />
            ))}
          </div>

          {/* Horizontal indicator line across the reels */}
          <div className="pointer-events-none absolute inset-x-4 top-1/2 -translate-y-1/2">
            <div className="h-[2px] bg-[#d4af37]/30" />
          </div>
        </motion.div>

        {/* Celebration effect */}
        <AnimatePresence>
          {celebrating && (
            <>
              {/* Flash overlay */}
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ duration: 0.5 }}
                style={{
                  background:
                    "radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)",
                }}
              />

              {/* Burst particles */}
              {Array.from({ length: 16 }).map((_, i) => {
                const angle = (i / 16) * 360;
                const rad = (angle * Math.PI) / 180;
                const distance = 120 + Math.random() * 80;
                return (
                  <motion.div
                    key={`particle-${i}`}
                    className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
                    style={{
                      background:
                        i % 3 === 0
                          ? "#d4af37"
                          : i % 3 === 1
                            ? "#fff"
                            : "#f0d060",
                    }}
                    initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    animate={{
                      x: Math.cos(rad) * distance,
                      y: Math.sin(rad) * distance,
                      scale: 0,
                      opacity: 0,
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                );
              })}

              {/* Big number reveal */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 1, 1], scale: [0.5, 1.15, 1] }}
                transition={{ duration: 0.5, times: [0, 0.6, 1] }}
              >
                <span className="text-8xl font-black tabular-nums text-[#d4af37] drop-shadow-[0_0_24px_rgba(212,175,55,0.8)]">
                  {targetNumber}
                </span>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Lever / pull handle decoration */}
        <motion.div
          className="mt-2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="h-8 w-1 rounded-full bg-[#d4af37]/40" />
          <motion.div
            className="h-4 w-4 rounded-full border-2 border-[#d4af37] bg-[#d4af37]/20"
            animate={
              stoppedCount < 3
                ? { y: [0, -4, 0] }
                : {}
            }
            transition={{
              duration: 0.6,
              repeat: Infinity,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
