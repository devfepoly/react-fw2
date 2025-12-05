/**
 * HTMLContent Component
 * Hiển thị nội dung HTML với styling đẹp mắt
 * Được dùng để render nội dung từ RichTextEditor
 */
const HTMLContent = ({ content, className = '' }) => {
    if (!content) return null;

    return (
        <div
            className={`html-content prose prose-slate dark:prose-invert max-w-none ${className}`}
            dangerouslySetInnerHTML={{ __html: content }}
            style={{
                // Custom styles để override prose defaults nếu cần
            }}
        />
    );
};

export default HTMLContent;

// CSS styles (thêm vào index.css hoặc component styles)
// .html-content h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; }
// .html-content h2 { font-size: 1.5em; font-weight: bold; margin: 0.75em 0; }
// .html-content h3 { font-size: 1.17em; font-weight: bold; margin: 0.83em 0; }
// .html-content h4 { font-size: 1em; font-weight: bold; margin: 1em 0; }
// .html-content h5 { font-size: 0.83em; font-weight: bold; margin: 1.17em 0; }
// .html-content h6 { font-size: 0.67em; font-weight: bold; margin: 1.33em 0; }
// .html-content p { margin: 1em 0; line-height: 1.6; }
// .html-content ul, .html-content ol { padding-left: 2rem; margin: 1em 0; }
// .html-content li { margin: 0.5em 0; }
// .html-content a { color: #2563eb; text-decoration: underline; }
// .html-content strong { font-weight: bold; }
// .html-content em { font-style: italic; }
// .html-content u { text-decoration: underline; }
// .html-content blockquote { border-left: 4px solid #2563eb; padding-left: 1rem; margin: 1rem 0; font-style: italic; }
