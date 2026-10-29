import React from 'react';
import { History, Trash2, ArrowUpRight } from 'lucide-react';
import { CalculationRecord } from '../types/calculator';

interface CalculationHistoryProps {
  history: CalculationRecord[];
  onSelectRecord: (record: CalculationRecord) => void;
  onClearHistory: () => void;
}

export const CalculationHistory: React.FC<CalculationHistoryProps> = ({
  history,
  onSelectRecord,
  onClearHistory,
}) => {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-stone-400" />
            <h3 className="text-xs font-bold text-stone-200 uppercase tracking-wide">
              Histórico de Cálculos
            </h3>
          </div>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="p-1 text-stone-400 hover:text-rose-400 rounded transition-colors cursor-pointer"
              title="Limpar histórico"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
          {history.length === 0 ? (
            <div className="text-center py-6 text-xs text-stone-500 font-mono">
              Seus cálculos recentes aparecerão aqui.
            </div>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectRecord(item)}
                className="w-full text-left p-2.5 rounded-xl bg-stone-950/80 hover:bg-stone-800/80 border border-stone-800/80 transition-colors group cursor-pointer"
              >
                <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
                  <span>
                    {item.operand1} {item.symbol} {item.operand2}
                  </span>
                  <span className="text-stone-500 text-[10px]">{item.timestamp}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span
                    className={`font-mono text-sm font-bold ${
                      item.isError ? 'text-rose-400' : 'text-stone-100'
                    }`}
                  >
                    = {item.result}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-emerald-400 transition-colors" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
