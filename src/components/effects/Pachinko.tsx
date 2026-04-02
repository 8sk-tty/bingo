"use client";

import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EFFECT_DURATION } from "@/constants/config";
import type { EffectProps } from "@/types";

/** パチンコ風の演出コンポーネント */
export function Pachinko({ targetNumber, onComplete }: EffectProps) {
  const duration = EFFECT_DURATION.PACHINKO;

  // タイミング定数（ミリ秒ベースのdurationから秒に変換して各フェーズを配分）
  const totalSec = duration / 1000;
  const ballDropDuration = totalSec * 0.5; // ボール落下に50%
  const jackpotDelay = totalSec * 0.55; // 大当たりテキスト表示
  const numberDelay = totalSec * 0.7; // 数字表示

  useEffect(() => {
    const timer = setTimeout(onComplete, duration);
    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  // ピン配列を生成（三角形パターン）
  const pins = useMemo(() => {
    const result: { x: number; y: number; row: number }[] = [];
    const rows = 8;
    for (let row = 0; row < rows; row++) {
      const pinsInRow = row + 3;
      for (let col = 0; col < pinsInRow; col++) {
        const xOffset = (col - (pinsInRow - 1) / 2) * 48;
        const x = 50 + (xOffset / 480) * 100; // パーセント
        const y = 12 + row * 8.5; // パーセント
        result.push({ x, y, row });
      }
    }
    return result;
  }, []);

  // ボールの軌道キーフレーム（ピンを跳ね返りながら下降）
  const ballPath = useMemo(() => {
    const xKeyframes: number[] = [50]; // 上部中央からスタート
    const yKeyframes: number[] = [0];

    let currentX = 50;
    const rows = 8;
    for (let row = 0; row < rows; row++) {
      // 各行のピンで左右にランダムバウンス
      const direction = Math.random() > 0.5 ? 1 : -1;
      const bounce = 3 + Math.random() * 5;
      currentX = Math.max(20, Math.min(80, currentX + direction * bounce));
      const y = 14 + row * 8.5;

      // ピンに当たる直前
      xKeyframes.push(currentX - direction * 1.5);
      yKeyframes.push(y - 2);

      // ピンからの跳ね返り
      xKeyframes.push(currentX);
      yKeyframes.push(y + 1);
    }

    // 最終的にVゲート（中央）に着地
    xKeyframes.push(50);
    yKeyframes.push(88);

    return { x: xKeyframes, y: yKeyframes };
  }, []);

  // ゲートの定義
  const gates = useMemo(() => {
    const labels = ["×", "×", "V", "×", "×"];
    return labels.map((label, i) => ({
      label,
      x: 15 + i * 17.5,
      isVictory: label === "V",
    }));
  }, []);

  // パーティクルの位置・動きを事前計算（レンダー中のMath.random回避）
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map(() => ({
      left: 50 + (Math.random() - 0.5) * 80,
      dx: (Math.random() - 0.5) * 300,
      dy: (Math.random() - 0.5) * 300,
      delayOffset: Math.random() * 0.5,
      extraDuration: Math.random() * 0.5,
    }));
  }, []);

  return (
    <div className="relative flex items-center justify-center h-full w-full overflow-hidden bg-navy">
      {/* 背景パターン（パチンコ台のフレーム） */}
      <div className="absolute inset-0">
        {/* 外枠グロウ */}
        <motion.div
          className="absolute inset-2 rounded-2xl border-2 border-gold/30"
          animate={{
            boxShadow: [
              "0 0 20px rgba(212,175,55,0.1)",
              "0 0 40px rgba(212,175,55,0.3)",
              "0 0 20px rgba(212,175,55,0.1)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* 装飾ライン */}
        <div className="absolute inset-4 rounded-xl border border-navy-lighter/50" />
      </div>

      {/* パチンコ台のプレイフィールド */}
      <div className="relative w-full max-w-lg aspect-[3/4] mx-auto">
        {/* ピン */}
        {pins.map((pin, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gold/60"
            style={{
              left: `${pin.x}%`,
              top: `${pin.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: pin.row * 0.04,
              duration: 0.3,
              ease: "backOut",
            }}
          >
            {/* ピンのハイライト */}
            <div className="absolute inset-0 rounded-full bg-gold-light/40 blur-[1px]" />
          </motion.div>
        ))}

        {/* ボール */}
        <motion.div
          className="absolute w-6 h-6 z-10"
          style={{ transform: "translate(-50%, -50%)" }}
          initial={{ left: "50%", top: "0%" }}
          animate={{
            left: ballPath.x.map((v) => `${v}%`),
            top: ballPath.y.map((v) => `${v}%`),
          }}
          transition={{
            duration: ballDropDuration,
            ease: "easeIn",
            times: ballPath.x.map((_, i) => i / (ballPath.x.length - 1)),
          }}
        >
          {/* ボール本体 */}
          <div className="w-full h-full rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark shadow-[0_0_15px_rgba(212,175,55,0.8)]">
            {/* ボールのハイライト */}
            <div className="absolute top-0.5 left-1 w-2 h-2 rounded-full bg-white/50 blur-[1px]" />
          </div>
          {/* ボールの軌跡グロウ */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gold/40 blur-md"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
        </motion.div>

        {/* ゲート（下部） */}
        <div className="absolute bottom-[6%] left-[7%] right-[7%] flex justify-between">
          {gates.map((gate, i) => (
            <motion.div
              key={i}
              className={`
                relative flex flex-col items-center
                ${gate.isVictory ? "w-16" : "w-12"}
              `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
            >
              {/* ゲートの壁 */}
              <div
                className={`
                  w-full h-14 rounded-b-lg border-x-2 border-b-2 flex items-center justify-center
                  ${
                    gate.isVictory
                      ? "border-gold bg-gold/10"
                      : "border-navy-lighter bg-navy-light/50"
                  }
                `}
              >
                <span
                  className={`
                    text-lg font-bold
                    ${gate.isVictory ? "text-gold" : "text-navy-lighter"}
                  `}
                >
                  {gate.label}
                </span>
              </div>

              {/* Vゲートのグロウ演出 */}
              {gate.isVictory && (
                <motion.div
                  className="absolute -inset-2 rounded-lg bg-gold/10 blur-md"
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scale: [0.95, 1.05, 0.95],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* 大当たり表示 */}
        <AnimatePresence>
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: jackpotDelay, duration: 0.1 }}
          >
            {/* 背景オーバーレイ */}
            <motion.div
              className="absolute inset-0 bg-navy/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: jackpotDelay, duration: 0.3 }}
            />

            {/* 大当たりテキスト */}
            <motion.div
              className="relative"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: [0, 1.3, 1], rotate: [-10, 5, 0] }}
              transition={{
                delay: jackpotDelay,
                duration: 0.6,
                ease: "backOut",
              }}
            >
              {/* テキストグロウ */}
              <motion.div
                className="absolute inset-0 -m-8 bg-gold/20 rounded-full blur-3xl"
                animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
                transition={{
                  delay: jackpotDelay + 0.3,
                  duration: 1,
                  repeat: Infinity,
                }}
              />
              <motion.p
                className="relative text-6xl md:text-8xl font-bold text-gold drop-shadow-[0_0_30px_rgba(212,175,55,0.8)]"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(212,175,55,0.5)",
                    "0 0 60px rgba(212,175,55,1)",
                    "0 0 20px rgba(212,175,55,0.5)",
                  ],
                }}
                transition={{
                  delay: jackpotDelay + 0.4,
                  duration: 0.8,
                  repeat: Infinity,
                }}
              >
                大当たり!
              </motion.p>
            </motion.div>

            {/* 数字表示 */}
            <motion.div
              className="relative mt-6"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: numberDelay,
                duration: 0.5,
                ease: "backOut",
              }}
            >
              <motion.div
                className="absolute inset-0 -m-12 rounded-full bg-gold/15 blur-3xl"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{
                  delay: numberDelay + 0.3,
                  duration: 1.2,
                  repeat: Infinity,
                }}
              />
              <span className="relative text-[10rem] md:text-[12rem] font-bold text-gold leading-none font-mono drop-shadow-[0_0_40px_rgba(212,175,55,0.7)]">
                {targetNumber}
              </span>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* 装飾パーティクル（大当たり後） */}
        {particles.map((p, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-gold"
            style={{
              left: `${p.left}%`,
              top: "50%",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              x: p.dx,
              y: p.dy,
            }}
            transition={{
              delay: jackpotDelay + p.delayOffset,
              duration: 1 + p.extraDuration,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
