import React from 'react';
import { Search, ArrowUpDown, X } from 'lucide-react';
import { GoalFilter, GoalSort, StudyGoal } from '../types/goal';

interface FilterBarProps {
  currentFilter: GoalFilter;
  onFilterChange: (filter: GoalFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentSort: GoalSort;
  onSortChange: (sort: GoalSort) => void;
  goals: StudyGoal[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  currentSort,
  onSortChange,
  goals,
}) => {
  const counts = {
    all: goals.length,
    in_progress: goals.filter((g) => g.status === 'in_progress').length,
    not_started: goals.filter((g) => g.status === 'not_started').length,
    completed: goals.filter((g) => g.status === 'completed').length,
  };

  const filterTabs: Array<{ id: GoalFilter; label: string; count: number }> = [
    { id: 'all', label: 'Todos', count: counts.all },
    { id: 'in_progress', label: 'Em andamento', count: counts.in_progress },
    { id: 'not_started', label: 'Não iniciados', count: counts.not_started },
    { id: 'completed', label: 'Concluídos', count: counts.completed },
  ];

  return (
    <div className="space-y-3 mb-6">
      {/* Top row: Search input & Sort selector */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-600 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título ou descrição..."
            className="w-full pl-9 pr-8 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-900 placeholder:text-stone-600 focus:border-teal-600 focus:bg-white transition-colors shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-600 hover:text-stone-800 rounded-full cursor-pointer"
              title="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="goal-sort" className="text-xs text-stone-700 flex items-center gap-1 font-medium whitespace-nowrap">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-600" />
            <span>Ordenar:</span>
          </label>
          <select
            id="goal-sort"
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value as GoalSort)}
            className="bg-white border border-stone-200 text-stone-800 text-xs font-medium rounded-lg px-2.5 py-2 shadow-2xs focus:border-teal-600 cursor-pointer"
          >
            <option value="deadline_asc">Prazo mais próximo</option>
            <option value="deadline_desc">Prazo mais distante</option>
            <option value="created_desc">Mais recentes</option>
            <option value="title_asc">Título (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Segmented Filter Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filterTabs.map((tab) => {
          const isActive = currentFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:text-stone-900 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[11px] font-mono tabular-nums px-1.5 py-0.2 rounded-md ${
                  isActive ? 'bg-stone-800 text-stone-200' : 'bg-stone-100 text-stone-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
