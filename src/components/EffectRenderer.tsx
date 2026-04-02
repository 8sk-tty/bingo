"use client";

import type { EffectType, EffectProps } from "@/types";
import { HorseRace } from "./effects/HorseRace";
import { Pachinko } from "./effects/Pachinko";
import { SlotMachine } from "./effects/SlotMachine";
import { Roulette } from "./effects/Roulette";
import { Garapon } from "./effects/Garapon";
import { MarioBlock } from "./effects/MarioBlock";

interface EffectRendererProps extends EffectProps {
  effectType: EffectType;
}

const EFFECT_COMPONENTS: Record<
  EffectType,
  React.ComponentType<EffectProps>
> = {
  HORSE_RACE: HorseRace,
  PACHINKO: Pachinko,
  SLOT_MACHINE: SlotMachine,
  ROULETTE: Roulette,
  GARAPON: Garapon,
  MARIO_BLOCK: MarioBlock,
};

export function EffectRenderer({
  effectType,
  targetNumber,
  onComplete,
}: EffectRendererProps) {
  const Component = EFFECT_COMPONENTS[effectType];
  return <Component targetNumber={targetNumber} onComplete={onComplete} />;
}
