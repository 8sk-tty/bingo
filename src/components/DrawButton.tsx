"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

interface DrawButtonProps {
  onDraw: () => void;
  disabled: boolean;
  isAllDrawn: boolean;
}

export function DrawButton({ onDraw, disabled, isAllDrawn }: DrawButtonProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === "Space" && !disabled && !isAllDrawn) {
        e.preventDefault();
        onDraw();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onDraw, disabled, isAllDrawn]);

  if (isAllDrawn) {
    return (
      <div className="text-center text-gold text-2xl font-bold py-4">
        All Numbers Drawn!
      </div>
    );
  }

  return (
    <motion.button
      onClick={onDraw}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={`
        px-12 py-4 text-2xl font-bold rounded-xl
        border-2 border-gold
        transition-colors
        ${
          disabled
            ? "opacity-40 cursor-not-allowed bg-navy-light text-gold/40"
            : "bg-gold text-navy hover:bg-gold-light cursor-pointer"
        }
      `}
    >
      DRAW
    </motion.button>
  );
}
