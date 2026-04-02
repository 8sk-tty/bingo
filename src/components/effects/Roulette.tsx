"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { EFFECT_DURATION } from "@/constants/config";
import type { EffectProps } from "@/types";

const SEGMENT_COUNT = 12;
const WHEEL_SIZE = 340;
const INNER_RADIUS = 60;

/** Classic roulette red/black alternation, with gold reserved for the winner. */
const SEGMENT_COLORS = [
  "#c0392b",
  "#1a1a2e",
  "#c0392b",
  "#1a1a2e",
  "#c0392b",
  "#1a1a2e",
  "#c0392b",
  "#1a1a2e",
  "#c0392b",
  "#1a1a2e",
  "#c0392b",
  "#1a1a2e",
];

function generateWheelNumbers(target: number): number[] {
  const nums = new Set<number>([target]);
  while (nums.size < SEGMENT_COUNT) {
    const n = Math.floor(Math.random() * 75) + 1;
    nums.add(n);
  }
  const arr = Array.from(nums);
  // Place target at a random position among the 12 slots
  const targetIdx = arr.indexOf(target);
  const placementIdx = Math.floor(Math.random() * SEGMENT_COUNT);
  [arr[targetIdx], arr[placementIdx]] = [arr[placementIdx], arr[targetIdx]];
  return arr;
}

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

export function Roulette({ targetNumber, onComplete }: EffectProps) {
  const controls = useAnimation();
  const hasCompleted = useRef(false);
  const duration = EFFECT_DURATION.ROULETTE / 1000; // seconds

  const wheelNumbers = useMemo(
    () => generateWheelNumbers(targetNumber),
    [targetNumber],
  );

  const targetIndex = wheelNumbers.indexOf(targetNumber);
  const segmentAngle = 360 / SEGMENT_COUNT;

  // The wheel needs to stop so that the target segment is aligned to the
  // pointer at the top (0 degrees). Each segment's center is at
  // segmentAngle * index + segmentAngle / 2. We rotate the wheel so that
  // center ends up at 0 (top). We add multiple full rotations for drama.
  const targetSegmentCenter = segmentAngle * targetIndex + segmentAngle / 2;
  const extraSpins = 360 * 5; // 5 full spins
  const finalRotation = extraSpins + (360 - targetSegmentCenter);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    void controls.start({
      rotate: finalRotation,
      transition: {
        duration: duration * 0.85,
        ease: [0.15, 0.6, 0.25, 1], // custom deceleration curve
      },
    });

    timeout = setTimeout(() => {
      if (!hasCompleted.current) {
        hasCompleted.current = true;
        onComplete();
      }
    }, EFFECT_DURATION.ROULETTE);

    return () => {
      clearTimeout(timeout);
    };
  }, [controls, finalRotation, duration, onComplete]);

  const half = WHEEL_SIZE / 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0e27]">
      {/* Ambient glow behind the wheel */}
      <div className="absolute h-[500px] w-[500px] rounded-full bg-[#d4af37]/10 blur-3xl" />

      {/* Title */}
      <motion.p
        className="absolute top-8 text-2xl font-bold tracking-widest text-[#d4af37] uppercase"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Roulette
      </motion.p>

      {/* Pointer / Arrow at top */}
      <div className="absolute z-20" style={{ top: `calc(50% - ${half + 28}px)` }}>
        <svg width="32" height="36" viewBox="0 0 32 36">
          <polygon
            points="16,36 0,0 32,0"
            fill="#d4af37"
            stroke="#fff"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Outer decorative ring */}
      <div
        className="absolute rounded-full border-4 border-[#d4af37]/60"
        style={{
          width: WHEEL_SIZE + 24,
          height: WHEEL_SIZE + 24,
        }}
      />

      {/* Spinning wheel */}
      <motion.div
        className="relative z-10"
        style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}
        animate={controls}
        initial={{ rotate: 0 }}
      >
        <svg
          width={WHEEL_SIZE}
          height={WHEEL_SIZE}
          viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
        >
          {/* Outer ring glow */}
          <circle
            cx={half}
            cy={half}
            r={half - 2}
            fill="none"
            stroke="#d4af37"
            strokeWidth="3"
            opacity="0.5"
          />

          {wheelNumbers.map((num, i) => {
            const startAngle = segmentAngle * i;
            const endAngle = startAngle + segmentAngle;
            const isTarget = num === targetNumber;
            const midAngle = startAngle + segmentAngle / 2;
            const textR = half * 0.68;
            const textPos = polarToCartesian(half, half, textR, midAngle);

            return (
              <g key={i}>
                {/* Segment */}
                <path
                  d={describeArc(half, half, half - 4, startAngle, endAngle)}
                  fill={SEGMENT_COLORS[i]}
                  stroke="#d4af37"
                  strokeWidth="1"
                  opacity={0.9}
                />

                {/* Number label */}
                <text
                  x={textPos.x}
                  y={textPos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isTarget ? "#d4af37" : "#ffffff"}
                  fontSize="18"
                  fontWeight="bold"
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
                >
                  {num}
                </text>
              </g>
            );
          })}

          {/* Center hub */}
          <circle
            cx={half}
            cy={half}
            r={INNER_RADIUS}
            fill="#0a0e27"
            stroke="#d4af37"
            strokeWidth="3"
          />
          <circle
            cx={half}
            cy={half}
            r={INNER_RADIUS - 10}
            fill="#111535"
            stroke="#d4af37"
            strokeWidth="1.5"
          />

          {/* Decorative dots around center */}
          {Array.from({ length: 8 }).map((_, i) => {
            const dotAngle = (360 / 8) * i;
            const dotPos = polarToCartesian(half, half, INNER_RADIUS - 24, dotAngle);
            return (
              <circle
                key={`dot-${i}`}
                cx={dotPos.x}
                cy={dotPos.y}
                r={3}
                fill="#d4af37"
                opacity={0.7}
              />
            );
          })}
        </svg>
      </motion.div>

      {/* Winning number reveal overlay */}
      <motion.div
        className="absolute z-30 flex flex-col items-center gap-3"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: duration * 0.85 + 0.2,
          duration: 0.5,
          ease: "easeOut",
        }}
      >
        <motion.div
          className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#d4af37] bg-[#0a0e27]/95 shadow-[0_0_40px_rgba(212,175,55,0.5)]"
          animate={{
            boxShadow: [
              "0 0 40px rgba(212,175,55,0.5)",
              "0 0 80px rgba(212,175,55,0.8)",
              "0 0 40px rgba(212,175,55,0.5)",
            ],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span className="text-5xl font-black text-[#d4af37]">
            {targetNumber}
          </span>
        </motion.div>
      </motion.div>

      {/* Sparkle particles that appear on reveal */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (360 / 16) * i;
        const distance = 180 + Math.random() * 60;
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * distance;
        const y = Math.sin(rad) * distance;
        return (
          <motion.div
            key={`spark-${i}`}
            className="absolute z-20 h-2 w-2 rounded-full bg-[#d4af37]"
            initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], x, y, scale: [0, 1.5, 0] }}
            transition={{
              delay: duration * 0.85 + 0.1 + i * 0.03,
              duration: 0.8,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}
