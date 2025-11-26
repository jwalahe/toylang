import { useState, useCallback, useRef } from 'react';
import { ControlBar, CodePanel, MemoryPanel, OutputPanel, ExplanationPanel } from './components';
import type { Variable, ExecutionStep, ExecutionState } from './types';
import './App.css';

// Sample VibeScript code
const initialCode = `note Welcome to VibeScript!
note A programming language that teaches you how code works

note === VARIABLES ===
note Variables HOLD data in memory

hold name = "Alex"
hold age = 17
hold score = 95.5

note === OUTPUT ===
note 'say' outputs text to the screen

say "Hello, " + name + "!"
say "You are " + age + " years old"

note === BOOLEANS ===
note bet = true, cap = false

hold isStudent = bet
hold hasCar = cap

note === CONDITIONALS ===
note Make decisions with if/else

if (age >= 18) {
    say "You can vote!"
} else {
    say "Not old enough to vote yet"
}

note === LOOPS ===
note 'keep' repeats while condition is true

hold count = 0
keep (count < 3) {
    say "Count: " + count
    count = count + 1
}

note === FUNCTIONS ===
note 'skill' creates reusable code blocks

skill greet(person) {
    say "Hey " + person + ", what's up!"
}

greet("Jordan")
greet("Sam")

say "Done! You learned the basics!"
`;

