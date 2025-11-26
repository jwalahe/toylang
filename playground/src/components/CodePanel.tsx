import Editor, { type OnMount } from '@monaco-editor/react';
import { useRef, useEffect } from 'react';
import type { editor } from 'monaco-editor';

interface CodePanelProps {
  code: string;
  currentLine: number;
  onChange: (value: string) => void;
  isRunning: boolean;
}

// Setup VibeScript language for Monaco
const setupVibeScriptLanguage = (monaco: typeof import('monaco-editor')) => {
  // Register the language
  monaco.languages.register({ id: 'vibescript' });

  // Define tokens
  monaco.languages.setMonarchTokensProvider('vibescript', {
    keywords: [
      'hold', 'lock', 'say', 'ask', 'if', 'else',
      'bet', 'cap', 'keep', 'each', 'from', 'to', 'in',
      'skill', 'give', 'stop', 'skip', 'and', 'or', 'not',
      'try', 'caught', 'note'
    ],

    operators: ['=', '==', '!=', '>', '<', '>=', '<=', '+', '-', '*', '/', '%'],

    symbols: /[=><!~?:&|+\-*/%]+/,

    tokenizer: {
      root: [
        // Comments (note ...)
        [/\bnote\b.*$/, 'comment'],

        // Keywords
        [/\b(hold|lock|say|ask|if|else|bet|cap|keep|each|from|to|in|skill|give|stop|skip|and|or|not|try|caught)\b/, 'keyword'],

        // Strings
        [/"[^"]*"/, 'string'],

        // Numbers
        [/\b\d+(\.\d+)?\b/, 'number'],

        // Booleans
        [/\b(bet|cap)\b/, 'keyword.boolean'],

        // Identifiers
        [/\b[a-zA-Z_][\w]*\b/, 'identifier'],

        // Brackets
        [/[{}[\]()]/, '@brackets'],

        // Delimiters
        [/[;,.]/, 'delimiter'],

        // Operators
        [/[=><!\-*/%+]+/, 'operator'],
      ],
    },
  });

  // Language configuration
  monaco.languages.setLanguageConfiguration('vibescript', {
    comments: {
      lineComment: 'note',
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
    ],
  });

  // Custom theme for VibeScript
  monaco.editor.defineTheme('vibescript-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: 'ff6b9d', fontStyle: 'bold' },
      { token: 'keyword.boolean', foreground: 'c792ea', fontStyle: 'bold' },
      { token: 'string', foreground: 'c3e88d' },
      { token: 'number', foreground: 'f78c6c' },
      { token: 'comment', foreground: '6a7a8c', fontStyle: 'italic' },
      { token: 'identifier', foreground: '82aaff' },
      { token: 'operator', foreground: '89ddff' },
    ],
    colors: {
      'editor.background': '#0d1117',
      'editor.foreground': '#e6edf3',
      'editor.lineHighlightBackground': '#1a1f35',
      'editorLineNumber.foreground': '#484f58',
      'editorLineNumber.activeForeground': '#ff6b9d',
      'editor.selectionBackground': '#3b5998',
    },
  });
};

export function CodePanel({ code, currentLine, onChange, isRunning }: CodePanelProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<string[]>([]);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    setupVibeScriptLanguage(monaco);
    monaco.editor.setTheme('vibescript-dark');
  };

  // Update line highlighting when currentLine changes
  useEffect(() => {
    if (editorRef.current && currentLine > 0) {
      const editor = editorRef.current;

      // Remove old decorations
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);

      // Add new decoration for current line
      decorationsRef.current = editor.deltaDecorations([], [
        {
          range: {
            startLineNumber: currentLine,
            startColumn: 1,
            endLineNumber: currentLine,
            endColumn: 1,
          },
          options: {
            isWholeLine: true,
            className: 'current-line-highlight',
            glyphMarginClassName: 'current-line-glyph',
          },
        },
      ]);

      // Scroll to the current line
      editor.revealLineInCenter(currentLine);
    } else if (editorRef.current && currentLine === 0) {
      // Clear decorations when not running
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
    }
  }, [currentLine]);

  return (
    <div className="code-panel">
      <div className="panel-header">
        <span className="panel-icon">📝</span>
        <span className="panel-title">Code</span>
      </div>
      <div className="editor-wrapper">
        <Editor
          height="100%"
          defaultLanguage="vibescript"
          value={code}
          onChange={(value) => onChange(value || '')}
          onMount={handleEditorMount}
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            lineNumbers: 'on',
            glyphMargin: true,
            folding: false,
            lineDecorationsWidth: 10,
            readOnly: isRunning,
            renderLineHighlight: 'all',
          }}
        />
      </div>
    </div>
  );
}
