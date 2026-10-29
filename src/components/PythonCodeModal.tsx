import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode2 } from 'lucide-react';
import { COMPLETE_PYTHON_SCRIPT } from '../utils/pythonExplanations';

interface PythonCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PythonCodeModal: React.FC<PythonCodeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [hasCopied, setHasCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(COMPLETE_PYTHON_SCRIPT);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([COMPLETE_PYTHON_SCRIPT], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calculadora.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-950/90 border border-teal-800/80 flex items-center justify-center text-teal-400">
              <FileCode2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-100">
                Código Python Completo (calculadora.py)
              </h3>
              <p className="text-xs text-stone-400">
                Pronto para copiar, salvar e executar no seu computador
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-y-auto p-5 bg-stone-950 font-mono text-xs leading-relaxed text-stone-300">
          <pre>
            <code>{COMPLETE_PYTHON_SCRIPT}</code>
          </pre>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3.5 bg-stone-900 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-stone-400 text-[11px] font-mono">
            Execute no terminal: <span className="text-emerald-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">python calculadora.py</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg border border-stone-700 transition-colors cursor-pointer font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar .py</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-700 hover:bg-teal-600 active:bg-teal-800 text-white rounded-lg transition-colors cursor-pointer font-semibold"
            >
              {hasCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
