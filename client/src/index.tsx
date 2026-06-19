import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider, message } from 'antd';
import './index.css';
import App from './FrontEnd/App';
import { antdShadcnTheme } from './theme/antdShadcnTheme';
import './i18n'; // Initialize i18n before rendering

// Configure global message settings
message.config({
  duration: 3,
  maxCount: 3,
});

type ErrorBoundaryState = {
  hasError: boolean;
  errorMessage: string;
};

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'Unknown frontend error',
    };
  }

  override componentDidCatch(error: Error): void {
    // Keep full stack in browser console for debugging.
    console.error('Frontend runtime error:', error);
  }

  override render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            padding: 24,
            background: '#fafafa',
            color: '#111827',
            fontFamily:
              'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
          }}
        >
          <div
            style={{
              maxWidth: 680,
              width: '100%',
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 10,
              padding: 20,
              boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: 8 }}>
              Frontend crashed while rendering
            </h2>
            <p style={{ marginTop: 0, marginBottom: 6 }}>
              Please copy this error message:
            </p>
            <code
              style={{
                display: 'block',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                background: '#f3f4f6',
                borderRadius: 6,
                padding: 10,
              }}
            >
              {this.state.errorMessage}
            </code>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ConfigProvider theme={antdShadcnTheme}>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </ConfigProvider>
  </React.StrictMode>
);
