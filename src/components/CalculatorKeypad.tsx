import React from 'react';
import { Delete } from 'lucide-react';
import { Operation } from '../types/calculator';

interface CalculatorKeypadProps {
  onNumber: (num: string) => void;
  onOperation: (op: Operation) => void;
  onEquals: () => void;
  onClear: () => void;
  onClearEntry: () => void;
  onBackspace: () => void;
  onToggleSign: () => void;
  onPercentage: () => void;
  onDecimal: () => void;
  activeOperation: Operation;
}

export const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({
  onNumber,
  onOperation,
  onEquals,
  onClear,
  onClearEntry,
  onBackspace,
  onToggleSign,
  onPercentage,
  onDecimal,
  activeOperation,
}) => {
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-2.5 mt-4">
      {/* Row 1: AC, C, Backspace, Divide */}
      <button
        onClick={onClear}
        className="h-12 sm:h-14 rounded-xl font-mono text-sm sm:text-base font-semibold bg-stone-800/80 hover:bg-stone-700/80 text-rose-300 hover:text-rose-200 border border-stone-700/60 transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
        title="Limpar tudo (Esc)"
      >
        AC
      </button>

      <button
        onClick={onClearEntry}
        className="h-12 sm:h-14 rounded-xl font-mono text-sm sm:text-base font-semibold bg-stone-800/80 hover:bg-stone-700/80 text-stone-300 hover:text-stone-100 border border-stone-700/60 transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
        title="Limpar entrada atual (C)"
      >
        C
      </button>

      <button
        onClick={onBackspace}
        className="h-12 sm:h-14 rounded-xl font-mono text-stone-300 hover:text-stone-100 bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700/60 transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
        title="Apagar dígito (Backspace)"
      >
        <Delete className="w-5 h-5" />
      </button>

      <button
        onClick={() => onOperation('divide')}
        className={`h-12 sm:h-14 rounded-xl font-mono text-lg font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs ${
          activeOperation === 'divide'
            ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-400'
            : 'bg-stone-800 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30'
        }`}
        title="Divisão (/)"
      >
        ÷
      </button>

      {/* Row 2: 7, 8, 9, Multiply */}
      <button
        onClick={() => onNumber('7')}
        className="h-12 sm:h-14 rounded-xl font-mono text-lg font-medium bg-stone-900/90 hover:bg-stone-800 text-stone-100 border border-stone-800 transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
      >
        7
      </button>
      <button
        onClick={() => onNumber('8')}
        className="h-12 sm:h-14 rounded-xl font-mono text-lg font-medium bg-stone-900/90 hover:bg-stone-800 text-stone-100 border border-stone-800 transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
      >
        8
      </button>
      <button
        onClick={() => onNumber('9')}
        className="h-12 sm:h-14 rounded-xl font-mono text-lg font-medium bg-stone-900/90 hover:bg-stone-800 text-stone-100 border border-stone-800 transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
      >
        9
      </button>
      <button
        onClick={() => onOperation('multiply')}
        className={`h-12 sm:h-14 rounded-xl font-mono text-lg font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs ${
          activeOperation === 'multiply'
            ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-400'
            : 'bg-stone-800 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30'
        }`}
        title="Multiplicação (*)"
      >
        ×
      </button>

      {/* Row 3: 4, 5, 6, Subtract */}
      <button
        onClick={() => onNumber('4')}
        className="h-12 sm:h-14 rounded-xl font-mono text-lg font-medium bg-stone-900/90 hover:bg-stone-800 text-stone-100 border border-stone-800 transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
      >
        4
      </button>
      <button
        onClick={() => onNumber('5')}
        className="h-12 sm:h-14 rounded-xl font-mono text-lg font-medium bg-stone-900/90 hover:bg-stone-800 text-stone-100 border border-stone-800 transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
      >
        5
      </button>
      <button
        onClick={() => onNumber('6')}
        className="h-12 sm:h-14 rounded-xl font-mono text-lg font-medium bg-stone-900/90 hover:bg-stone-800 text-stone-100 border border-stone-800 transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
      >
        6
      </button>
      <button
        onClick={() => onOperation('subtract')}
        className={`h-12 sm:h-14 rounded-xl font-mono text-lg font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs ${
          activeOperation === 'subtract'
            ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-400'
            : 'bg-stone-800 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30'
        }`}
        title="Subtração (-)"
      >
        −
      </button>

      {/* Row 4: 1, 2, 3, Add */}
      <button
        onClick={() => onNumber('1')}
        className="h-12 sm:h-14 rounded-xl font-mono text-lg font-medium bg-stone-900/90 hover:bg-stone-800 text-stone-100 border border-stone-800 transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
      >
        1
      </button>
      <button
        onClick={() => onNumber('2')}
        className="h-12 sm:h-14 rounded-xl font-mono text-lg font-medium bg-stone-900/90 hover:bg-stone-800 text-stone-100 border border-stone-800 transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
      >
        2
      </button>
      <button
        onClick={() => onNumber('3')}
        className="h-12 sm:h-14 rounded-xl font-mono text-lg font-medium bg-stone-900/90 hover:bg-stone-800 text-stone-100 border border-stone-800 transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
      >
        3
      </button>
      <button
        onClick={() => onOperation('add')}
        className={`h-12 sm:h-14 rounded-xl font-mono text-lg font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs ${
          activeOperation === 'add'
            ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-400'
            : 'bg-stone-800 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30'
        }`}
        title="Adição (+)"
      >
        +
      </button>

      {/* Row 5: ±, 0, ., Equals */}
      <button
        onClick={onToggleSign}
        className="h-12 sm:h-14 rounded-xl font-mono text-base font-semibold bg-stone-800/80 hover:bg-stone-700/80 text-stone-300 border border-stone-700/60 transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
        title="Inverter sinal (±)"
      >
        ±
      </button>

      <button
        onClick={() => onNumber('0')}
        className="h-12 sm:h-14 rounded-xl font-mono text-lg font-medium bg-stone-900/90 hover:bg-stone-800 text-stone-100 border border-stone-800 transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
      >
        0
      </button>

      <button
        onClick={onDecimal}
        className="h-12 sm:h-14 rounded-xl font-mono text-lg font-bold bg-stone-900/90 hover:bg-stone-800 text-stone-100 border border-stone-800 transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
        title="Ponto decimal (.)"
      >
        .
      </button>

      <button
        onClick={onEquals}
        className="h-12 sm:h-14 rounded-xl font-mono text-xl font-bold bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white shadow-md shadow-emerald-950/40 border border-emerald-600 transition-all active:scale-95 cursor-pointer flex items-center justify-center"
        title="Calcular resultado (= ou Enter)"
      >
        =
      </button>
    </div>
  );
};
