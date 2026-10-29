export type GoalStatus = 'not_started' | 'in_progress' | 'completed';

export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  deadline: string; // ISO date string YYYY-MM-DD
  status: GoalStatus;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export type GoalFilter = 'all' | 'in_progress' | 'not_started' | 'completed';
export type GoalSort = 'deadline_asc' | 'deadline_desc' | 'created_desc' | 'title_asc';

export interface GoalFormData {
  title: string;
  description: string;
  deadline: string;
  status: GoalStatus;
}

export interface ValidationErrors {
  title?: string;
  deadline?: string;
  description?: string;
}

export const STATUS_CONFIG: Record<
  GoalStatus,
  {
    label: string;
    description: string;
    badgeBg: string;
    textColor: string;
    dotColor: string;
    borderColor: string;
  }
> = {
  not_started: {
    label: 'Não iniciado',
    description: 'Planejado para iniciar',
    badgeBg: 'bg-stone-100',
    textColor: 'text-stone-700',
    dotColor: 'bg-stone-400',
    borderColor: 'border-stone-200',
  },
  in_progress: {
    label: 'Em andamento',
    description: 'Estudo ativo no momento',
    badgeBg: 'bg-amber-50',
    textColor: 'text-amber-800',
    dotColor: 'bg-amber-500',
    borderColor: 'border-amber-200',
  },
  completed: {
    label: 'Concluído',
    description: 'Objetivo alcançado com sucesso',
    badgeBg: 'bg-teal-50',
    textColor: 'text-teal-800',
    dotColor: 'bg-teal-600',
    borderColor: 'border-teal-200',
  },
};
