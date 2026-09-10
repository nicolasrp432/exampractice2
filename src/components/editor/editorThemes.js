// src/components/editor/editorThemes.js

export const THEME_LIST = [
  { id: 'vs-dark', name: 'VS Code Dark Modern', category: 'dark', bg: '#1e1e1e', fg: '#d4d4d4' },
  { id: 'vs', name: 'VS Code Light Modern', category: 'light', bg: '#ffffff', fg: '#000000' },
  { id: 'one-dark-pro', name: 'One Dark Pro', category: 'dark', bg: '#282c34', fg: '#abb2bf' },
  { id: 'dracula', name: 'Dracula', category: 'dark', bg: '#282a36', fg: '#f8f8f2' },
  { id: 'monokai', name: 'Monokai Classic', category: 'dark', bg: '#272822', fg: '#f8f8f2' },
  { id: 'github-dark', name: 'GitHub Dark', category: 'dark', bg: '#0d1117', fg: '#c9d1d9' },
  { id: 'github-light', name: 'GitHub Light', category: 'light', bg: '#ffffff', fg: '#24292f' },
  { id: 'nord', name: 'Nord Arctic', category: 'dark', bg: '#2e3440', fg: '#d8dee9' },
  { id: 'tokyo-night', name: 'Tokyo Night', category: 'dark', bg: '#1a1b26', fg: '#a9b1d6' },
  { id: 'hc-black', name: 'High Contrast Dark', category: 'dark', bg: '#000000', fg: '#ffffff' },
]

export const LANGUAGE_LIST = [
  { id: 'c', name: 'C (Norma 42 / C99)', ext: '.c' },
  { id: 'cpp', name: 'C++ (42 C++98 / Modern)', ext: '.cpp' },
  { id: 'shell', name: 'Shell / Bash (42 Scripts)', ext: '.sh' },
  { id: 'python', name: 'Python', ext: '.py' },
  { id: 'plaintext', name: 'Texto Plano', ext: '.txt' },
]

export function registerCustomMonacoThemes(monaco) {
  if (!monaco || !monaco.editor) return

  // 1. One Dark Pro
  monaco.editor.defineTheme('one-dark-pro', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'c678dd' },
      { token: 'type', foreground: 'e5c07b' },
      { token: 'string', foreground: '98c379' },
      { token: 'number', foreground: 'd19a66' },
      { token: 'delimiter', foreground: 'abb2bf' },
      { token: 'identifier', foreground: 'e06c75' },
      { token: 'function', foreground: '61afef' },
    ],
    colors: {
      'editor.background': '#282c34',
      'editor.foreground': '#abb2bf',
      'editorCursor.foreground': '#528bff',
      'editor.lineHighlightBackground': '#2c313a',
      'editorLineNumber.foreground': '#4b5263',
      'editorLineNumber.activeForeground': '#abb2bf',
      'editor.selectionBackground': '#3e4451',
    },
  })

  // 2. Dracula
  monaco.editor.defineTheme('dracula', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ff79c6' },
      { token: 'type', foreground: '8be9fd' },
      { token: 'string', foreground: 'f1fa8c' },
      { token: 'number', foreground: 'bd93f9' },
      { token: 'identifier', foreground: '50fa7b' },
      { token: 'function', foreground: '50fa7b' },
    ],
    colors: {
      'editor.background': '#282a36',
      'editor.foreground': '#f8f8f2',
      'editorCursor.foreground': '#f8f8f0',
      'editor.lineHighlightBackground': '#44475a50',
      'editorLineNumber.foreground': '#6272a4',
      'editorLineNumber.activeForeground': '#f8f8f2',
      'editor.selectionBackground': '#44475a',
    },
  })

  // 3. Monokai
  monaco.editor.defineTheme('monokai', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '75715e', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'f92672' },
      { token: 'type', foreground: '66d9ef' },
      { token: 'string', foreground: 'e6db74' },
      { token: 'number', foreground: 'ae81ff' },
      { token: 'identifier', foreground: 'a6e22e' },
      { token: 'function', foreground: 'a6e22e' },
    ],
    colors: {
      'editor.background': '#272822',
      'editor.foreground': '#f8f8f2',
      'editorCursor.foreground': '#f8f8f0',
      'editor.lineHighlightBackground': '#3e3d32',
      'editorLineNumber.foreground': '#90908a',
      'editorLineNumber.activeForeground': '#f8f8f2',
      'editor.selectionBackground': '#49483e',
    },
  })

  // 4. GitHub Dark
  monaco.editor.defineTheme('github-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '8b949e', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ff7b72' },
      { token: 'type', foreground: '79c0ff' },
      { token: 'string', foreground: 'a5d6ff' },
      { token: 'number', foreground: '79c0ff' },
      { token: 'identifier', foreground: 'd2a8ff' },
      { token: 'function', foreground: 'd2a8ff' },
    ],
    colors: {
      'editor.background': '#0d1117',
      'editor.foreground': '#c9d1d9',
      'editorCursor.foreground': '#58a6ff',
      'editor.lineHighlightBackground': '#161b22',
      'editorLineNumber.foreground': '#6e7681',
      'editorLineNumber.activeForeground': '#c9d1d9',
      'editor.selectionBackground': '#264f78',
    },
  })

  // 5. GitHub Light
  monaco.editor.defineTheme('github-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6e7781', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'cf222e' },
      { token: 'type', foreground: '0550ae' },
      { token: 'string', foreground: '0a3069' },
      { token: 'number', foreground: '0550ae' },
      { token: 'identifier', foreground: '8250df' },
      { token: 'function', foreground: '8250df' },
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#24292f',
      'editorCursor.foreground': '#0969da',
      'editor.lineHighlightBackground': '#f6f8fa',
      'editorLineNumber.foreground': '#8c959f',
      'editorLineNumber.activeForeground': '#24292f',
      'editor.selectionBackground': '#b6e3ff80',
    },
  })

  // 6. Nord
  monaco.editor.defineTheme('nord', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '616e88', fontStyle: 'italic' },
      { token: 'keyword', foreground: '81a1c1' },
      { token: 'type', foreground: '8fbcbb' },
      { token: 'string', foreground: 'a3be8c' },
      { token: 'number', foreground: 'b48ead' },
      { token: 'identifier', foreground: '88c0d0' },
      { token: 'function', foreground: '88c0d0' },
    ],
    colors: {
      'editor.background': '#2e3440',
      'editor.foreground': '#d8dee9',
      'editorCursor.foreground': '#d8dee9',
      'editor.lineHighlightBackground': '#3b4252',
      'editorLineNumber.foreground': '#4c566a',
      'editorLineNumber.activeForeground': '#eceff4',
      'editor.selectionBackground': '#434c5e',
    },
  })

  // 7. Tokyo Night
  monaco.editor.defineTheme('tokyo-night', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '565f89', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'bb9af7' },
      { token: 'type', foreground: '2ac3de' },
      { token: 'string', foreground: '9ece6a' },
      { token: 'number', foreground: 'ff9e64' },
      { token: 'identifier', foreground: '7aa2f7' },
      { token: 'function', foreground: '7aa2f7' },
    ],
    colors: {
      'editor.background': '#1a1b26',
      'editor.foreground': '#a9b1d6',
      'editorCursor.foreground': '#c0caf5',
      'editor.lineHighlightBackground': '#24283b',
      'editorLineNumber.foreground': '#3b4261',
      'editorLineNumber.activeForeground': '#7aa2f7',
      'editor.selectionBackground': '#283457',
    },
  })
}