// Mock execution steps for demonstration
function generateMockSteps(code: string): ExecutionStep[] {
  const lines = code.split('\n');
  const steps: ExecutionStep[] = [];
  const variables = new Map<string, Variable>();

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('note')) return;

    // Variable declaration: hold name = value
    const holdMatch = trimmed.match(/^hold\s+(\w+)\s*=\s*(.+)$/);
    if (holdMatch) {
      const [, name, valueStr] = holdMatch;
      let value: string | number | boolean = valueStr;
      let type: Variable['type'] = 'string';

      if (valueStr.startsWith('"') && valueStr.endsWith('"')) {
        value = valueStr.slice(1, -1);
        type = 'string';
      } else if (valueStr === 'bet') {
        value = true;
        type = 'boolean';
      } else if (valueStr === 'cap') {
        value = false;
        type = 'boolean';
      } else if (!isNaN(Number(valueStr))) {
        value = Number(valueStr);
        type = 'number';
      }

      const variable: Variable = { name, value, type, isNew: true };
      variables.set(name, variable);

      steps.push({
        line: lineNum,
        code: trimmed,
        explanation: `Creating variable "${name}"`,
        details: [
          `Reserved a spot in memory called "${name}"`,
          `Stored the ${type} value: ${type === 'string' ? `"${value}"` : value}`,
          `Type: ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        ],
        memoryChanges: [{ ...variable }],
      });
      return;
    }

    // Assignment: name = value (update existing)
    const assignMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
    if (assignMatch && variables.has(assignMatch[1])) {
      const [, name, valueStr] = assignMatch;
      const existing = variables.get(name)!;
      const previousValue = existing.value;

      let newValue: string | number | boolean = valueStr;
      // Simple expression evaluation for count + 1
      if (valueStr.includes('+')) {
        const parts = valueStr.split('+').map(p => p.trim());
        if (parts[0] === name && !isNaN(Number(parts[1]))) {
          newValue = (existing.value as number) + Number(parts[1]);
        }
      } else if (!isNaN(Number(valueStr))) {
        newValue = Number(valueStr);
      }

      existing.value = newValue;
      existing.isNew = false;
      existing.isUpdated = true;
      existing.previousValue = previousValue;

      steps.push({
        line: lineNum,
        code: trimmed,
        explanation: `Updating variable "${name}"`,
        details: [
          `Changed value from ${previousValue} to ${newValue}`,
          `The variable still holds the same spot in memory`,
        ],
        memoryChanges: [{ ...existing }],
      });
      return;
    }

    // Say statement
    const sayMatch = trimmed.match(/^say\s+(.+)$/);
    if (sayMatch) {
      let output = sayMatch[1];
      // Simple string interpolation for demo
      variables.forEach((v, name) => {
        output = output.replace(new RegExp(`\\b${name}\\b`, 'g'), String(v.value));
      });
      // Clean up the output
      output = output.replace(/"/g, '').replace(/\s*\+\s*/g, '');

      steps.push({
        line: lineNum,
        code: trimmed,
        explanation: `Outputting to screen`,
        details: [
          `The 'say' command prints text to the output`,
          `Result: "${output}"`,
        ],
        memoryChanges: [],
        output,
      });
      return;
    }

    // If statement
    if (trimmed.startsWith('if')) {
      steps.push({
        line: lineNum,
        code: trimmed,
        explanation: `Checking a condition`,
        details: [
          `The 'if' statement evaluates whether something is true (bet) or false (cap)`,
          `If the condition is bet, the code inside { } runs`,
          `If it's cap, we skip to 'else' (if there is one)`,
        ],
        memoryChanges: [],
      });
      return;
    }

    // Else statement
    if (trimmed.startsWith('} else {') || trimmed === 'else {') {
      steps.push({
        line: lineNum,
        code: trimmed,
        explanation: `Alternative path (else)`,
        details: [
          `The condition was cap (false)`,
          `So we run the code in the else block instead`,
        ],
        memoryChanges: [],
      });
      return;
    }

    // Keep (while) loop
    if (trimmed.startsWith('keep')) {
      steps.push({
        line: lineNum,
        code: trimmed,
        explanation: `Starting a loop`,
        details: [
          `'keep' repeats the code while the condition is bet (true)`,
          `When the condition becomes cap (false), the loop stops`,
          `This is how computers do repetitive tasks!`,
        ],
        memoryChanges: [],
      });
      return;
    }

    // Skill (function) declaration
    if (trimmed.startsWith('skill')) {
      const skillMatch = trimmed.match(/^skill\s+(\w+)\s*\(/);
      if (skillMatch) {
        const skillName = skillMatch[1];
        steps.push({
          line: lineNum,
          code: trimmed,
          explanation: `Defining a skill (function)`,
          details: [
            `Creating a reusable block of code called "${skillName}"`,
            `Skills can be called multiple times with different inputs`,
            `Think of it like teaching the computer a new trick!`,
          ],
          memoryChanges: [],
        });
      }
      return;
    }

    // Function call
    const callMatch = trimmed.match(/^(\w+)\s*\((.+)\)$/);
    if (callMatch) {
      const [, funcName, args] = callMatch;
      steps.push({
        line: lineNum,
        code: trimmed,
        explanation: `Calling skill "${funcName}"`,
        details: [
          `Running the "${funcName}" skill with input: ${args}`,
          `The computer jumps to where the skill was defined`,
          `Then it runs that code and comes back here`,
        ],
        memoryChanges: [],
        output: `Hey ${args.replace(/"/g, '')}, what's up!`,
      });
      return;
    }
  });

  return steps;
}

