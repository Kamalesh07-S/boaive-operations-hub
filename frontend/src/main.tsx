import { StrictMode, Component, ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Error boundary to show a visible error instead of a white page
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      const err = this.state.error as Error;
      return (
        <div style={{ padding: '2rem', fontFamily: 'monospace', background: '#0f172a', color: '#f87171', minHeight: '100vh' }}>
          <h1 style={{ color: '#06b6d4', marginBottom: '1rem' }}>⚠ Boaive — App Error</h1>
          <p style={{ marginBottom: '0.5rem', color: '#94a3b8' }}>Something went wrong. Check the console for details.</p>
          <pre style={{ background: '#1e293b', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto', fontSize: '0.85rem' }}>
            {err.message}{'\n\n'}{err.stack}
          </pre>
          <button onClick={() => window.location.reload()}
            style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', background: '#06b6d4', color: '#000', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found in index.html');

createRoot(rootEl).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

