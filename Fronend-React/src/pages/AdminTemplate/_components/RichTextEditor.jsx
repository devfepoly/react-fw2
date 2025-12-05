import { useRef, useEffect, useState } from 'react';

/**
 * RichTextEditor - Custom WYSIWYG Editor Component
 * Compatible với React 19
 * Hỗ trợ đầy đủ các tính năng định dạng văn bản:
 * ✓ Bold (In đậm)
 * ✓ Italic (In nghiêng)  
 * ✓ Underline (Gạch dưới)
 * ✓ Lists (Danh sách có thứ tự và không thứ tự)
 * ✓ Headers (Tiêu đề H1-H6)
 * ✓ Colors (Màu chữ)
 * ✓ Alignment (Căn lề)
 * ✓ Links (Liên kết)
 */
const RichTextEditor = ({
    label,
    value,
    onChange,
    placeholder = 'Nhập nội dung...',
    error,
    required = false,
    minHeight = '200px',
    className = ''
}) => {
    const editorRef = useRef(null);
    const [isActive, setIsActive] = useState({});

    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const executeCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        updateActiveStates();
        handleContentChange();
    };

    const updateActiveStates = () => {
        const states = {
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
            insertOrderedList: document.queryCommandState('insertOrderedList'),
            insertUnorderedList: document.queryCommandState('insertUnorderedList'),
            justifyLeft: document.queryCommandState('justifyLeft'),
            justifyCenter: document.queryCommandState('justifyCenter'),
            justifyRight: document.queryCommandState('justifyRight'),
        };
        setIsActive(states);
    };

    const handleContentChange = () => {
        if (editorRef.current && onChange) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const insertLink = () => {
        const url = prompt('Nhập URL:');
        if (url) {
            executeCommand('createLink', url);
        }
    };

    const changeColor = (color) => {
        executeCommand('foreColor', color);
    };

    const formatBlock = (tag) => {
        executeCommand('formatBlock', tag);
    };

    const handleKeyDown = (e) => {
        // Xử lý các phím tắt
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'b':
                    e.preventDefault();
                    executeCommand('bold');
                    break;
                case 'i':
                    e.preventDefault();
                    executeCommand('italic');
                    break;
                case 'u':
                    e.preventDefault();
                    executeCommand('underline');
                    break;
            }
        }
    };

    return (
        <div className={`rich-text-editor ${className}`}>
            {label && (
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}

            <div className={`editor-wrapper ${error ? 'has-error' : ''}`}>
                {/* Toolbar */}
                <div className="toolbar">
                    {/* Format Block */}
                    <select
                        onChange={(e) => formatBlock(e.target.value)}
                        className="format-select"
                        defaultValue=""
                    >
                        <option value="">Định dạng</option>
                        <option value="h1">Tiêu đề 1</option>
                        <option value="h2">Tiêu đề 2</option>
                        <option value="h3">Tiêu đề 3</option>
                        <option value="h4">Tiêu đề 4</option>
                        <option value="h5">Tiêu đề 5</option>
                        <option value="h6">Tiêu đề 6</option>
                        <option value="p">Đoạn văn</option>
                    </select>

                    <div className="separator"></div>

                    {/* Text Format */}
                    <button
                        type="button"
                        className={`toolbar-btn ${isActive.bold ? 'active' : ''}`}
                        onClick={() => executeCommand('bold')}
                        title="Bold (Ctrl+B)"
                    >
                        <strong>B</strong>
                    </button>
                    <button
                        type="button"
                        className={`toolbar-btn ${isActive.italic ? 'active' : ''}`}
                        onClick={() => executeCommand('italic')}
                        title="Italic (Ctrl+I)"
                    >
                        <em>I</em>
                    </button>
                    <button
                        type="button"
                        className={`toolbar-btn ${isActive.underline ? 'active' : ''}`}
                        onClick={() => executeCommand('underline')}
                        title="Underline (Ctrl+U)"
                    >
                        <u>U</u>
                    </button>

                    <div className="separator"></div>

                    {/* Colors */}
                    <div className="color-picker">
                        <input
                            type="color"
                            onChange={(e) => changeColor(e.target.value)}
                            title="Màu chữ"
                            className="color-input"
                        />
                    </div>

                    <div className="separator"></div>

                    {/* Alignment */}
                    <button
                        type="button"
                        className={`toolbar-btn ${isActive.justifyLeft ? 'active' : ''}`}
                        onClick={() => executeCommand('justifyLeft')}
                        title="Căn trái"
                    >
                        ⬅
                    </button>
                    <button
                        type="button"
                        className={`toolbar-btn ${isActive.justifyCenter ? 'active' : ''}`}
                        onClick={() => executeCommand('justifyCenter')}
                        title="Căn giữa"
                    >
                        ↔
                    </button>
                    <button
                        type="button"
                        className={`toolbar-btn ${isActive.justifyRight ? 'active' : ''}`}
                        onClick={() => executeCommand('justifyRight')}
                        title="Căn phải"
                    >
                        ➡
                    </button>

                    <div className="separator"></div>

                    {/* Lists */}
                    <button
                        type="button"
                        className={`toolbar-btn ${isActive.insertUnorderedList ? 'active' : ''}`}
                        onClick={() => executeCommand('insertUnorderedList')}
                        title="Danh sách không thứ tự"
                    >
                        • List
                    </button>
                    <button
                        type="button"
                        className={`toolbar-btn ${isActive.insertOrderedList ? 'active' : ''}`}
                        onClick={() => executeCommand('insertOrderedList')}
                        title="Danh sách có thứ tự"
                    >
                        1. List
                    </button>

                    <div className="separator"></div>

                    {/* Links */}
                    <button
                        type="button"
                        className="toolbar-btn"
                        onClick={insertLink}
                        title="Chèn liên kết"
                    >
                        🔗
                    </button>

                    {/* Clear */}
                    <button
                        type="button"
                        className="toolbar-btn"
                        onClick={() => executeCommand('removeFormat')}
                        title="Xóa định dạng"
                    >
                        Clear
                    </button>
                </div>

                {/* Editor */}
                <div
                    ref={editorRef}
                    contentEditable
                    className="editor-content"
                    onInput={handleContentChange}
                    onKeyDown={handleKeyDown}
                    onMouseUp={updateActiveStates}
                    onKeyUp={updateActiveStates}
                    data-placeholder={placeholder}
                    style={{ minHeight }}
                />
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}

            {/* Styles */}
            <style>{`
                .rich-text-editor .editor-wrapper {
                    border: 1px solid #d1d5db;
                    border-radius: 0.5rem;
                    overflow: hidden;
                    background: white;
                }

                .dark .rich-text-editor .editor-wrapper {
                    border-color: #475569;
                    background: #1e293b;
                }

                .rich-text-editor .editor-wrapper.has-error {
                    border-color: #ef4444 !important;
                }

                .rich-text-editor .toolbar {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.75rem;
                    background: #f9fafb;
                    border-bottom: 1px solid #d1d5db;
                    flex-wrap: wrap;
                }

                .dark .rich-text-editor .toolbar {
                    background: #334155;
                    border-bottom-color: #475569;
                }

                .rich-text-editor .toolbar-btn {
                    padding: 0.375rem 0.75rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.25rem;
                    background: white;
                    cursor: pointer;
                    font-size: 0.875rem;
                    transition: all 0.15s ease;
                }

                .dark .rich-text-editor .toolbar-btn {
                    background: #475569;
                    border-color: #64748b;
                    color: #e2e8f0;
                }

                .rich-text-editor .toolbar-btn:hover {
                    background: #f3f4f6;
                    border-color: #9ca3af;
                }

                .dark .rich-text-editor .toolbar-btn:hover {
                    background: #64748b;
                    border-color: #94a3b8;
                }

                .rich-text-editor .toolbar-btn.active {
                    background: #2563eb;
                    border-color: #2563eb;
                    color: white;
                }

                .rich-text-editor .format-select {
                    padding: 0.375rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.25rem;
                    background: white;
                    font-size: 0.875rem;
                }

                .dark .rich-text-editor .format-select {
                    background: #475569;
                    border-color: #64748b;
                    color: #e2e8f0;
                }

                .rich-text-editor .color-input {
                    width: 2rem;
                    height: 1.875rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.25rem;
                    cursor: pointer;
                }

                .dark .rich-text-editor .color-input {
                    border-color: #64748b;
                }

                .rich-text-editor .separator {
                    width: 1px;
                    height: 1.5rem;
                    background: #d1d5db;
                    margin: 0 0.25rem;
                }

                .dark .rich-text-editor .separator {
                    background: #64748b;
                }

                .rich-text-editor .editor-content {
                    padding: 1rem;
                    min-height: ${minHeight};
                    outline: none;
                    line-height: 1.6;
                    color: #374151;
                }

                .dark .rich-text-editor .editor-content {
                    color: #e2e8f0;
                }

                .rich-text-editor .editor-content:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                }

                .dark .rich-text-editor .editor-content:empty:before {
                    color: #64748b;
                }

                /* Content styling */
                .rich-text-editor .editor-content h1 {
                    font-size: 2em;
                    font-weight: bold;
                    margin: 0.5em 0;
                }

                .rich-text-editor .editor-content h2 {
                    font-size: 1.5em;
                    font-weight: bold;
                    margin: 0.5em 0;
                }

                .rich-text-editor .editor-content h3 {
                    font-size: 1.25em;
                    font-weight: bold;
                    margin: 0.5em 0;
                }

                .rich-text-editor .editor-content h4 {
                    font-size: 1.125em;
                    font-weight: bold;
                    margin: 0.5em 0;
                }

                .rich-text-editor .editor-content h5 {
                    font-size: 1em;
                    font-weight: bold;
                    margin: 0.5em 0;
                }

                .rich-text-editor .editor-content h6 {
                    font-size: 0.875em;
                    font-weight: bold;
                    margin: 0.5em 0;
                }

                .rich-text-editor .editor-content p {
                    margin: 0.5em 0;
                }

                .rich-text-editor .editor-content ul,
                .rich-text-editor .editor-content ol {
                    margin: 0.5em 0;
                    padding-left: 2rem;
                }

                .rich-text-editor .editor-content li {
                    margin: 0.25em 0;
                }

                .rich-text-editor .editor-content a {
                    color: #2563eb;
                    text-decoration: underline;
                }

                .dark .rich-text-editor .editor-content a {
                    color: #60a5fa;
                }

                .rich-text-editor .editor-content blockquote {
                    border-left: 4px solid #2563eb;
                    padding-left: 1rem;
                    margin: 1rem 0;
                    font-style: italic;
                    color: #6b7280;
                }

                .dark .rich-text-editor .editor-content blockquote {
                    border-left-color: #60a5fa;
                    color: #9ca3af;
                }
            `}</style>
        </div>
    );
};

export default RichTextEditor;
