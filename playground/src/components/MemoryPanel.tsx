import { motion, AnimatePresence } from 'framer-motion';
import type { Variable } from '../types';

interface MemoryPanelProps {
  variables: Map<string, Variable>;
}

const typeColors: Record<string, string> = {
  string: '#c3e88d',
  number: '#f78c6c',
  boolean: '#c792ea',
  array: '#89ddff',
  skill: '#ff6b9d',
  undefined: '#6a7a8c',
};

const typeIcons: Record<string, string> = {
  string: '📝',
  number: '#️⃣',
  boolean: '🎯',
  array: '📚',
  skill: '⚡',
  undefined: '❓',
};

function formatValue(value: unknown, type: string): string {
  if (type === 'string') return `"${value}"`;
  if (type === 'boolean') return value ? 'bet' : 'cap';
  if (type === 'array') return JSON.stringify(value);
  if (type === 'skill') return '(skill)';
  return String(value);
}

export function MemoryPanel({ variables }: MemoryPanelProps) {
  const variableList = Array.from(variables.values());

  return (
    <div className="memory-panel">
      <div className="panel-header">
        <span className="panel-icon">🧠</span>
        <span className="panel-title">Memory</span>
        <span className="variable-count">{variableList.length} vars</span>
      </div>

      <div className="variables-container">
        <AnimatePresence mode="popLayout">
          {variableList.length === 0 ? (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="empty-icon">📦</span>
              <span className="empty-text">No variables yet</span>
              <span className="empty-hint">Run code to see memory</span>
            </motion.div>
          ) : (
            variableList.map((variable) => (
              <motion.div
                key={variable.name}
                className={`variable-card ${variable.isNew ? 'new' : ''} ${variable.isUpdated ? 'updated' : ''}`}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                }}
                style={{
                  borderColor: typeColors[variable.type] || typeColors.undefined,
                }}
              >
                {variable.isNew && (
                  <motion.span
                    className="badge new-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    NEW
                  </motion.span>
                )}
                {variable.isUpdated && (
                  <motion.span
                    className="badge updated-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    UPDATED
                  </motion.span>
                )}

                <div className="variable-header">
                  <span className="variable-icon">{typeIcons[variable.type]}</span>
                  <span className="variable-name">{variable.name}</span>
                </div>

                <motion.div
                  className="variable-value"
                  key={String(variable.value)}
                  initial={{ backgroundColor: 'rgba(255, 107, 157, 0.3)' }}
                  animate={{ backgroundColor: 'rgba(255, 107, 157, 0)' }}
                  transition={{ duration: 0.5 }}
                  style={{ color: typeColors[variable.type] }}
                >
                  {variable.isUpdated && variable.previousValue !== undefined && (
                    <span className="previous-value">
                      {formatValue(variable.previousValue, variable.type)} →{' '}
                    </span>
                  )}
                  {formatValue(variable.value, variable.type)}
                </motion.div>

                <div className="variable-type">
                  {variable.type.charAt(0).toUpperCase() + variable.type.slice(1)}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
