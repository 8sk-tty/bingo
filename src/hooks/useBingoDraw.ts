"use client";

import { useCallback, useState } from "react";
import {
  ALL_EFFECT_TYPES,
  BINGO_RANGE,
  EFFECT_TRIGGER_PROBABILITY,
} from "@/constants/config";
import type { DrawState, EffectType } from "@/types";

function generatePool(): number[] {
  const pool: number[] = [];
  for (let i = BINGO_RANGE.MIN; i <= BINGO_RANGE.MAX; i++) {
    pool.push(i);
  }
  return pool;
}

export function useBingoDraw() {
  const [remainingPool, setRemainingPool] = useState<number[]>(generatePool);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [currentEffect, setCurrentEffect] = useState<EffectType | null>(null);
  const [drawState, setDrawState] = useState<DrawState>("idle");

  const draw = useCallback(() => {
    if (drawState !== "idle" || remainingPool.length === 0) return;

    setDrawState("drawing");

    const randomIndex = Math.floor(Math.random() * remainingPool.length);
    const number = remainingPool[randomIndex];

    setCurrentNumber(number);
    setRemainingPool((prev) => prev.filter((_, i) => i !== randomIndex));

    const shouldPlayEffect = Math.random() < EFFECT_TRIGGER_PROBABILITY;
    if (shouldPlayEffect) {
      const effectIndex = Math.floor(Math.random() * ALL_EFFECT_TYPES.length);
      setCurrentEffect(ALL_EFFECT_TYPES[effectIndex]);
    } else {
      setCurrentEffect(null);
    }

    setDrawState("revealing");
  }, [drawState, remainingPool]);

  const completeReveal = useCallback(() => {
    if (currentNumber !== null) {
      setDrawnNumbers((prev) => [...prev, currentNumber]);
    }
    setDrawState("done");
    // doneの後すぐにidleに戻してボタンを再有効化
    setTimeout(() => {
      setDrawState("idle");
    }, 500);
  }, [currentNumber]);

  const isAllDrawn = remainingPool.length === 0;

  return {
    currentNumber,
    currentEffect,
    drawState,
    drawnNumbers,
    remainingCount: remainingPool.length,
    isAllDrawn,
    draw,
    completeReveal,
  };
}
