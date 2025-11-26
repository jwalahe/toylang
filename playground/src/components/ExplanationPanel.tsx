import { motion, AnimatePresence } from 'framer-motion';
import type { ExecutionStep } from '../types';

interface ExplanationPanelProps {
  currentStep: ExecutionStep | null;
  isRunning: boolean;
}

export function ExplanationPanel({ currentStep, isRunning }: ExplanationPanelProps) {
  return (
    <div className="explanation-panel">
      <div className="panel-header">
        <span className="panel-icon">📖</span>
        <span className="panel-title">What's Happening</span>
        {isRunning && (
          <motion.span
            className="running-indicator"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            Running...
          </motion.span>
        )}
      </div>

      <div className="explanation-container">
        <AnimatePresence mode="wait">
          {!currentStep ? (
            <motion.div
              key="empty"
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="empty-icon">🎯</span>
              <span className="empty-text">Ready to learn!</span>
              <span className="empty-hint">
                Click <strong>Step</strong> to execute line by line, or <strong>Run</strong> to see it all
              </span>
            </motion.div>
          ) : (
            <motion.div
              key={currentStep.line}
              className="step-explanation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="step-header">
                <span className="line-badge">Line {currentStep.line}</span>
                <code className="step-code">{currentStep.code}</code>
              </div>

              <motion.div
                className="explanation-box"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <div className="explanation-main">
                  {currentStep.explanation}
                </div>

                {currentStep.details.length > 0 && (
                  <ul className="explanation-details">
                    {currentStep.details.map((detail, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {detail}
                      </motion.li>
                    ))}
                  </ul>
                )}
              </motion.div>

              {currentStep.memoryChanges.length > 0 && (
                <div className="memory-changes">
                  <span className="changes-label">Memory changes:</span>
                  {currentStep.memoryChanges.map((change) => (
                    <span key={change.name} className="change-badge">
                      {change.name}: {String(change.value)}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
