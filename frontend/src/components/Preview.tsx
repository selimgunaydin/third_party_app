import { useEffect, useRef } from 'react';

interface PreviewProps {
  html: string;
  css: string;
  javascript: string;
  className?: string;
  height?: string;
}

export default function Preview({ html, css, javascript, className = '', height = 'min-h-[300px]' }: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Update iframe content
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Create HTML template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 1rem;
              font-family: system-ui, -apple-system, sans-serif;
            }

            /* User's CSS */
            ${css}
          </style>
        </head>
        <body>
          ${html}
          <script>${javascript}</script>
        </body>
      </html>
    `;

    // Update iframe content
    const doc = iframe.contentDocument;
    doc?.open();
    doc?.write(htmlTemplate);
    doc?.close();
  }, [html, css, javascript]);

  return (
    <div className={`preview-container ${className}`}>
      <iframe
        ref={iframeRef}
        className={`w-full h-full ${height} border-0 rounded`}
        title="Component Preview"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
} 