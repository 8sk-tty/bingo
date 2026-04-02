import type { BingoColumn, EffectType } from "@/types";

/** 演出の持続時間（ミリ秒） */
export const EFFECT_DURATION: Record<EffectType, number> = {
  HORSE_RACE: 5000,
  PACHINKO: 5000,
  SLOT_MACHINE: 4000,
  ROULETTE: 5000,
  GARAPON: 4000,
  MARIO_BLOCK: 3000,
} as const;

/** 演出なし時のシンプル表示時間（ミリ秒） */
export const SIMPLE_REVEAL_DURATION = 1500;

/** 演出が発動する確率（0〜1） */
export const EFFECT_TRIGGER_PROBABILITY = 0.3;

/** ビンゴ数字の範囲 */
export const BINGO_RANGE = { MIN: 1, MAX: 75 } as const;

/** B-I-N-G-O列の範囲定義 */
export const BINGO_COLUMNS: Record<BingoColumn, { min: number; max: number }> =
  {
    B: { min: 1, max: 15 },
    I: { min: 16, max: 30 },
    N: { min: 31, max: 45 },
    G: { min: 46, max: 60 },
    O: { min: 61, max: 75 },
  } as const;

/** 全演出タイプの一覧 */
export const ALL_EFFECT_TYPES: EffectType[] = [
  "HORSE_RACE",
  "PACHINKO",
  "SLOT_MACHINE",
  "ROULETTE",
  "GARAPON",
  "MARIO_BLOCK",
];
