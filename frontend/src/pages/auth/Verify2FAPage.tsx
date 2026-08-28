import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export default function Verify2FAPage() {
  const { verify2FA } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const tempToken = (location.state as { tempToken?: string })?.tempToken || '';
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempToken) {
      setError('Sesión expirada. Inicia sesión nuevamente.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await verify2FA(tempToken, code);
      showToast('Verificación exitosa', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Código incorrecto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 text-center">
            <i className="bi bi-shield-lock display-4 text-primary mb-3" />
            <h1 className="h4">Verificación en dos pasos</h1>
            <p className="text-muted small">Ingresa el código de 6 dígitos enviado a tu correo.</p>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="form-control form-control-lg text-center mb-3"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                aria-label="Código OTP"
              />
              <button type="submit" className="btn btn-primary w-100" disabled={loading || code.length !== 6}>
                {loading ? 'Verificando...' : 'Verificar'}
              </button>
            </form>
            <Link to="/login" className="small mt-3 d-block">Volver al login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
