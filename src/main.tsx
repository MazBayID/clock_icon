import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryState {
  error: string | null;
}

class AppErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error: error?.stack || error?.message || String(error) };
  }

  componentDidCatch(error: Error, _info: ErrorInfo) {
    console.error('ChronoGlyph render failed:', error);
  }

  render() {
    if (this.state.error) {
      return (
        <main style={{ minHeight: '100vh', padding: 32, boxSizing: 'border-box', background: '#090A0D', color: '#F2F4F8', fontFamily: 'system-ui, sans-serif' }}>
          <h1 style={{ fontSize: 20, color: '#fff' }}>ChronoGlyph Studio gagal dirender</h1>
          <p>Detail error dari React:</p>
          <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', padding: 14, background: '#171a22', border: '1px solid #394150', borderRadius: 8, color: '#fca5a5' }}>{this.state.error}</pre>
          <p>Kirim tangkapan layar pesan ini agar penyebabnya bisa diperbaiki.</p>
        </main>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Elemen #root tidak ditemukan di index.html');
}

createRoot(rootElement).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>,
);
