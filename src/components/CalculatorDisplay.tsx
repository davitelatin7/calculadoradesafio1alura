import React from 'react';
import { Copy, Check } from 'lucide-react';
import { Operation } from '../types/calculator';

interface CalculatorDisplayProps {
  currentInput: string;
  previousOperand: number | null;
  operation: Operation;
  isError: boolean;
  errorMessage?: string;
  onCopyResult: () => void;
  hasCopied: boolean;
}

const OPERATION_SYMBOLS: Record<NonNullable<Operation>, string> = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
};

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  currentInput,
  previousOperand,
  operation,
  isError,
  errorMessage,
  onCopyResult,
  hasCopied,
}) => {
  const opSymbol = operation ? OPERATION_SYMBOLS[operation] : '';

  // Format large numbers with commas if integer
  const formatForDisplay = (val: string) => {
    if (isError) return errorMessage || 'Erro de cálculo';
    if (!val) return '0';
    return val;
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-inner flex flex-col justify-between min-h-[120px] sm:min-h-[140px] relative overflow-hidden group">
      {/* Top subtle decorative circuit element */}
      <div className="flex items-center justify-between text-xs text-stone-500 font-mono pb-1">
        <span className="flex items-center gap-1.5 text-[11px] text-stone-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>PYTHON_VM // ACTIVE</span>
        </span>

        <button
          onClick={onCopyResult}
          className="text-stone-400 hover:text-stone-200 transition-colors p-1 rounded hover:bg-stone-800 cursor-pointer flex items-center gap-1 text-[11px]"
          title="Copiar resultado"
        >
          {hasCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copiado</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* Secondary equation preview (e.g. "12.5 ×") */}
      <div className="text-right text-stone-400 font-mono text-xs sm:text-sm h-5 overflow-hidden text-ellipsis whitespace-nowrap">
        {previousOperand !== null && operation && (
          <span>
            {previousOperand} {opSymbol}
          </span>
        )}
      </div>

      {/* Main calculation number / error */}
      <div className="text-right overflow-x-auto scrollbar-none py-1">
        <span
          className={`font-mono tabular-nums tracking-tight transition-all block ${
            isError
              ? 'text-rose-400 text-lg sm:text-xl font-semibold'
              : currentInput.length > 12
              ? 'text-2xl sm:text-3xl text-stone-100 font-bold'
              : currentInput.length > 8
              ? 'text-3xl sm:text-4xl text-stone-100 font-bold'
              : 'text-4xl sm:text-5xl text-stone-100 font-bold'
          }`}
        >
          {formatForDisplay(currentInput)}
        </span>
      </div>

      {/* Sub-label if division by zero occurred */}
      {isError && (
        <div className="text-right text-[11px] text-rose-300 font-mono pt-1">
          Python: <code className="bg-rose-950/60 px-1 py-0.5 rounded text-rose-200">ZeroDivisionError</code> evitado!
        </div>
      )}
    </div>
  );
};
