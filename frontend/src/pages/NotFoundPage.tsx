import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center min-vh-80">
        <div className="col-md-8 text-center">
          <div className="card border-0 shadow-lg p-5 animate-scale-in" style={{ borderRadius: '1rem', background: 'linear-gradient(135deg, #F0F4FF 0%, #FFFFFF 100%)' }}>
            <div className="mb-4">
              <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>🐾</div>
              <h1 className="display-1 fw-bold gradient-text mb-2">404</h1>
              <h2 className="h2 mb-3 fw-bold">Página no encontrada</h2>
              <p className="lead text-muted mb-4">
                La página que buscas no existe o ha sido movida a otro lugar.
              </p>
            </div>

            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '0.75rem', background: 'white' }}>
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-info-circle-fill" style={{ fontSize: '1.5rem', color: '#6366F1' }}></i>
                <div className="text-start">
                  <strong className="d-block mb-1">¿Qué puedes hacer?</strong>
                  <p className="small text-muted mb-0">
                    Verifica la URL e intenta de nuevo, o regresa a la página principal para continuar navegando.
                  </p>
                </div>
              </div>
            </div>

            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/" className="btn btn-lg fw-bold" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', color: 'white', border: 'none' }}>
                <i className="bi bi-house-heart me-2" />
                Ir a inicio
              </Link>
              <Link to="/adopciones" className="btn btn-lg fw-semibold" style={{ color: '#6366F1', border: '2px solid #6366F1', background: 'transparent' }}>
                <i className="bi bi-paw me-2" />
                Ver adopciones
              </Link>
              <Link to="/mapa" className="btn btn-lg fw-semibold" style={{ color: '#10B981', border: '2px solid #10B981', background: 'transparent' }}>
                <i className="bi bi-map me-2" />
                Ver mapa
              </Link>
            </div>

            <div className="mt-5 pt-4" style={{ borderTop: '1px solid #E5E7EB' }}>
              <p className="text-muted small mb-0">
                ¿Necesitas ayuda? Contacta a <strong style={{ color: '#6366F1' }}>contacto@appdoptar.cl</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
