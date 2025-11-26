// VibeScript Studio Types

export type ValueType = 'string' | 'number' | 'boolean' | 'array' | 'skill' | 'undefined';

export interface Variable {
  name: string;
  value: string | number | boolean | unknown[];
  type: ValueType;
  isNew?: boolean;
  isUpdated?: boolean;
  previousValue?: string | number | boolean | unknown[];
}

export interface ExecutionStep {
  line: number;
  code: string;
  explanation: string;
  details: string[];
  memoryChanges: Variable[];
  output?: string;
}

export interface ExecutionState {
  currentLine: number;
  variables: Map<string, Variable>;
  output: string[];
  steps: ExecutionStep[];
  currentStepIndex: number;
  isRunning: boolean;
  isPaused: boolean;
  speed: 'slow' | 'normal' | 'fast';
}

export const initialExecutionState: ExecutionState = {
  currentLine: 0,
  variables: new Map(),
  output: [],
  steps: [],
  currentStepIndex: -1,
  isRunning: false,
  isPaused: false,
  speed: 'normal',
};
