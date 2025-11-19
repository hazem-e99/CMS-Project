import React, { useState, useRef, useEffect, useTransition } from 'react';

/**
 * Rich Text Editor Component
 * Simple HTML editor with basic formatting toolbar
 * Fallback solution compatible with all React versions
 */
export const RichTextEditor = ({
  value,
  onChange,
  label,
  error,
  placeholder = 'Enter text...',
  required = false,
  height = '200px',
}) => {
  const [mode, setMode] = useState('visual'); // 'visual' or 'html'
  const [content, setContent] = useState(value || '');
  const textareaRef = useRef(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      setContent(value || '');
    });
  }, [value, startTransition]);

  const handleContentChange = (newContent) => {
    setContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  const wrapSelection = (before, after = before) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newContent =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    handleContentChange(newContent);

    // Restore selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      );
    }, 0);
  };

  const insertTag = (tag) => {
    wrapSelection(`<${tag}>`, `</${tag}>`);
  };

  const insertParagraph = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const newContent =
      content.substring(0, start) +
      '\n<p></p>\n' +
      content.substring(start);
    
    handleContentChange(newContent);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Toolbar */}
      <div className="border border-gray-300 dark:border-gray-600 rounded-t-lg bg-gray-50 dark:bg-gray-700 p-2 flex items-center gap-1 flex-wrap">
        <button
          type="button"
          onClick={() => insertTag('strong')}
          className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded font-bold"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => insertTag('em')}
          className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded italic"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => insertTag('u')}
          className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded underline"
          title="Underline"
        >
          U
        </button>
        <span className="mx-1 text-gray-400">|</span>
        <button
          type="button"
          onClick={() => insertTag('h2')}
          className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => insertTag('h3')}
          className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title="Heading 3"
        >
          H3
        </button>
        <span className="mx-1 text-gray-400">|</span>
        <button
          type="button"
          onClick={insertParagraph}
          className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title="Paragraph"
        >
          ¶
        </button>
        <button
          type="button"
          onClick={() => insertTag('ul')}
          className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title="List"
        >
          • List
        </button>
        <span className="mx-1 text-gray-400">|</span>
        <button
          type="button"
          onClick={() => setMode(mode === 'visual' ? 'html' : 'visual')}
          className="px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title="Toggle HTML view"
        >
          {mode === 'visual' ? '< >' : 'Visual'}
        </button>
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border-x border-b border-gray-300 dark:border-gray-600 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white font-mono text-sm resize-vertical"
        style={{ minHeight: height }}
      />

      {/* Preview (if in visual mode) */}
      {mode === 'visual' && content && (
        <div className="mt-2 p-3 border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Preview:</div>
          <div
            className="prose dark:prose-invert max-w-none text-sm"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}

      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Tip: You can use HTML tags. Click buttons to insert tags around selected text.
      </p>
    </div>
  );
};

