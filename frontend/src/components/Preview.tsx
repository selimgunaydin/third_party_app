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
    if (!iframeRef.current) return;

    // iframe içeriğini güncelle
    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    
    if (!doc) return;

    // HTML template oluştur
    const template = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            /* Reset CSS */
            *, *::before, *::after {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              line-height: 1.5;
            }
            /* Kullanıcının CSS'i */
            ${css}
          </style>
        </head>
        <body>
          ${html}
          <script>
            try {
              ${javascript}
            } catch (error) {
              console.error('Preview JavaScript Error:', error);
            }
          </script>
        </body>
      </html>
    `;

    // iframe içeriğini güncelle
    doc.open();
    doc.write(template);
    doc.close();
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