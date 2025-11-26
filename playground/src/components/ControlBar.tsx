import { motion } from 'framer-motion';

interface ControlBarProps {
  isRunning: boolean;
  isPaused: boolean;
  speed: 'slow' | 'normal' | 'fast';
  onRun: () => void;
  onStep: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: 'slow' | 'normal' | 'fast') => void;
}

export function ControlBar({
  isRunning,
  isPaused,
  speed,
  onRun,
  onStep,
  onPause,
  onReset,
  onSpeedChange,
}: ControlBarProps) {
  return (
    <header className="control-bar">
      <div className="logo">
        <motion.span
          className="logo-icon"
          animate={{ rotate: isRunning && !isPaused ? 360 : 0 }}
          transition={{ duration: 2, repeat: isRunning && !isPaused ? Infinity : 0, ease: 'linear' }}
        >
          VS
        </motion.span>
        <span className="logo-text">VibeScript Studio</span>
      </div>

      <div className="controls">
        <motion.button
          className={`control-btn run ${isRunning && !isPaused ? 'active' : ''}`}
          onClick={onRun}
          disabled={isRunning && !isPaused}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="btn-icon">&#9654;</span>
          <span className="btn-label">Run</span>
        </motion.button>

        <motion.button
          className="control-btn step"
          onClick={onStep}
          disabled={isRunning && !isPaused}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="btn-icon">&#9197;</span>
          <span className="btn-label">Step</span>
        </motion.button>

        <motion.button
          className={`control-btn pause ${isPaused ? 'active' : ''}`}
          onClick={onPause}
          disabled={!isRunning}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="btn-icon">{isPaused ? '&#9654;' : '&#9208;'}</span>
          <span className="btn-label">{isPaused ? 'Resume' : 'Pause'}</span>
        </motion.button>

        <motion.button
          className="control-btn reset"
          onClick={onReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="btn-icon">&#8635;</span>
          <span className="btn-label">Reset</span>
        </motion.button>

        <div className="speed-control">
          <span className="speed-label">Speed:</span>
          <div className="speed-buttons">
            {(['slow', 'normal', 'fast'] as const).map((s) => (
              <motion.button
                key={s}
                className={`speed-btn ${speed === s ? 'active' : ''}`}
                onClick={() => onSpeedChange(s)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {s === 'slow' ? '🐢' : s === 'normal' ? '🚶' : '🚀'}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
