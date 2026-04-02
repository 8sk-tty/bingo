export type EffectType =
  | "HORSE_RACE"
  | "PACHINKO"
  | "SLOT_MACHINE"
  | "ROULETTE"
  | "GARAPON"
  | "MARIO_BLOCK";

export interface EffectProps {
  targetNumber: number;
  onComplete: () => void;
}

export type BingoColumn = "B" | "I" | "N" | "G" | "O";

export type DrawState = "idle" | "drawing" | "revealing" | "done";
