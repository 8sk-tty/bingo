"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { SIMPLE_REVEAL_DURATION } from "@/constants/config";

interface NumberRevealProps {
  number: number;
  onComplete: () => void;
}

/** デフォルトの数字表示アニメーション（演出なし時） */
export function NumberReveal({ number, onComplete }: NumberRevealProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, SIMPLE_REVEAL_DURATION);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex items-center justify-center h-full">
      <motion.div
        initial={{ scale: 0.2, opacity: 0, filter: "blur(20px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        {/* ゴールドグロウ背景 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.6, 0.3], scale: [0.5, 1.5, 1.2] }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 -m-16 rounded-full bg-gold/20 blur-3xl"
        />

        {/* メイン数字 */}
        <span className="relative text-[10rem] font-bold text-gold leading-none font-mono drop-shadow-[0_0_30px_rgba(212,175,55,0.6)]">
          {number}
        </span>
      </motion.div>
    </div>
  );
}
