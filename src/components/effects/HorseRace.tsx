"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { EFFECT_DURATION } from "@/constants/config";
import type { EffectProps } from "@/types";

const HORSE_COUNT = 5;

const TRACK_COLORS = [
  "bg-emerald-900/40",
  "bg-emerald-800/25",
  "bg-emerald-900/40",
  "bg-emerald-800/25",
  "bg-emerald-900/40",
];

const HORSE_COLORS = [
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#a855f7",
  "#f97316",
];

const SPARKLE_COUNT = 16;

const SPARKLE_COLORS = [
  "#d4af37",
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#f97316",
  "#ec4899",
];

interface SparkleData {
  angle: number;
  dist: number;
  colorIndex: number;
}

function generateSparkles(): SparkleData[] {
  return Array.from({ length: SPARKLE_COUNT }, (_, i) => ({
    angle: (i / SPARKLE_COUNT) * Math.PI * 2,
    dist: 80 + Math.random() * 120,
    colorIndex: i % SPARKLE_COLORS.length,
  }));
}

/**
 * Build an array of HORSE_COUNT numbers where the targetNumber
 * is placed at a random lane index. The remaining lanes get
 * unique random numbers in 1-75.
 */
function generateLaneNumbers(targetNumber: number): number[] {
  const numbers: number[] = [];
  const used = new Set<number>([targetNumber]);

  while (numbers.length < HORSE_COUNT - 1) {
    const n = Math.floor(Math.random() * 75) + 1;
    if (!used.has(n)) {
      used.add(n);
      numbers.push(n);
    }
  }

  const winnerLane = Math.floor(Math.random() * HORSE_COUNT);
  numbers.splice(winnerLane, 0, targetNumber);
  return numbers;
}

/**
 * Pre-compute random loser durations so they stay stable across renders.
 * Returns an array of durations (seconds) for each lane.
 */
function generateDurations(
  targetNumber: number,
  laneNumbers: number[],
  totalMs: number,
): number[] {
  const winnerSec = (totalMs * 0.65) / 1000;
  return laneNumbers.map((num) => {
    if (num === targetNumber) return winnerSec;
    // Losers finish between 78-92% of total duration
    return (totalMs * (0.78 + Math.random() * 0.14)) / 1000;
  });
}

