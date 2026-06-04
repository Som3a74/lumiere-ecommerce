"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#fafafa', color: '#111' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Critical System Error</h2>
          <p style={{ marginBottom: '24px', color: '#666' }}>We&apos;re sorry, but something went catastrophically wrong.</p>
          <button 
            onClick={() => reset()}
            style={{ padding: '12px 24px', backgroundColor: '#111', color: 'white', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
