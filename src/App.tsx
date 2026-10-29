import { useState, useEffect, useCallback } from 'react';
import { CalculatorDisplay } from './components/CalculatorDisplay';
import { CalculatorKeypad } from './components/CalculatorKeypad';
import { PythonLiveInspector } from './components/PythonLiveInspector';
import { InteractiveRepl } from './components/InteractiveRepl';
import { LearningGuide } from './components/LearningGuide';
import { CalculationHistory } from './components/CalculationHistory';
import { PythonCodeModal } from './components/PythonCodeModal';
import { Operation, CalculationRecord } from './types/calculator';
import { playKeyClick } from './utils/audio';
import {
  Code,
  Terminal,
  BookOpen,
  Volume2,
  VolumeX,
  FileCode2,
  Sparkles,
  Calculator as CalcIcon,
} from 'lucide-react';

export default function App() {
  // Calculator state
  const [currentInput, setCurrentInput] = useState<string>('0');
  const [previousOperand, setPreviousOperand] = useState<number | null>(null);
  const [activeOperation, setActiveOperation] = useState<Operation>(null);
  const [waitingForNextOperand, setWaitingForNextOperand] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [lastCalculatedResult, setLastCalculatedResult] = useState<number | string | null>(null);

  // App UI state
  const [activeTab, setActiveTab] = useState<'calculator' | 'repl' | 'guide'>('calculator');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [history, setHistory] = useState<CalculationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('python_calc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  // Save history on change
  useEffect(() => {
    try {
      localStorage.setItem('python_calc_history', JSON.stringify(history));
    } catch {
      // Ignore storage errors
    }
  }, [history]);

  // Audio helper
  const triggerAudio = useCallback(
    (type: 'number' | 'operator' | 'equals' | 'clear' | 'error') => {
      if (soundEnabled) {
        playKeyClick(type);
      }
    },
    [soundEnabled]
  );

  // Clear all
  const handleClear = useCallback(() => {
    triggerAudio('clear');
    setCurrentInput('0');
    setPreviousOperand(null);
    setActiveOperation(null);
    setWaitingForNextOperand(false);
    setIsError(false);
    setErrorMessage('');
    setLastCalculatedResult(null);
  }, [triggerAudio]);

  // Clear current entry
  const handleClearEntry = useCallback(() => {
    triggerAudio('clear');
    setCurrentInput('0');
    setIsError(false);
    setErrorMessage('');
  }, [triggerAudio]);

  // Handle number input
  const handleNumber = useCallback(
    (numStr: string) => {
      triggerAudio('number');
      if (isError) {
        setIsError(false);
        setErrorMessage('');
        setCurrentInput(numStr);
        setWaitingForNextOperand(false);
        return;
      }

      if (waitingForNextOperand) {
        setCurrentInput(numStr);
        setWaitingForNextOperand(false);
      } else {
        if (currentInput === '0') {
          setCurrentInput(numStr);
        } else {
          // Limit maximum characters to avoid display overflow
          if (currentInput.replace('.', '').length < 14) {
            setCurrentInput((prev) => prev + numStr);
          }
        }
      }
    },
    [currentInput, isError, waitingForNextOperand, triggerAudio]
  );

  // Decimal point
  const handleDecimal = useCallback(() => {
    triggerAudio('number');
    if (isError) {
      setIsError(false);
      setErrorMessage('');
      setCurrentInput('0.');
      setWaitingForNextOperand(false);
      return;
    }

    if (waitingForNextOperand) {
      setCurrentInput('0.');
      setWaitingForNextOperand(false);
      return;
    }

    if (!currentInput.includes('.')) {
      setCurrentInput((prev) => prev + '.');
    }
  }, [currentInput, isError, waitingForNextOperand, triggerAudio]);

  // Backspace
  const handleBackspace = useCallback(() => {
    triggerAudio('clear');
    if (isError || waitingForNextOperand) {
      setCurrentInput('0');
      setIsError(false);
      setErrorMessage('');
      return;
    }

    if (currentInput.length > 1) {
      setCurrentInput((prev) => prev.slice(0, -1));
    } else {
      setCurrentInput('0');
    }
  }, [currentInput, isError, waitingForNextOperand, triggerAudio]);

  // Toggle sign (+/-)
  const handleToggleSign = useCallback(() => {
    triggerAudio('number');
    if (isError) return;
    const val = parseFloat(currentInput);
    if (!isNaN(val) && val !== 0) {
      setCurrentInput((prev) => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
    }
  }, [currentInput, isError, triggerAudio]);

  // Percentage
  const handlePercentage = useCallback(() => {
    triggerAudio('operator');
    if (isError) return;
    const val = parseFloat(currentInput);
    if (!isNaN(val)) {
      const res = val / 100;
      setCurrentInput(String(res));
    }
  }, [currentInput, isError, triggerAudio]);

  // Select operation (+, -, *, /)
  const handleOperation = useCallback(
    (nextOp: Operation) => {
      triggerAudio('operator');
      if (isError) {
        setIsError(false);
        setErrorMessage('');
      }

      const currentVal = parseFloat(currentInput);

      if (previousOperand === null) {
        setPreviousOperand(currentVal);
      } else if (activeOperation && !waitingForNextOperand) {
        // Compute intermediate result
        let res = 0;
        let error = false;

        if (activeOperation === 'add') res = previousOperand + currentVal;
        else if (activeOperation === 'subtract') res = previousOperand - currentVal;
        else if (activeOperation === 'multiply') res = previousOperand * currentVal;
        else if (activeOperation === 'divide') {
          if (currentVal === 0) {
            error = true;
          } else {
            res = previousOperand / currentVal;
          }
        }

        if (error) {
          triggerAudio('error');
          setIsError(true);
          setErrorMessage('Erro: Divisão por zero');
          setPreviousOperand(null);
          setActiveOperation(null);
          return;
        } else {
          setPreviousOperand(res);
          setCurrentInput(String(res));
        }
      }

      setActiveOperation(nextOp);
      setWaitingForNextOperand(true);
    },
    [currentInput, previousOperand, activeOperation, waitingForNextOperand, isError, triggerAudio]
  );

  // Equals (=)
  const handleEquals = useCallback(() => {
    if (!activeOperation || previousOperand === null) {
      triggerAudio('equals');
      return;
    }

    const currentVal = parseFloat(currentInput);
    let res: number | string = 0;
    let errorOccurred = false;
    let errMsg = '';

    if (activeOperation === 'add') {
      res = previousOperand + currentVal;
    } else if (activeOperation === 'subtract') {
      res = previousOperand - currentVal;
    } else if (activeOperation === 'multiply') {
      res = previousOperand * currentVal;
    } else if (activeOperation === 'divide') {
      if (currentVal === 0) {
        errorOccurred = true;
        errMsg = 'Erro: Divisão por zero!';
        res = 'ZeroDivisionError';
      } else {
        res = previousOperand / currentVal;
      }
    }

    // Format float precision
    if (typeof res === 'number') {
      if (!Number.isInteger(res)) {
        res = parseFloat(res.toFixed(8));
      }
    }

    const opSymbols = {
      add: '+',
      subtract: '−',
      multiply: '×',
      divide: '÷',
    };

    const newRecord: CalculationRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      operand1: previousOperand,
      operand2: currentVal,
      operation: activeOperation,
      symbol: opSymbols[activeOperation],
      result: res,
      isError: errorOccurred,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pythonSnippet: `${activeOperation}(${previousOperand}, ${currentVal})`,
    };

    setHistory((prev) => [newRecord, ...prev.slice(0, 19)]);

    if (errorOccurred) {
      triggerAudio('error');
      setIsError(true);
      setErrorMessage(errMsg);
      setLastCalculatedResult('ZeroDivisionError');
    } else {
      triggerAudio('equals');
      setCurrentInput(String(res));
      setLastCalculatedResult(res);
      setIsError(false);
      setErrorMessage('');
    }

    setPreviousOperand(null);
    setActiveOperation(null);
    setWaitingForNextOperand(true);
  }, [activeOperation, previousOperand, currentInput, triggerAudio]);

  // Recall item from history
  const handleSelectRecord = (record: CalculationRecord) => {
    if (typeof record.result === 'number') {
      setCurrentInput(String(record.result));
      setIsError(false);
      setWaitingForNextOperand(true);
      triggerAudio('number');
    }
  };

  // Copy result to clipboard
  const handleCopyResult = () => {
    navigator.clipboard.writeText(currentInput);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing inside the REPL input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleNumber(e.key);
      } else if (e.key === '.' || e.key === ',') {
        handleDecimal();
      } else if (e.key === '+') {
        handleOperation('add');
      } else if (e.key === '-') {
        handleOperation('subtract');
      } else if (e.key === '*' || e.key === 'x' || e.key === 'X') {
        handleOperation('multiply');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperation('divide');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumber, handleDecimal, handleOperation, handleEquals, handleBackspace, handleClear]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-teal-500/30 selection:text-teal-200 flex flex-col justify-between">
      {/* Top Bar / Header */}
      <header className="border-b border-stone-800/80 bg-stone-900/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-800 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white">
                  PythonCalc
                </span>
                <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800/60 text-emerald-300 font-medium">
                  v3.12 syntax
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">
                Calculadora didática com as 4 operações básicas em Python
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-stone-950/80 p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'calculator'
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <CalcIcon className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Calculadora &amp; Inspetor</span>
              <span className="sm:hidden">Calc</span>
            </button>

            <button
              onClick={() => setActiveTab('repl')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'repl'
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Terminal REPL</span>
              <span className="sm:hidden">Terminal</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Aprenda o Código</span>
              <span className="sm:hidden">Guia</span>
            </button>
          </div>

          {/* Action buttons: Sound and View Complete Code */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700/80 text-stone-400 hover:text-stone-200 border border-stone-700/60 transition-colors cursor-pointer"
              title={soundEnabled ? 'Silenciar cliques de som' : 'Ativar som dos cliques'}
              aria-label="Controle de som"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-500" />
              )}
            </button>

            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-600 hover:to-emerald-600 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <FileCode2 className="w-4 h-4" />
              <span className="hidden md:inline">Ver Código .py</span>
              <span className="md:hidden">.py</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1">
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            {/* Top Quick Tip Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-stone-900/60 border border-stone-800 text-xs text-stone-300">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Aprenda enquanto calcula:</strong> cada número ou operação que você clica
                  atualiza instantaneamente o código Python equivalente no painel à direita!
                </span>
              </div>
              <div className="flex items-center gap-3 text-stone-400 text-[11px] font-mono shrink-0">
                <span>Atalhos: [0-9] [+] [-] [*] [/] [Enter] [Esc]</span>
              </div>
            </div>

            {/* Split Grid: Calculator on Left, Python Live Inspector on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Calculator Physical Body (5 cols) */}
              <div className="lg:col-span-5 bg-stone-900/90 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative">
                {/* Decorative brand badge */}
                <div className="flex items-center justify-between text-xs text-stone-400 font-mono mb-3">
                  <span className="text-[11px] tracking-wider text-emerald-400 font-bold uppercase">
                    PYTHON BASIC 4-OPS
                  </span>
                  <span className="text-[10px] text-stone-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                    PRECISION: FLOAT
                  </span>
                </div>

                {/* Display */}
                <CalculatorDisplay
                  currentInput={currentInput}
                  previousOperand={previousOperand}
                  operation={activeOperation}
                  isError={isError}
                  errorMessage={errorMessage}
                  onCopyResult={handleCopyResult}
                  hasCopied={hasCopied}
                />

                {/* Keypad */}
                <CalculatorKeypad
                  onNumber={handleNumber}
                  onOperation={handleOperation}
                  onEquals={handleEquals}
                  onClear={handleClear}
                  onClearEntry={handleClearEntry}
                  onBackspace={handleBackspace}
                  onToggleSign={handleToggleSign}
                  onPercentage={handlePercentage}
                  onDecimal={handleDecimal}
                  activeOperation={activeOperation}
                />
              </div>

              {/* Right Column: Live Python Inspector + History (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <PythonLiveInspector
                  operand1={previousOperand !== null ? previousOperand : parseFloat(currentInput)}
                  operation={activeOperation}
                  operand2={waitingForNextOperand ? null : parseFloat(currentInput)}
                  result={lastCalculatedResult}
                  isDivisionByZero={isError}
                />

                {/* History Drawer */}
                <CalculationHistory
                  history={history}
                  onSelectRecord={handleSelectRecord}
                  onClearHistory={() => setHistory([])}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'repl' && <InteractiveRepl />}

        {activeTab === 'guide' && <LearningGuide />}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-900/60 py-4 text-xs text-stone-400 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="text-emerald-400 font-bold">&gt;&gt;&gt;</span>
            <span>Python 3 • Funções: somar, subtrair, multiplicar e dividir</span>
          </div>
          <div className="text-stone-400 text-[11px]">
            Desenvolvido para estudantes de programação no Google AI Studio
          </div>
        </div>
      </footer>

      {/* Modal with Full Python Source Script */}
      <PythonCodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}