export function HorseRace({ targetNumber, onComplete }: EffectProps) {
  const duration = EFFECT_DURATION.HORSE_RACE;

  const laneNumbers = useMemo(
    () => generateLaneNumbers(targetNumber),
    [targetNumber],
  );

  const laneDurations = useMemo(
    () => generateDurations(targetNumber, laneNumbers, duration),
    [targetNumber, laneNumbers, duration],
  );

  const sparkles = useMemo(() => generateSparkles(), []);

  const winnerDurationSec = laneDurations[laneNumbers.indexOf(targetNumber)];

  useEffect(() => {
    const timer = setTimeout(onComplete, duration);
    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden bg-[#0a0e27]">
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 80% 50%, rgba(212,175,55,0.06) 0%, transparent 60%)",
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-6 text-center z-10"
      >
        <motion.h2
          className="text-5xl font-extrabold tracking-widest text-[#d4af37]"
          style={{
            textShadow: "0 0 30px rgba(212,175,55,0.5)",
          }}
          animate={{
            textShadow: [
              "0 0 20px rgba(212,175,55,0.3)",
              "0 0 40px rgba(212,175,55,0.7)",
              "0 0 20px rgba(212,175,55,0.3)",
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          DERBY TIME
        </motion.h2>
      </motion.div>

      {/* Race track area */}
      <div className="relative w-[90%] max-w-5xl z-10">
        {/* Finish line - checkerboard pattern */}
        <div className="absolute right-[8%] top-0 bottom-0 w-3 z-20 flex flex-col">
          {[...Array(20)].map((_, row) => (
            <div key={row} className="flex flex-1">
              <div
                className={`flex-1 ${row % 2 === 0 ? "bg-white" : "bg-black"}`}
              />
              <div
                className={`flex-1 ${row % 2 === 0 ? "bg-black" : "bg-white"}`}
              />
            </div>
          ))}
        </div>

        {/* Finish flag */}
        <motion.div
          className="absolute z-30 text-4xl"
          style={{ right: "6%", top: "-2.5rem" }}
          animate={{ rotate: [0, 12, -12, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        >
          🏁
        </motion.div>

        {/* Start line */}
        <div className="absolute left-[10%] top-0 bottom-0 w-0.5 bg-white/20 z-10" />

        {/* Lanes */}
        {laneNumbers.map((num, i) => {
          const isWinner = num === targetNumber;
          const horseDuration = laneDurations[i];

          return (
            <div
              key={i}
              className={`relative h-[4.5rem] ${TRACK_COLORS[i]} border-b border-white/10 first:rounded-t-xl last:rounded-b-xl last:border-b-0 overflow-hidden`}
            >
              {/* Lane number */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-7 h-7 rounded-full bg-white/10 text-white/50 text-xs font-bold">
                {i + 1}
              </div>

              {/* Track dashes (dirt markings) */}
              <div className="absolute inset-0 flex items-center">
                {[...Array(20)].map((_, d) => (
                  <div
                    key={d}
                    className="h-px bg-white/5 flex-1 mx-1"
                  />
                ))}
              </div>

              {/* Horse container -- animates from left:10% to left:80% */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10"
                initial={{ left: "10%" }}
                animate={{ left: "80%" }}
                transition={{
                  duration: horseDuration,
                  ease: [0.4, 0.0, 0.2, 1],
                }}
              >
                {/* Number plate */}
                <motion.div
                  className="flex items-center justify-center min-w-[2.75rem] h-9 rounded-lg px-2.5 text-white font-black text-xl shadow-lg border border-white/20"
                  style={{
                    backgroundColor: HORSE_COLORS[i],
                    boxShadow: isWinner
                      ? `0 0 15px ${HORSE_COLORS[i]}80`
                      : `0 2px 8px ${HORSE_COLORS[i]}40`,
                  }}
                  animate={
                    isWinner
                      ? { boxShadow: [
                            `0 0 10px ${HORSE_COLORS[i]}60`,
                            `0 0 25px ${HORSE_COLORS[i]}90`,
                            `0 0 10px ${HORSE_COLORS[i]}60`,
                          ]}
                      : {}
                  }
                  transition={isWinner ? { duration: 0.6, repeat: Infinity } : {}}
                >
                  {num}
                </motion.div>

                {/* Horse emoji with bobbing animation */}
                <motion.span
                  className="text-4xl leading-none select-none"
                  animate={{ y: [0, -3, 0, -2, 0] }}
                  transition={{
                    duration: 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  🏇
                </motion.span>
              </motion.div>

              {/* Dust cloud behind horse */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 z-[5]"
                initial={{ left: "10%" }}
                animate={{ left: "78%" }}
                transition={{
                  duration: horseDuration,
                  ease: [0.4, 0.0, 0.2, 1],
                }}
              >
                {[...Array(4)].map((_, j) => (
                  <motion.div
                    key={j}
                    className="absolute rounded-full bg-amber-100/20"
                    style={{
                      width: 6 + j * 2,
                      height: 6 + j * 2,
                      top: -3 + (j % 2 === 0 ? -4 : 4),
                    }}
                    animate={{
                      x: [0, -15 - j * 12],
                      opacity: [0.4, 0],
                      scale: [0.8, 1.5],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: j * 0.12,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Winner announcement */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          delay: winnerDurationSec + 0.3,
          duration: 0.6,
          ease: "backOut",
        }}
        className="mt-8 text-center z-10"
      >
        <motion.p
          className="text-3xl font-bold text-[#d4af37] mb-2 tracking-wide"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{
            delay: winnerDurationSec + 0.5,
            duration: 0.8,
            repeat: Infinity,
          }}
        >
          WINNER!
        </motion.p>
        <motion.p
          className="text-9xl font-black text-[#d4af37] font-mono leading-none"
          style={{
            textShadow: "0 0 40px rgba(212,175,55,0.6)",
          }}
          animate={{
            textShadow: [
              "0 0 30px rgba(212,175,55,0.4)",
              "0 0 60px rgba(212,175,55,0.9)",
              "0 0 30px rgba(212,175,55,0.4)",
            ],
          }}
          transition={{
            delay: winnerDurationSec + 0.5,
            duration: 1.2,
            repeat: Infinity,
          }}
        >
          {targetNumber}
        </motion.p>
      </motion.div>

      {/* Victory sparkles / confetti burst */}
      {sparkles.map((s, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-2.5 h-2.5 rounded-full z-20"
          style={{
            backgroundColor: SPARKLE_COLORS[s.colorIndex],
            left: "50%",
            bottom: "18%",
          }}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1.2, 1, 0.5],
            x: Math.cos(s.angle) * s.dist,
            y: Math.sin(s.angle) * s.dist - 40,
          }}
          transition={{
            delay: winnerDurationSec + 0.4 + i * 0.04,
            duration: 1,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
