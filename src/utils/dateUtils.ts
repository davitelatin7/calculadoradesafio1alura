/**
 * Date utility functions for AdaptStudy.
 * Implements non-punitive, respectful messaging for deadlines.
 */

export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateBR(dateString: string): string {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

export function formatDateExtended(dateString: string): string {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const [year, month, day] = parts.map(Number);
  const date = new Date(year, month - 1, day);
  
  const months = [
    'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
    'jul', 'ago', 'set', 'out', 'nov', 'dez'
  ];

  return `${day} de ${months[date.getMonth()]} de ${year}`;
}

export interface DeadlineInfo {
  isOverdue: boolean;
  isToday: boolean;
  isTomorrow: boolean;
  daysRemaining: number;
  text: string;
  subtext?: string;
  badgeTone: 'neutral' | 'active' | 'warning' | 'peaceful';
}

export function getDeadlineInfo(deadlineString: string, isCompleted: boolean): DeadlineInfo {
  if (!deadlineString) {
    return {
      isOverdue: false,
      isToday: false,
      isTomorrow: false,
      daysRemaining: 0,
      text: 'Sem prazo definido',
      badgeTone: 'neutral',
    };
  }

  const parts = deadlineString.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    return {
      isOverdue: false,
      isToday: false,
      isTomorrow: false,
      daysRemaining: 0,
      text: 'Data inválida',
      badgeTone: 'neutral',
    };
  }
  const [dYear, dMonth, dDay] = parts;
  const deadlineDate = new Date(dYear, dMonth - 1, dDay);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (isCompleted) {
    return {
      isOverdue: false,
      isToday: false,
      isTomorrow: false,
      daysRemaining: diffDays,
      text: `Prazo era ${formatDateBR(deadlineString)}`,
      badgeTone: 'peaceful',
    };
  }

  if (diffDays === 0) {
    return {
      isOverdue: false,
      isToday: true,
      isTomorrow: false,
      daysRemaining: 0,
      text: 'Prazo: Hoje',
      subtext: 'Foco no que for possível hoje',
      badgeTone: 'active',
    };
  }

  if (diffDays === 1) {
    return {
      isOverdue: false,
      isToday: false,
      isTomorrow: true,
      daysRemaining: 1,
      text: 'Prazo: Amanhã',
      subtext: formatDateBR(deadlineString),
      badgeTone: 'active',
    };
  }

  if (diffDays > 1) {
    return {
      isOverdue: false,
      isToday: false,
      isTomorrow: false,
      daysRemaining: diffDays,
      text: `Prazo: ${formatDateBR(deadlineString)}`,
      subtext: `Restam ${diffDays} dias`,
      badgeTone: 'neutral',
    };
  }

  // Overdue case: diffDays < 0
  const daysOverdue = Math.abs(diffDays);
  return {
    isOverdue: true,
    isToday: false,
    isTomorrow: false,
    daysRemaining: diffDays,
    text: `Prazo original: ${formatDateBR(deadlineString)}`,
    subtext: daysOverdue === 1 
      ? 'Passou 1 dia · Ajuste a data ou siga no seu ritmo' 
      : `Passaram ${daysOverdue} dias · Siga no seu ritmo`,
    badgeTone: 'warning',
  };
}

export function addDaysToDate(dateString: string, daysToAdd: number): string {
  const parts = dateString.split('-').map(Number);
  const date = parts.length === 3 
    ? new Date(parts[0], parts[1] - 1, parts[2])
    : new Date();
  
  date.setDate(date.getDate() + daysToAdd);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
