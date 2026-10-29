import { StudyGoal } from '../types/goal';
import { getTodayString, addDaysToDate } from '../utils/dateUtils';

const STORAGE_KEY = 'adaptstudy_goals_v1';

export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Validate that an object has the required fields for a StudyGoal
 */
function isValidGoal(item: unknown): item is StudyGoal {
  if (!item || typeof item !== 'object') return false;
  const candidate = item as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    candidate.title.trim().length > 0 &&
    typeof candidate.description === 'string' &&
    typeof candidate.deadline === 'string' &&
    ['not_started', 'in_progress', 'completed'].includes(candidate.status as string)
  );
}

/**
 * Loads goals from localStorage.
 * Returns empty array if none found or if storage is uninitialized.
 */
export function loadGoalsFromStorage(): StorageResult<StudyGoal[]> {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return {
        success: false,
        data: [],
        error: 'Armazenamento local (localStorage) não disponível neste ambiente.',
      };
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { success: true, data: [] };
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return { success: true, data: [] };
    }

    // Filter valid goals to prevent corrupt data from crashing the app
    const validGoals: StudyGoal[] = parsed.filter(isValidGoal);
    return { success: true, data: validGoals };
  } catch (err) {
    console.error('Erro ao ler do localStorage:', err);
    return {
      success: false,
      data: [],
      error: 'Não foi possível carregar os objetivos salvos. Os dados podem estar corrompidos.',
    };
  }
}

/**
 * Persists the goals array to localStorage.
 */
export function saveGoalsToStorage(goals: StudyGoal[]): StorageResult<boolean> {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return {
        success: false,
        error: 'Armazenamento local não disponível para salvar as alterações.',
      };
    }

    const serialized = JSON.stringify(goals);
    window.localStorage.setItem(STORAGE_KEY, serialized);
    return { success: true, data: true };
  } catch (err: unknown) {
    console.error('Erro ao salvar no localStorage:', err);
    let errorMessage = 'Falha ao salvar os dados localmente.';
    if (err instanceof DOMException && (err.name === 'QuotaExceededError' || err.code === 22)) {
      errorMessage = 'O limite de armazenamento do navegador foi atingido.';
    }
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Generates sample demo goals clearly labeled as test data for quick demonstration
 */
export function getSampleDemoGoals(): StudyGoal[] {
  const today = getTodayString();
  return [
    {
      id: 'demo-1',
      title: 'Matemática para o ENEM: Funções e Gráficos',
      description: 'Revisar conceitos fundamentais de funções afim e quadrática, interpretação de gráficos e resolver 15 questões de provas anteriores.',
      deadline: addDaysToDate(today, 5),
      status: 'in_progress',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-2',
      title: 'Programação: Introdução a TypeScript e React',
      description: 'Construir os primeiros componentes funcionais tipados com hooks useState e useEffect.',
      deadline: addDaysToDate(today, 12),
      status: 'not_started',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-3',
      title: 'Português: Regência Verbal e Crase',
      description: 'Ler o resumo teórico de regência e fazer anotações com os 20 verbos mais cobrados em vestibulares.',
      deadline: addDaysToDate(today, -2),
      status: 'not_started',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-4',
      title: 'Inglês: Vocabulário para leitura acadêmica',
      description: 'Praticar leitura de 2 artigos científicos identificando conectivos e termos técnicos.',
      deadline: addDaysToDate(today, -1),
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

/**
 * Export goals as a downloadable JSON file for backup
 */
export function exportGoalsToJSON(goals: StudyGoal[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(goals, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `adaptstudy-backup-${getTodayString()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Imports goals from JSON string with strict validation
 */
export function parseGoalsFromJSON(jsonString: string): StorageResult<StudyGoal[]> {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) {
      return {
        success: false,
        error: 'O arquivo JSON deve conter uma lista de objetivos.',
      };
    }

    const validGoals: StudyGoal[] = parsed.filter(isValidGoal);
    if (validGoals.length === 0 && parsed.length > 0) {
      return {
        success: false,
        error: 'Nenhum objetivo válido encontrado no formato esperado.',
      };
    }

    return {
      success: true,
      data: validGoals,
    };
  } catch (err) {
    return {
      success: false,
      error: 'Formato de arquivo inválido. Verifique se é um arquivo JSON válido.',
    };
  }
}
