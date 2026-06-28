// TEMPORARY SIMPLE VERSION FOR DEBUGGING
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
      background: 'linear-gradient(to bottom, #1a1a2e, #16213e)'
    }}>
      <div>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#fff', marginBottom: '1rem' }}>
          🚀 Portfolio Site
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#94a3b8', marginBottom: '2rem' }}>
          Deployment test - If you see this, Next.js is working!
        </p>
        <div style={{ 
          background: '#0f172a', 
          padding: '1.5rem', 
          borderRadius: '0.5rem',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <p style={{ color: '#22d3ee', fontFamily: 'monospace', marginBottom: '0.5rem' }}>
            ✅ Next.js deployed successfully
          </p>
          <p style={{ color: '#22d3ee', fontFamily: 'monospace', marginBottom: '0.5rem' }}>
            ✅ Routing is working
          </p>
          <p style={{ color: '#fbbf24', fontFamily: 'monospace' }}>
            ⏳ Database connection pending
          </p>
        </div>
        <p style={{ marginTop: '2rem', color: '#64748b', fontSize: '0.875rem' }}>
          Check <a href="/api/test" style={{ color: '#3b82f6', textDecoration: 'underline' }}>/api/test</a> and{' '}
          <a href="/api/health" style={{ color: '#3b82f6', textDecoration: 'underline' }}>/api/health</a>
        </p>
      </div>
    </main>
  );
}
