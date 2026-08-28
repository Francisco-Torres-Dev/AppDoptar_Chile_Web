import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export default function LoginPage() {
  const { login, loginGoogle } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password, remember);
      if (res.requires2FA && res.tempToken) {
        navigate('/verify-2fa', { state: { tempToken: res.tempToken } });
      } else {
        showToast('¡Bienvenido de vuelta!', 'success');
        navigate(from);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginGoogle();
      showToast('Sesión iniciada con Google', 'success');
      navigate(from);
    } catch {
      showToast('Error al iniciar sesión con Google', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center min-vh-80">
        <div className="col-lg-5 col-md-6">
          <div className="card border-0 shadow-lg p-4 animate-scale-in" style={{ borderRadius: 'var(--radius-xl)' }}>
            <div className="text-center mb-4">
              <div className="mb-3">
                <i className="bi bi-heart-pulse-fill" style={{ fontSize: '3rem', color: 'var(--primary)' }}></i>
              </div>
              <h1 className="h3 fw-bold gradient-text mb-2">Bienvenido de vuelta</h1>
              <p className="text-muted">Inicia sesión para continuar ayudando a mascotas</p>
            </div>
            
            {error && (
              <div className="alert alert-danger border-0 shadow-sm mb-4 animate-slide-in">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">
                  <i className="bi bi-envelope-fill me-1" style={{ color: 'var(--primary)' }}></i>
                  Correo electrónico
                </label>
                <input 
                  type="email" 
                  id="email" 
                  className="form-control form-control-lg" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  autoComplete="email" 
                  placeholder="tu@email.com"
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-semibold">
                  <i className="bi bi-lock-fill me-1" style={{ color: 'var(--primary)' }}></i>
                  Contraseña
                </label>
                <input 
                  type="password" 
                  id="password" 
                  className="form-control form-control-lg" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  autoComplete="current-password" 
                  placeholder="••••••••"
                />
              </div>
              
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input 
                    type="checkbox" 
                    className="form-check-input" 
                    id="remember" 
                    checked={remember} 
                    onChange={(e) => setRemember(e.target.checked)} 
                  />
                  <label className="form-check-label" htmlFor="remember">Recordarme</label>
                </div>
                <Link to="/forgot-password" className="small fw-semibold text-decoration-none hover-lift">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary btn-lg w-100 mb-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Ingresando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Iniciar sesión
                  </>
                )}
              </button>
            </form>
            
            <div className="text-center mb-3 position-relative">
              <hr className="my-3" />
              <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                o continúa con
              </span>
            </div>
            
            <button 
              type="button" 
              className="btn btn-outline-secondary btn-lg w-100 mb-4 fw-semibold" 
              onClick={handleGoogle} 
              disabled={loading}
            >
              <i className="bi bi-google me-2"></i>
              Google
            </button>
            
            <p className="text-center small mb-0 text-muted">
              ¿No tienes cuenta? 
              <Link to="/registro" className="fw-semibold text-decoration-none ms-1 hover-lift">
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
