import { useState } from 'react'
import Editor from '@monaco-editor/react'
import './App.css'

// Define Monaco language for Gen-Z Slang Lang
const setupGenzLanguage = (monaco: typeof import('monaco-editor')) => {
  // Register a new language
  monaco.languages.register({ id: 'genz' })

  // Register a tokens provider for the language
  monaco.languages.setMonarchTokensProvider('genz', {
    keywords: ['yeet', 'sus', 'bet', 'cap', 'tea', 'lowkey', 'vibe', 'fr', 'no_cap', 'slay', 'bop', 'skrt', 'spill', 'flex', 'yikes'],
    operators: ['=', '==', '>', '<', '>=', '<=', '!='],
    symbols: /[=><!~?:&|+\-*/%]+/,
    
    tokenizer: {
      root: [
        // Keywords
        [/\b(yeet|sus|bet|cap|tea|lowkey|vibe|fr|no_cap|slay|bop|skrt|flex|yikes)\b/i, 'keyword'],
        
        // Comments
        [/\/\/.*$/, 'comment'],
        [/\bspill\b.*$/, 'comment'],
        
        // Strings
        [/".*?"/, 'string'],
        
        // Numbers
        [/\b\d+(\.\d+)?\b/, 'number'],
        
        // Identifiers
        [/\b[a-zA-Z_][\w]*\b/, 'identifier'],
        
        // Brackets and Punctuation
        [/[{}[\]()]/, '@brackets'],
        [/[;,.]/, 'delimiter'],
        
        // Operators
        [/[=><!\-*/%+]+/, 'operator'],
      ]
    }
  })

  // Define the language configuration
  monaco.languages.setLanguageConfiguration('genz', {
    comments: {
      lineComment: '//',
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')']
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' }
    ]
  })
}

// Sample Gen-Z code
const initialCode = `// Welcome to Gen-Z Slang Lang!
// This is a simple example to get you started.

// Variable declaration
tea name = "bruh";
tea age = 20;

// Conditional statement
sus (age > 18) {
  yeet "You're an adult, " bop name;
} else {
  yeet "You're not an adult yet, " bop name;
}

// Loop example 
tea count = 0;
vibe (count < 5) {
  yeet "count: " bop count;
  count = count bop 1;
}

// Boolean values
tea is_cool = bet;
tea is_mid = cap;

// Math operations
tea a = 10;
tea b = 2;
tea sum = a bop b;     // Addition: 12
tea diff = a skrt b;   // Subtraction: 8
tea prod = a flex b;   // Multiplication: 20
tea quot = a yikes b;  // Division: 5

yeet "Math results:";
yeet "10 + 2 = " bop sum;
yeet "10 - 2 = " bop diff;
yeet "10 * 2 = " bop prod;
yeet "10 / 2 = " bop quot;

// Function definition
lowkey calculate_rizz(charisma, drip) {
  tea base = charisma flex drip;     // Multiplication
  tea bonus = base yikes 2;          // Division
  yeet base bop bonus bop 5;         // Addition
}

// Function call
tea rizz_level = calculate_rizz(5, 3);
yeet "Your rizz level is: " bop rizz_level;  // Output: Your rizz level is: 20 (15 + 7.5 + 5)
`;

function App() {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Handle code execution
  const handleRunCode = () => {
    setIsRunning(true);
    setOutput(['🔥 Running Gen-Z Slang Lang code...']);
    
    // Simulate execution delay
    setTimeout(() => {
      // Placeholder for actual execution - will be replaced with real interpreter
      const simulatedOutput = [
        'You\'re an adult, bruh',
        'count: 0',
        'count: 1', 
        'count: 2',
        'count: 3',
        'count: 4',
        'Math results:',
        '10 + 2 = 12',
        '10 - 2 = 8',
        '10 * 2 = 20',
        '10 / 2 = 5',
        'Your rizz level is: 20'
      ];
      
      setOutput(simulatedOutput);
      setIsRunning(false);
    }, 500);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-container">
          <h1>🤙 Gen-Z Slang Lang</h1>
        </div>
        <div className="actions">
          <button 
            className={`run-button ${isRunning ? 'running' : ''}`}
            onClick={handleRunCode}
            disabled={isRunning}
          >
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </header>

      <main className="editor-container">
        <section className="code-section">
          <Editor
            height="100%"
            defaultLanguage="genz"
            defaultValue={code}
            onChange={(value) => setCode(value || '')}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
            }}
            beforeMount={setupGenzLanguage}
          />
        </section>
        
        <section className="output-section">
          <h3>Output</h3>
          <div className="output-console">
            {output.map((line, index) => (
              <div key={index} className="output-line">{line}</div>
            ))}
          </div>
        </section>
      </main>
      
      <footer className="app-footer">
        <p>
          Gen-Z Slang Lang - A toy programming language with Gen-Z slang keywords.
          <a href="https://github.com/your-username/genz-lang" target="_blank" rel="noopener noreferrer">GitHub</a>
        </p>
      </footer>
    </div>
  )
}

export default App
