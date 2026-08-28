import { Link } from 'react-router-dom';

export default function ForbiddenPage() {
  return (
    <div className="container py-5 text-center">
      <div className="auth-card mx-auto">
        <p className="display-6 mb-2">403</p>
        <h1 className="h3 mb-3">No tienes acceso a esta sección</h1>
        <p className="text-muted">Tu cuenta no tiene los permisos necesarios.</p>
        <Link to="/" className="btn btn-primary">Volver al inicio</Link>
      </div>
    </div>
  );
}
