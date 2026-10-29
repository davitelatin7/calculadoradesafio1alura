import React from 'react';
import { Target, Clock, CheckCircle2, CircleDashed } from 'lucide-react';
import { StudyGoal } from '../types/goal';

interface StatsOverviewProps {
  goals: StudyGoal[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ goals }) => {
  const total = goals.length;
  const inProgress = goals.filter((g) => g.status === 'in_progress').length;
  const notStarted = goals.filter((g) => g.status === 'not_started').length;
  const completed = goals.filter((g) => g.status === 'completed').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <div className="bg-white border border-stone-200/80 rounded-xl p-3 sm:p-4 shadow-2xs">
        <div className="flex items-center justify-between text-stone-500 mb-1">
          <span className="text-xs font-medium">Total de metas</span>
          <Target className="w-4 h-4 text-stone-400" />
        </div>
        <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
          {total}
        </div>
      </div>

      <div className="bg-white border border-stone-200/80 rounded-xl p-3 sm:p-4 shadow-2xs">
        <div className="flex items-center justify-between text-amber-700 mb-1">
          <span className="text-xs font-medium">Em andamento</span>
          <Clock className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
          {inProgress}
        </div>
      </div>

      <div className="bg-white border border-stone-200/80 rounded-xl p-3 sm:p-4 shadow-2xs">
        <div className="flex items-center justify-between text-stone-600 mb-1">
          <span className="text-xs font-medium">Não iniciados</span>
          <CircleDashed className="w-4 h-4 text-stone-400" />
        </div>
        <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
          {notStarted}
        </div>
      </div>

      <div className="bg-white border border-stone-200/80 rounded-xl p-3 sm:p-4 shadow-2xs">
        <div className="flex items-center justify-between text-teal-700 mb-1">
          <span className="text-xs font-medium">Concluídos</span>
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
        </div>
        <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
          {completed}
        </div>
      </div>
    </div>
  );
};
