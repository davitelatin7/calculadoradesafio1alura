import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';
import { GoalFormData, GoalStatus, StudyGoal, ValidationErrors } from '../types/goal';
import { getTodayString, addDaysToDate } from '../utils/dateUtils';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: GoalFormData) => void;
  initialGoal?: StudyGoal | null;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialGoal,
}) => {
  const isEditing = Boolean(initialGoal);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<GoalStatus>('not_started');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Initialize or reset form state when modal opens or initialGoal changes
  useEffect(() => {
    if (isOpen) {
      if (initialGoal) {
        setTitle(initialGoal.title);
        setDescription(initialGoal.description || '');
        setDeadline(initialGoal.deadline || getTodayString());
        setStatus(initialGoal.status);
      } else {
        setTitle('');
        setDescription('');
        setDeadline(addDaysToDate(getTodayString(), 7)); // Default 1 week ahead
        setStatus('not_started');
      }
      setErrors({});
      setHasAttemptedSubmit(false);
    }
  }, [isOpen, initialGoal]);

  // Handle ESC key to cancel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      newErrors.title = 'O título do objetivo é obrigatório e não pode conter apenas espaços.';
    } else if (trimmedTitle.length > 100) {
      newErrors.title = 'O título deve ter no máximo 100 caracteres.';
    }

    if (description.length > 1000) {
      newErrors.description = 'A descrição não pode ultrapassar 1.000 caracteres.';
    }

    if (!deadline) {
      newErrors.deadline = 'Por favor, selecione uma data de prazo para o objetivo.';
    } else {
      const parts = deadline.split('-').map(Number);
      if (parts.length !== 3 || parts.some(isNaN) || parts[0] < 2000 || parts[0] > 2100) {
        newErrors.deadline = 'Insira uma data válida para o prazo.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    if (validate()) {
      onSave({
        title: title.trim(),
        description: description.trim(),
        deadline,
        status,
      });
    }
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (hasAttemptedSubmit) {
      if (val.trim().length > 0 && val.trim().length <= 100) {
        setErrors((prev) => ({ ...prev, title: undefined }));
      }
    }
  };

  const setQuickDeadline = (days: number) => {
    setDeadline(addDaysToDate(getTodayString(), days));
    if (errors.deadline) {
      setErrors((prev) => ({ ...prev, deadline: undefined }));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <div>
            <h2 id="modal-title" className="text-base font-bold text-stone-900">
              {isEditing ? 'Editar objetivo de estudo' : 'Novo objetivo de estudo'}
            </h2>
            <p className="text-xs text-stone-700">
              {isEditing
                ? 'Atualize as informações sem perder seu progresso.'
                : 'Defina o que você quer aprender com leveza e clareza.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Título */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="goal-title" className="text-xs font-semibold text-stone-800">
                Título do objetivo <span className="text-amber-600">*</span>
              </label>
              <span className={`text-[11px] font-mono tabular-nums ${title.length > 100 ? 'text-rose-600 font-bold' : 'text-stone-600'}`}>
                {title.length}/100
              </span>
            </div>
            <input
              id="goal-title"
              type="text"
              value={title}
              maxLength={100}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ex.: Aprender funções quadráticas para o ENEM"
              className={`w-full px-3.5 py-2.5 bg-stone-50 border rounded-lg text-sm text-stone-900 placeholder:text-stone-600 focus:bg-white transition-colors ${
                errors.title
                  ? 'border-rose-400 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                  : 'border-stone-300 focus:border-teal-600'
              }`}
              autoFocus
            />
            {errors.title && (
              <p className="text-xs text-rose-700 flex items-center gap-1.5 pt-0.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="goal-description" className="text-xs font-semibold text-stone-800">
                Descrição <span className="text-stone-600 font-normal">(opcional)</span>
              </label>
              <span className={`text-[11px] font-mono tabular-nums ${description.length > 1000 ? 'text-rose-600 font-bold' : 'text-stone-600'}`}>
                {description.length}/1000
              </span>
            </div>
            <textarea
              id="goal-description"
              rows={3}
              value={description}
              maxLength={1000}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explique o que você pretende aprender, materiais de apoio ou etapas que planeja seguir..."
              className={`w-full px-3.5 py-2 bg-stone-50 border rounded-lg text-sm text-stone-900 placeholder:text-stone-600 focus:bg-white transition-colors resize-none ${
                errors.description
                  ? 'border-rose-400 focus:border-rose-600'
                  : 'border-stone-300 focus:border-teal-600'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-700 flex items-center gap-1.5 pt-0.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.description}</span>
              </p>
            )}
          </div>

          {/* Prazo */}
          <div className="space-y-2">
            <label htmlFor="goal-deadline" className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-600" />
              <span>Prazo para conclusão <span className="text-amber-600">*</span></span>
            </label>
            <input
              id="goal-deadline"
              type="date"
              value={deadline}
              onChange={(e) => {
                setDeadline(e.target.value);
                if (errors.deadline) {
                  setErrors((prev) => ({ ...prev, deadline: undefined }));
                }
              }}
              className={`w-full px-3.5 py-2.5 bg-stone-50 border rounded-lg text-sm text-stone-900 focus:bg-white transition-colors cursor-pointer ${
                errors.deadline
                  ? 'border-rose-400 focus:border-rose-600'
                  : 'border-stone-300 focus:border-teal-600'
              }`}
            />
            {errors.deadline && (
              <p className="text-xs text-rose-700 flex items-center gap-1.5 pt-0.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.deadline}</span>
              </p>
            )}

            {/* Quick helper shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-stone-600">
              <span className="text-stone-600 text-[11px] pr-1">Atalhos:</span>
              <button
                type="button"
                onClick={() => setQuickDeadline(0)}
                className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-[11px] transition-colors cursor-pointer"
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={() => setQuickDeadline(3)}
                className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-[11px] transition-colors cursor-pointer"
              >
                +3 dias
              </button>
              <button
                type="button"
                onClick={() => setQuickDeadline(7)}
                className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-[11px] transition-colors cursor-pointer"
              >
                +1 semana
              </button>
              <button
                type="button"
                onClick={() => setQuickDeadline(15)}
                className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-[11px] transition-colors cursor-pointer"
              >
                +15 dias
              </button>
              <button
                type="button"
                onClick={() => setQuickDeadline(30)}
                className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-[11px] transition-colors cursor-pointer"
              >
                +1 mês
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-800 block">
              Status atual do objetivo
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('not_started')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  status === 'not_started'
                    ? 'border-stone-800 bg-stone-900 text-white shadow-xs'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800'
                }`}
              >
                <div className="text-xs font-semibold">Não iniciado</div>
                <div className={`text-[11px] mt-0.5 ${status === 'not_started' ? 'text-stone-300' : 'text-stone-600'}`}>
                  Planejado para iniciar
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStatus('in_progress')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  status === 'in_progress'
                    ? 'border-amber-600 bg-amber-700 text-white shadow-xs'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800'
                }`}
              >
                <div className="text-xs font-semibold">Em andamento</div>
                <div className={`text-[11px] mt-0.5 ${status === 'in_progress' ? 'text-amber-100' : 'text-stone-600'}`}>
                  Estudo ativo
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStatus('completed')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  status === 'completed'
                    ? 'border-teal-700 bg-teal-800 text-white shadow-xs'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800'
                }`}
              >
                <div className="text-xs font-semibold">Concluído</div>
                <div className={`text-[11px] mt-0.5 ${status === 'completed' ? 'text-teal-100' : 'text-stone-600'}`}>
                  Meta alcançada
                </div>
              </button>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 bg-teal-800 hover:bg-teal-900 active:bg-teal-950 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            {isEditing ? 'Salvar alterações' : 'Cadastrar objetivo'}
          </button>
        </div>
      </div>
    </div>
  );
};
