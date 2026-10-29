import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { StudyGoal } from '../types/goal';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  goal: StudyGoal | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  goal,
  onCancel,
  onConfirm,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !goal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-desc"
    >
      <div
        className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 id="delete-dialog-title" className="text-base font-bold text-stone-900">
                  Excluir objetivo de estudo?
                </h3>
                <button
                  onClick={onCancel}
                  className="p-1 text-stone-600 hover:text-stone-800 rounded-md transition-colors cursor-pointer"
                  aria-label="Cancelar e fechar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div id="delete-dialog-desc" className="mt-2.5 space-y-2 text-xs text-stone-600">
                <p>
                  Você está prestes a remover o objetivo:
                </p>
                <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-medium break-words">
                  &ldquo;{goal.title}&rdquo;
                </div>
                <p className="text-stone-700">
                  Esta ação removerá este objetivo permanentemente do armazenamento local.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Excluir objetivo
          </button>
        </div>
      </div>
    </div>
  );
};
