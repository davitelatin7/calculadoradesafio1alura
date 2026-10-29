export type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | null;

export interface CalculationRecord {
  id: string;
  operand1: number;
  operand2: number;
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  symbol: string;
  result: number | string;
  isError: boolean;
  timestamp: string;
  pythonSnippet: string;
}

export interface PythonStep {
  title: string;
  description: string;
  code: string;
  highlightFunction?: string;
  notes?: string[];
}
