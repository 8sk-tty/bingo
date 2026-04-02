"use client";

import { BINGO_COLUMNS } from "@/constants/config";
import type { BingoColumn } from "@/types";

interface BingoBoardProps {
  drawnNumbers: number[];
}

const COLUMNS: BingoColumn[] = ["B", "I", "N", "G", "O"];

export function BingoBoard({ drawnNumbers }: BingoBoardProps) {
  const drawnSet = new Set(drawnNumbers);

  return (
    <div className="w-full overflow-x-auto">
      <div className="grid grid-cols-5 gap-1 min-w-[400px]">
        {/* ヘッダー行 */}
        {COLUMNS.map((col) => (
          <div
            key={col}
            className="text-center text-gold font-bold text-2xl py-2"
          >
            {col}
          </div>
        ))}

        {/* 数字行 */}
        {Array.from({ length: 15 }, (_, row) =>
          COLUMNS.map((col) => {
            const num = BINGO_COLUMNS[col].min + row;
            const isDrawn = drawnSet.has(num);

            return (
              <div
                key={num}
                className={`
                  text-center py-1.5 text-sm font-mono rounded
                  transition-all duration-300
                  ${
                    isDrawn
                      ? "bg-gold text-navy font-bold shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                      : "text-white/30"
                  }
                `}
              >
                {num}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
