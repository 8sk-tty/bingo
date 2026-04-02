"use client";

import { useBingoDraw } from "@/hooks/useBingoDraw";
import { DrawButton } from "@/components/DrawButton";
import { BingoBoard } from "@/components/BingoBoard";
import { NumberReveal } from "@/components/NumberReveal";
import { EffectRenderer } from "@/components/EffectRenderer";
import { BINGO_RANGE } from "@/constants/config";

export default function Home() {
  const {
    currentNumber,
    currentEffect,
    drawState,
    drawnNumbers,
    remainingCount,
    isAllDrawn,
    draw,
    completeReveal,
  } = useBingoDraw();

  const isRevealing = drawState === "revealing";

  return (
    <div className="flex flex-col min-h-screen bg-navy">
      {/* ヘッダー */}
      <header className="text-center py-4 border-b border-gold/20">
        <h1 className="text-4xl font-bold text-gold tracking-widest">
          ✵ BINGO DERBY ✵
        </h1>
        <p className="text-gold/50 text-sm mt-1 font-mono">
          {remainingCount} / {BINGO_RANGE.MAX} remaining
        </p>
      </header>

      {/* メインエリア */}
      <main className="flex-1 flex flex-col items-center justify-center gap-8 py-8">
        {/* 演出 / 数字表示エリア */}
        <div className="w-full max-w-2xl h-[320px] flex items-center justify-center">
          {isRevealing && currentNumber !== null ? (
            currentEffect ? (
              <EffectRenderer
                effectType={currentEffect}
                targetNumber={currentNumber}
                onComplete={completeReveal}
              />
            ) : (
              <NumberReveal
                number={currentNumber}
                onComplete={completeReveal}
              />
            )
          ) : drawState === "done" && currentNumber !== null ? (
            <div className="text-[10rem] font-bold text-gold leading-none font-mono drop-shadow-[0_0_30px_rgba(212,175,55,0.6)]">
              {currentNumber}
            </div>
          ) : (
            <div className="text-gold/20 text-6xl font-bold">?</div>
          )}
        </div>

        {/* 抽選ボタン */}
        <DrawButton
          onDraw={draw}
          disabled={drawState !== "idle"}
          isAllDrawn={isAllDrawn}
        />
      </main>

      {/* ビンゴボード */}
      <footer className="border-t border-gold/20 p-4">
        <div className="max-w-lg mx-auto">
          <BingoBoard drawnNumbers={drawnNumbers} />
        </div>
      </footer>
    </div>
  );
}