function App() {
  const [code, setCode] = useState(initialCode);
  const [executionState, setExecutionState] = useState<ExecutionState>({
    currentLine: 0,
    variables: new Map(),
    output: [],
    steps: [],
    currentStepIndex: -1,
    isRunning: false,
    isPaused: false,
    speed: 'normal',
  });

  const runIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const speedToMs = { slow: 1500, normal: 800, fast: 300 };

  // Execute a single step
  const executeStep = useCallback(() => {
    setExecutionState((prev) => {
      const nextIndex = prev.currentStepIndex + 1;

      if (nextIndex >= prev.steps.length) {
        // Execution complete
        if (runIntervalRef.current) {
          clearInterval(runIntervalRef.current);
          runIntervalRef.current = null;
        }
        return { ...prev, isRunning: false, isPaused: false };
      }

      const step = prev.steps[nextIndex];
      const newVariables = new Map(prev.variables);

      // Clear previous isNew/isUpdated flags
      newVariables.forEach((v) => {
        v.isNew = false;
        v.isUpdated = false;
        v.previousValue = undefined;
      });

      // Apply memory changes
      step.memoryChanges.forEach((change) => {
        newVariables.set(change.name, { ...change });
      });

      // Add output if any
      const newOutput = step.output ? [...prev.output, step.output] : prev.output;

      return {
        ...prev,
        currentLine: step.line,
        variables: newVariables,
        output: newOutput,
        currentStepIndex: nextIndex,
      };
    });
  }, []);

  // Run all code
  const handleRun = useCallback(() => {
    const steps = generateMockSteps(code);

    setExecutionState({
      currentLine: 0,
      variables: new Map(),
      output: [],
      steps,
      currentStepIndex: -1,
      isRunning: true,
      isPaused: false,
      speed: executionState.speed,
    });

    // Start interval for continuous execution
    runIntervalRef.current = setInterval(() => {
      executeStep();
    }, speedToMs[executionState.speed]);
  }, [code, executionState.speed, executeStep]);

  // Step through code
  const handleStep = useCallback(() => {
    if (executionState.currentStepIndex === -1) {
      // First step - generate steps
      const steps = generateMockSteps(code);
      setExecutionState((prev) => ({
        ...prev,
        steps,
        isRunning: true,
        isPaused: true,
      }));
      setTimeout(executeStep, 100);
    } else {
      executeStep();
    }
  }, [code, executionState.currentStepIndex, executeStep]);

  // Pause/Resume
  const handlePause = useCallback(() => {
    if (executionState.isPaused) {
      // Resume
      runIntervalRef.current = setInterval(() => {
        executeStep();
      }, speedToMs[executionState.speed]);
      setExecutionState((prev) => ({ ...prev, isPaused: false }));
    } else {
      // Pause
      if (runIntervalRef.current) {
        clearInterval(runIntervalRef.current);
        runIntervalRef.current = null;
      }
      setExecutionState((prev) => ({ ...prev, isPaused: true }));
    }
  }, [executionState.isPaused, executionState.speed, executeStep]);

  // Reset
  const handleReset = useCallback(() => {
    if (runIntervalRef.current) {
      clearInterval(runIntervalRef.current);
      runIntervalRef.current = null;
    }
    setExecutionState({
      currentLine: 0,
      variables: new Map(),
      output: [],
      steps: [],
      currentStepIndex: -1,
      isRunning: false,
      isPaused: false,
      speed: executionState.speed,
    });
  }, [executionState.speed]);

  // Speed change
  const handleSpeedChange = useCallback((speed: 'slow' | 'normal' | 'fast') => {
    setExecutionState((prev) => ({ ...prev, speed }));

    // Update running interval if currently running
    if (runIntervalRef.current && executionState.isRunning && !executionState.isPaused) {
      clearInterval(runIntervalRef.current);
      runIntervalRef.current = setInterval(() => {
        executeStep();
      }, speedToMs[speed]);
    }
  }, [executionState.isRunning, executionState.isPaused, executeStep]);

  const currentStep = executionState.currentStepIndex >= 0
    ? executionState.steps[executionState.currentStepIndex]
    : null;

  return (
    <div className="app">
      <ControlBar
        isRunning={executionState.isRunning}
        isPaused={executionState.isPaused}
        speed={executionState.speed}
        onRun={handleRun}
        onStep={handleStep}
        onPause={handlePause}
        onReset={handleReset}
        onSpeedChange={handleSpeedChange}
      />

      <main className="main-content">
        <div className="top-panels">
          <CodePanel
            code={code}
            currentLine={executionState.currentLine}
            onChange={setCode}
            isRunning={executionState.isRunning}
          />
          <MemoryPanel variables={executionState.variables} />
          <OutputPanel output={executionState.output} />
        </div>

        <ExplanationPanel
          currentStep={currentStep}
          isRunning={executionState.isRunning && !executionState.isPaused}
        />
      </main>
    </div>
  );
}

export default App;
