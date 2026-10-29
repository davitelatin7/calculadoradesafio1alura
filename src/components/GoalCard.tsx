import React, { useState } from 'react';
import {
  Calendar,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  CircleDashed,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';
import { GoalStatus, STATUS_CONFIG, StudyGoal } from '../types/goal';
import { getDeadlineInfo, addDaysToDate } from '../utils/dateUtils';

interface GoalCardProps {
  goal: StudyGoal;
  onEdit: (goal: StudyGoal) => void;
  onDeleteRequest: (goal: StudyGoal) => void;
  onStatusChange: (goalId: string, newStatus: GoalStatus) => void;
  onDeadlineAdjust: (goalId: string, newDeadline: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDeleteRequest,
  onStatusChange,
  onDeadlineAdjust,
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const statusInfo = STATUS_CONFIG[goal.status];
  const isCompleted = goal.status === 'completed';
  const deadlineInfo = getDeadlineInfo(goal.deadline, isCompleted);

  const isLongDescription = (goal.description || '').length > 180;
  const displayDescription = isLongDescription && !isDescriptionExpanded
    ? `${goal.description.slice(0, 180)}...`
    : goal.description;

  const handlePostponeWeek = () => {
    // Postpone 7 days from today to give a fresh realistic window
    const newDate = addDaysToDate(goal.deadline, 7);
    onDeadlineAdjust(goal.id, newDate);
  };

  return (
    <article className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-2xs hover:border-stone-300 transition-colors flex flex-col justify-between">
      <div>
        {/* Top bar: Status text indicator & Action buttons */}
        <div className="flex items-center justify-between gap-3 mb-2.5">
          {/* Status text label without pill sandwich */}
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                goal.status === 'completed'
                  ? 'bg-teal-600'
                  : goal.status === 'in_progress'
                  ? 'bg-amber-500'
                  : 'bg-stone-400'
              }`}
              aria-hidden="true"
            />
            <span className="text-xs font-semibold text-stone-700 tracking-tight">
              {statusInfo.label}
            </span>
          </div>

          {/* Edit / Delete actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(goal)}
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              title="Editar objetivo"
              aria-label={`Editar objetivo ${goal.title}`}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteRequest(goal)}
              className="p-1.5 text-stone-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Excluir objetivo"
              aria-label={`Excluir objetivo ${goal.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          className={`text-base font-semibold text-stone-900 leading-snug break-words ${
            isCompleted ? 'text-stone-600 line-through decoration-stone-300' : ''
          }`}
        >
          {goal.title}
        </h3>

        {/* Description */}
        {goal.description && (
          <div className="mt-2 text-xs text-stone-600 leading-relaxed break-words whitespace-pre-line">
            <p>{displayDescription}</p>
            {isLongDescription && (
              <button
                type="button"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-800 hover:text-teal-950 mt-1 cursor-pointer"
              >
                {isDescriptionExpanded ? (
                  <>
                    <span>Ver menos</span>
                    <ChevronUp className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    <span>Ler mais</span>
                    <ChevronDown className="w-3 h-3" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer area: Deadline and Status Switcher */}
      <div className="mt-4 pt-3 border-t border-stone-100 space-y-2.5">
        {/* Deadline presentation: Empathetic, clear, non-punitive */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
          <div className="flex items-center gap-1.5 text-stone-600">
            <Calendar className="w-3.5 h-3.5 text-stone-600 shrink-0" />
            <span className="font-medium text-stone-800">{deadlineInfo.text}</span>
            {deadlineInfo.subtext && (
              <>
                <span className="text-stone-600" aria-hidden="true">·</span>
                <span
                  className={`${
                    deadlineInfo.isOverdue
                      ? 'text-amber-800 font-medium'
                      : 'text-stone-600'
                  }`}
                >
                  {deadlineInfo.subtext}
                </span>
              </>
            )}
          </div>

          {/* Quick reschedule button for overdue items to encourage cadence adjustment without guilt */}
          {deadlineInfo.isOverdue && !isCompleted && (
            <button
              onClick={handlePostponeWeek}
              title="Ajustar prazo para +7 dias a partir da data prevista"
              className="inline-flex items-center gap-1 text-[11px] text-amber-800 hover:text-amber-950 font-medium hover:underline self-start sm:self-auto cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Ajustar prazo (+7 dias)</span>
            </button>
          )}
        </div>

        {/* Quick status transition bar */}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="text-[11px] text-stone-600 pr-1">Mudar status:</span>
          {goal.status !== 'not_started' && (
            <button
              onClick={() => onStatusChange(goal.id, 'not_started')}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors cursor-pointer"
            >
              <CircleDashed className="w-3 h-3 text-stone-500" />
              <span>Não iniciado</span>
            </button>
          )}
          {goal.status !== 'in_progress' && (
            <button
              onClick={() => onStatusChange(goal.id, 'in_progress')}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-md transition-colors cursor-pointer"
            >
              <Clock className="w-3 h-3 text-amber-600" />
              <span>Em andamento</span>
            </button>
          )}
          {goal.status !== 'completed' && (
            <button
              onClick={() => onStatusChange(goal.id, 'completed')}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 rounded-md transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3 h-3 text-teal-600" />
              <span>Concluir</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
