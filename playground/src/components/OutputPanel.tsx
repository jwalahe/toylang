import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface OutputPanelProps {
  output: string[];
}

export function OutputPanel({ output }: OutputPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="output-panel">
      <div className="panel-header">
        <span className="panel-icon">💬</span>
        <span className="panel-title">Output</span>
        {output.length > 0 && (
          <span className="output-count">{output.length} lines</span>
        )}
      </div>

      <div className="output-container" ref={containerRef}>
        <AnimatePresence mode="popLayout">
          {output.length === 0 ? (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="empty-icon">📺</span>
              <span className="empty-text">No output yet</span>
              <span className="empty-hint">Use 'say' to print</span>
            </motion.div>
          ) : (
            output.map((line, index) => (
              <motion.div
                key={`${index}-${line}`}
                className="output-line"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                }}
              >
                <span className="line-number">{index + 1}</span>
                <span className="line-content">{line}</span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
