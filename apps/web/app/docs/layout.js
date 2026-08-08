import Link from 'next/link';

export default function DocsLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', color: '#e5e7eb' }}>
      <nav style={{ width: '280px', borderRight: '1px solid #333', padding: '2rem' }}>
        <h2 style={{ marginBottom: '2rem', color: 'white' }}>Documentation</h2>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <li>
            <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>← Back to App</Link>
          </li>
          <li style={{ marginTop: '1rem' }}>
            <Link href="/docs/sdk" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>SDK Docs</Link>
          </li>
          <li>
            <Link href="/docs/components" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>Components Docs</Link>
          </li>
        </ul>
      </nav>
      <main style={{ flex: 1, padding: '3rem 4rem', overflowY: 'auto' }}>
        <div className="markdown-body" style={{ maxWidth: '800px' }}>
          {children}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .markdown-body h1, .markdown-body h2, .markdown-body h3 {
          color: white;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .markdown-body h1 { font-size: 2.5rem; border-bottom: 1px solid #333; padding-bottom: 0.5rem; }
        .markdown-body h2 { font-size: 1.8rem; }
        .markdown-body h3 { font-size: 1.4rem; }
        .markdown-body p { margin-bottom: 1rem; line-height: 1.6; }
        .markdown-body ul { margin-left: 2rem; margin-bottom: 1rem; list-style-type: disc; }
        .markdown-body code { background: #222; padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; font-size: 0.9em; }
        .markdown-body pre { background: #1a1a1a; padding: 1.5rem; border-radius: 8px; overflow-x: auto; margin: 1.5rem 0; border: 1px solid #333; }
        .markdown-body pre code { background: none; padding: 0; border-radius: 0; font-size: 0.95em; }
        .markdown-body blockquote { border-left: 4px solid #444; padding-left: 1rem; color: #aaa; font-style: italic; margin: 1.5rem 0; }
        .markdown-body a { color: #3b82f6; text-decoration: none; }
        .markdown-body a:hover { text-decoration: underline; }
      ` }} />
    </div>
  );
}
