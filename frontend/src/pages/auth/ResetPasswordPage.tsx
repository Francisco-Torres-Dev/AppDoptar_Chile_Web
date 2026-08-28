import { useState } from 'react';
import { Link, useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import { isStrongPassword, passwordsMatch } from '../../utils/validation';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const route = useParams();
  const navigate = useNavigate();
  const token = params.get('token') || route.token || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStrongPassword(password)) {
      setError('La contraseña no cumple los requisitos de seguridad');
      return;
    }
    if (!passwordsMatch(password, confirm)) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al restablecer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card border-0 shadow-sm p-4">
            <h1 className="h4 mb-3">Nueva contraseña</h1>
            {success ? (
              <div className="alert alert-success">Contraseña actualizada. Redirigiendo...</div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Nueva contraseña</label>
                  <input type="password" id="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirm" className="form-label">Confirmar contraseña</label>
                  <input type="password" id="confirm" className="form-control" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading || !token}>
                  {loading ? 'Guardando...' : 'Restablecer contraseña'}
                </button>
              </form>
            )}
            <Link to="/login" className="small d-block mt-3">Volver al login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
