import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error);
    console.error('Error info:', info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="alert alert-danger border">
                <div className="mb-4">
                  <h1 className="display-6 text-danger mb-2">⚠️ Algo salió mal</h1>
                  <p className="lead text-muted mb-0">
                    Ha ocurrido un error inesperado. Intenta recargar la página o vuelve a intentar más tarde.
                  </p>
                </div>

                {this.state.error && (
                  <div className="alert alert-light mb-4" style={{ fontSize: '0.875rem' }}>
                    <strong>Detalles técnicos:</strong>
                    <pre className="mb-0 text-danger" style={{ fontSize: '0.75rem', overflow: 'auto' }}>
                      {this.state.error.message}
                    </pre>
                  </div>
                )}

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.handleReset}
                  >
                    <i className="bi bi-arrow-clockwise me-2" />
                    Intentar de nuevo
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => window.location.href = '/'}
                  >
                    <i className="bi bi-house-heart me-2" />
                    Ir a inicio
                  </button>
                </div>
              </div>

              <div className="mt-4 p-4 bg-light border rounded">
                <p className="text-muted small mb-0">
                  Si el problema persiste, contacta a <strong>contacto@appdoptar.cl</strong> 
                  o describe el error que acabas de ver.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
