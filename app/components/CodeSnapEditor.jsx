'use client';

import React, { useState } from 'react';
import { Layout, Palette, Download, Share, Copy, Circle } from 'lucide-react';

const CodeSnapEditor = () => {
  const [code, setCode] = useState(
    'function helloWorld() {\n  console.log("Hello, CodeSnap!");\n}'
  );
  const [language, setLanguage] = useState('javascript');
  const [gradient, setGradient] = useState('yellow-orange');
  const [size, setSize] = useState('default');
  const [theme, setTheme] = useState('monokai');

  const gradients = {
    'yellow-orange': 'bg-gradient-to-r from-yellow-300 to-orange-400',
    'blue-purple': 'bg-gradient-to-r from-blue-400 to-purple-500',
    'green-blue': 'bg-gradient-to-r from-green-400 to-blue-500',
    'pink-purple': 'bg-gradient-to-r from-pink-400 to-purple-500',
    'orange-red': 'bg-gradient-to-r from-orange-400 to-red-500',
  };

  const sizes = {
    small: 'max-w-2xl',
    default: 'max-w-4xl',
    large: 'max-w-6xl',
    full: 'max-w-full',
  };

  const themes = {
    monokai: {
      bg: 'bg-gray-900',
      text: 'text-gray-50',
      keyword: 'text-purple-400',
      string: 'text-green-400',
      comment: 'text-gray-500',
      function: 'text-blue-400',
      number: 'text-orange-400',
      operator: 'text-yellow-400',
      punctuation: 'text-gray-400',
    },
    'github-light': {
      bg: 'bg-white',
      text: 'text-gray-900',
      keyword: 'text-purple-600',
      string: 'text-green-600',
      comment: 'text-gray-500',
      function: 'text-blue-600',
      number: 'text-orange-600',
      operator: 'text-yellow-600',
      punctuation: 'text-gray-600',
    },
    nord: {
      bg: 'bg-slate-900',
      text: 'text-blue-100',
      keyword: 'text-blue-400',
      string: 'text-green-400',
      comment: 'text-gray-400',
      function: 'text-cyan-400',
      number: 'text-orange-400',
      operator: 'text-blue-300',
      punctuation: 'text-gray-400',
    },
  };

  // Custom syntax highlighting function
  const highlightCode = (code) => {
    if (!code) return [];

    const jsPatterns = {
      keyword:
        /\b(const|let|var|function|return|if|else|for|while|do|class|extends|import|export|default|null|undefined|true|false)\b/g,
      string: /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g,
      comment: /\/\/.*$/gm,
      function: /\b\w+(?=\s*\()/g,
      number: /\b\d+\b/g,
      operator: /[+\-*/%=<>!&|^~?:]+/g,
      punctuation: /[{}[\]();,]/g,
    };

    const pythonPatterns = {
      keyword:
        /\b(def|class|if|else|elif|for|while|try|except|import|from|as|return|True|False|None)\b/g,
      string: /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g,
      comment: /#.*$/gm,
      function: /\b\w+(?=\s*\()/g,
      number: /\b\d+\b/g,
      operator: /[+\-*/%=<>!&|^~?:]+/g,
      punctuation: /[{}[\]();,]/g,
    };

    const patterns = language === 'javascript' ? jsPatterns : pythonPatterns;
    const lines = code.split('\n');

    return lines.map((line) => {
      let spans = [];
      let currentIndex = 0;

      Object.entries(patterns).forEach(([type, pattern]) => {
        pattern.lastIndex = 0;
        let match;

        while ((match = pattern.exec(line)) !== null) {
          if (match.index > currentIndex) {
            spans.push({
              text: line.slice(currentIndex, match.index),
              type: 'plain',
            });
          }

          spans.push({
            text: match[0],
            type: type,
          });

          currentIndex = pattern.lastIndex;
        }
      });

      if (currentIndex < line.length) {
        spans.push({
          text: line.slice(currentIndex),
          type: 'plain',
        });
      }

      return spans;
    });
  };

  const getTokenColor = (type) => {
    return themes[theme][type] || themes[theme].text;
  };

  // Size selector popup
  const [showSizePopup, setShowSizePopup] = useState(false);
  const [showThemePopup, setShowThemePopup] = useState(false);

  return (
    <div className={`w-full ${sizes[size]} mx-auto p-6 space-y-6`}>
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={gradient}
              onChange={(e) => setGradient(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.keys(gradients).map((g) => (
                <option key={g} value={g}>
                  {g.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
            <Copy className="w-4 h-4 inline mr-2" />
            Copy
          </button>
          <button className="px-4 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">
            <Download className="w-4 h-4 inline mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className={`relative p-8 rounded-lg ${gradients[gradient]}`}>
        <div
          className={`relative ${themes[theme].bg} rounded-lg shadow-lg overflow-hidden`}
        >
          {/* Window Controls */}
          <div className="flex items-center px-4 py-3 bg-opacity-50 bg-black border-b border-opacity-20 border-white">
            <div className="flex space-x-2">
              <Circle className="w-3 h-3 text-red-500" fill="currentColor" />
              <Circle className="w-3 h-3 text-yellow-500" fill="currentColor" />
              <Circle className="w-3 h-3 text-green-500" fill="currentColor" />
            </div>
            <span className="ml-4 text-sm text-gray-400">
              {language === 'javascript' ? 'script.js' : 'main.py'}
            </span>
          </div>

          {/* Code Editor */}
          <div
            className="relative"
            style={{ maxHeight: '500px', overflowY: 'auto' }}
          >
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-4 font-mono text-sm bg-transparent text-transparent caret-white absolute inset-0 resize-none focus:outline-none hide-scrollbar"
              spellCheck="false"
              style={{
                lineHeight: '1.5',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            />
            <pre className="p-4 font-mono text-sm whitespace-pre-wrap break-words">
              {highlightCode(code).map((line, lineIndex) => (
                <div key={lineIndex} className="whitespace-pre-wrap">
                  {line.map((span, spanIndex) => (
                    <span key={spanIndex} className={getTokenColor(span.type)}>
                      {span.text}
                    </span>
                  ))}
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex justify-between items-center bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              onClick={() => setShowSizePopup(!showSizePopup)}
            >
              <Layout className="w-4 h-4 inline mr-2" />
              Size
            </button>
            {showSizePopup && (
              <div className="absolute mt-2 py-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                {Object.entries(sizes).map(([sizeKey, value]) => (
                  <button
                    key={sizeKey}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      size === sizeKey
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setSize(sizeKey);
                      setShowSizePopup(false);
                    }}
                  >
                    {sizeKey.charAt(0).toUpperCase() + sizeKey.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              onClick={() => setShowThemePopup(!showThemePopup)}
            >
              <Palette className="w-4 h-4 inline mr-2" />
              Theme
            </button>
            {showThemePopup && (
              <div className="absolute mt-2 py-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                {Object.keys(themes).map((themeKey) => (
                  <button
                    key={themeKey}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      theme === themeKey
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setTheme(themeKey);
                      setShowThemePopup(false);
                    }}
                  >
                    {themeKey
                      .split('-')
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(' ')}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <button className="px-4 py-1.5 text-sm font-medium text-white bg-purple-500 rounded-md hover:bg-purple-600">
          <Share className="w-4 h-4 inline mr-2" />
          Share
        </button>
      </div>
    </div>
  );
};

export default CodeSnapEditor;
