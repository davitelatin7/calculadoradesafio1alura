import React, { useState } from 'react';
import { Terminal, Send, Trash2, HelpCircle } from 'lucide-react';

interface ReplHistoryEntry {
  input: string;
  output: string;
  isError: boolean;
  explanation?: string;
}

export const InteractiveRepl: React.FC = () => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<ReplHistoryEntry[]>([
    {
      input: 'somar(15, 25)',
      output: '40.0',
      isError: false,
      explanation: 'Chamada da função somar(a, b) retornando 15 + 25 = 40.0',
    },
    {
      input: '100 / 0',
      output: 'ZeroDivisionError: division by zero',
      isError: true,
      explanation: 'Divisão por zero não é permitida. Nossa função tratará isso com "if b == 0".',
    },
    {
      input: '2 ** 8',
      output: '256',
      isError: false,
      explanation: 'Em Python, o operador "**" realiza exponenciação (2 elevado a 8 = 256).',
    },
  ]);

  const quickSamples = [
    'somar(45, 55)',
    'subtrair(100, 37)',
    'multiplicar(7, 8)',
    'dividir(144, 12)',
    'dividir(50, 0)',
    '2 ** 10',
    '17 % 5',
  ];

  const evaluatePythonExpression = (expr: string): ReplHistoryEntry => {
    const trimmed = expr.trim();
    if (!trimmed) {
      return { input: expr, output: '', isError: false };
    }

    // Check custom function calls
    const funcMatch = trimmed.match(/^(somar|subtrair|multiplicar|dividir)\s*\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)$/i);
    if (funcMatch) {
      const [, func, aStr, bStr] = funcMatch;
      const a = parseFloat(aStr);
      const b = parseFloat(bStr);

      switch (func.toLowerCase()) {
        case 'somar':
          return {
            input: trimmed,
            output: `${(a + b).toFixed(Number.isInteger(a + b) ? 1 : 2)}`,
            isError: false,
            explanation: `Chamada da função somar(${a}, ${b}) -> retorna ${a + b}`,
          };
        case 'subtrair':
          return {
            input: trimmed,
            output: `${(a - b).toFixed(Number.isInteger(a - b) ? 1 : 2)}`,
            isError: false,
            explanation: `Chamada da função subtrair(${a}, ${b}) -> retorna ${a - b}`,
          };
        case 'multiplicar':
          return {
            input: trimmed,
            output: `${(a * b).toFixed(Number.isInteger(a * b) ? 1 : 2)}`,
            isError: false,
            explanation: `Chamada da função multiplicar(${a}, ${b}) -> retorna ${a * b}`,
          };
        case 'dividir':
          if (b === 0) {
            return {
              input: trimmed,
              output: "'Erro: Não é possível dividir por zero!'",
              isError: true,
              explanation: 'A função dividir interceptou a divisão por zero com "if b == 0" e evitou o crash!',
            };
          }
          return {
            input: trimmed,
            output: `${(a / b).toFixed(Number.isInteger(a / b) ? 1 : 2)}`,
            isError: false,
            explanation: `Chamada da função dividir(${a}, ${b}) -> retorna ${a / b}`,
          };
      }
    }

    // Check basic expressions: +, -, *, /, **, %
    // Safe evaluation of basic mathematical expressions
    if (/^[\d\s+\-*/%().]+$/.test(trimmed)) {
      try {
        // Handle division by zero check
        if (/\/\s*0(?!\d)/.test(trimmed)) {
          return {
            input: trimmed,
            output: 'ZeroDivisionError: division by zero',
            isError: true,
            explanation: 'O Python gerou ZeroDivisionError porque nenhuma proteção de "if b == 0" foi usada na expressão crua.',
          };
        }

        // Convert python ** to math pow or safe eval
        let safeExpr = trimmed;
        // Replace ** with Math.pow syntax or standard calculation
        if (safeExpr.includes('**')) {
          const powMatch = safeExpr.match(/(\d+(?:\.\d+)?)\s*\*\*\s*(\d+(?:\.\d+)?)/);
          if (powMatch) {
            const base = parseFloat(powMatch[1]);
            const exp = parseFloat(powMatch[2]);
            const res = Math.pow(base, exp);
            return {
              input: trimmed,
              output: `${res}`,
              isError: false,
              explanation: `Operador de potência do Python: ${base} elevado a ${exp} = ${res}`,
            };
          }
        }

        // Simple arithmetic parse
        const result = Function(`'use strict'; return (${safeExpr})`)();
        const formatted = typeof result === 'number'
          ? (Number.isInteger(result) ? `${result}` : `${parseFloat(result.toFixed(4))}`)
          : String(result);

        return {
          input: trimmed,
          output: formatted,
          isError: false,
          explanation: `Expressão calculada pelo interpretador Python.`,
        };
      } catch {
        return {
          input: trimmed,
          output: 'SyntaxError: invalid syntax',
          isError: true,
          explanation: 'Verifique a digitação da expressão matemática.',
        };
      }
    }

    return {
      input: trimmed,
      output: `NameError: name '${trimmed.split('(')[0]}' is not defined`,
      isError: true,
      explanation: 'Tente usar funções como somar(a, b), subtrair(a, b), multiplicar(a, b), dividir(a, b) ou contas simples como 10 + 20.',
    };
  };

  const handleRun = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const entry = evaluatePythonExpression(inputVal);
    setHistory((prev) => [entry, ...prev]);
    setInputVal('');
  };

  const runSample = (sample: string) => {
    const entry = evaluatePythonExpression(sample);
    setHistory((prev) => [entry, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-200 tracking-wide uppercase">
                Console Interativo Python (REPL)
              </h3>
              <p className="text-[11px] text-stone-400">
                Digite cálculos ou chame funções como em um terminal real
              </p>
            </div>
          </div>

          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-rose-300 transition-colors p-1 rounded hover:bg-stone-800 cursor-pointer"
              title="Limpar histórico do console"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          )}
        </div>

        {/* Quick sample chips */}
        <div className="mb-4">
          <div className="text-[11px] text-stone-400 font-medium mb-1.5 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
            <span>Exemplos rápidos para testar:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickSamples.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => runSample(sample)}
                className="px-2 py-1 text-[11px] font-mono bg-stone-950 hover:bg-stone-800 text-stone-300 hover:text-white rounded-md border border-stone-800 transition-colors cursor-pointer"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Terminal Input Form */}
        <form onSubmit={handleRun} className="mb-4">
          <div className="relative flex items-center">
            <span className="absolute left-3 font-mono text-emerald-400 text-sm font-bold select-none">
              &gt;&gt;&gt;
            </span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ex: somar(12, 8) ou 45 * 2 ou 10 / 0..."
              className="w-full pl-12 pr-10 py-2.5 bg-stone-950 border border-stone-800 rounded-xl font-mono text-xs sm:text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 p-1.5 text-stone-400 hover:text-emerald-400 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
              title="Executar comando"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* History Stream */}
        <div className="space-y-2.5 max-h-[300px] sm:max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
          {history.length === 0 ? (
            <div className="text-center py-8 text-xs text-stone-500 font-mono">
              Nenhum comando executado. Digite algo acima ou clique em um exemplo!
            </div>
          ) : (
            history.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80 font-mono text-xs space-y-1"
              >
                <div className="flex items-center gap-1.5 text-stone-300">
                  <span className="text-emerald-400 select-none">&gt;&gt;&gt;</span>
                  <span className="font-semibold">{item.input}</span>
                </div>
                <div
                  className={`pl-4 font-bold ${
                    item.isError ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {item.output}
                </div>
                {item.explanation && (
                  <div className="pl-4 text-[11px] text-stone-400 pt-0.5 font-sans">
                    💡 {item.explanation}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
