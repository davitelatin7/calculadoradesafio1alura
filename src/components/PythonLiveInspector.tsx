import React, { useState } from 'react';
import { Code2, Terminal, Lightbulb, Copy, Check, Sparkles } from 'lucide-react';
import { getPythonExecutionDetail } from '../utils/pythonExplanations';
import { Operation } from '../types/calculator';

interface PythonLiveInspectorProps {
  operand1: number | null;
  operation: Operation;
  operand2: number | null;
  result: number | string | null;
  isDivisionByZero: boolean;
}

export const PythonLiveInspector: React.FC<PythonLiveInspectorProps> = ({
  operand1,
  operation,
  operand2,
  result,
  isDivisionByZero,
}) => {
  const [hasCopied, setHasCopied] = useState(false);
  const details = getPythonExecutionDetail(
    operand1,
    operation,
    operand2,
    result,
    isDivisionByZero
  );

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(details.fullSnippet);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xl">
      <div className="space-y-4">
        {/* Top Header of Inspector */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-950/80 border border-teal-800/60 flex items-center justify-center text-teal-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-200 tracking-wide uppercase">
                Inspetor Python em Tempo Real
              </h3>
              <p className="text-[11px] text-stone-400">
                Veja o código equivalente sendo executado
              </p>
            </div>
          </div>

          <button
            onClick={handleCopySnippet}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg border border-stone-700 transition-colors cursor-pointer"
            title="Copiar código desta operação"
          >
            {hasCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar snippet</span>
              </>
            )}
          </button>
        </div>

        {/* Live Code Box: Python Syntax Highlighted */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{details.operationName}</span>
            </span>
            <span className="text-[11px] text-stone-400 font-mono">script.py</span>
          </div>

          <div className="bg-stone-950 rounded-xl p-3.5 border border-stone-800/80 font-mono text-xs sm:text-sm text-stone-200 overflow-x-auto leading-relaxed shadow-inner">
            <pre className="text-stone-300">
              <code>{details.fullSnippet}</code>
            </pre>
          </div>
        </div>

        {/* Simulated Terminal Output */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-stone-400 font-semibold">
            <Terminal className="w-3.5 h-3.5 text-teal-400" />
            <span>Saída no Terminal (Console Python):</span>
          </div>
          <div className="bg-black/80 rounded-xl p-3 border border-stone-800 font-mono text-xs text-emerald-400 overflow-x-auto">
            <pre>
              <code>{details.terminalOutput}</code>
            </pre>
          </div>
        </div>

        {/* Pedagogical Explanation Box */}
        <div className="p-3.5 rounded-xl bg-teal-950/30 border border-teal-800/40 text-xs text-teal-200/90 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-teal-300">
            <Lightbulb className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{details.conceptTitle}</span>
          </div>
          <p className="text-[12px] leading-relaxed text-stone-300">
            {details.conceptExplanation}
          </p>
          <p className="text-[11px] text-teal-300/80 italic pt-1 border-t border-teal-900/40">
            Dica: {details.pedagogicalTip}
          </p>
        </div>
      </div>
    </div>
  );
};
