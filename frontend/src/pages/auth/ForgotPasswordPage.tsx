import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setMessage(res.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center min-vh-80">
        <div className="col-lg-5 col-md-6">
          <div className="card border-0 shadow-lg p-4 animate-scale-in" style={{ borderRadius: '1rem' }}>
            <div className="text-center mb-4">
              <div className="mb-3">
                <i className="bi bi-key-fill" style={{ fontSize: '3rem', color: '#6366F1' }}></i>
              </div>
              <h1 className="h3 fw-bold gradient-text mb-2">Recuperar contraseña</h1>
              <p className="text-muted">Ingresa tu correo para recibir instrucciones de recuperación</p>
            </div>
            
            {message ? (
              <div className="alert alert-success border-0 shadow-sm animate-slide-in" style={{ background: '#ECFDF5', color: '#065F46' }}>
                <i className="bi bi-check-circle-fill me-2"></i>
                {message}
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-semibold">
                    <i className="bi bi-envelope-fill me-2" style={{ color: '#6366F1' }}></i>
                    Correo electrónico
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    className="form-control form-control-lg" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    placeholder="tu@email.com"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-lg w-100 fw-bold" 
                  style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', color: 'white', border: 'none' }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send-fill me-2"></i>
                      Enviar instrucciones
                    </>
                  )}
                </button>
              </form>
            )}
            
            <div className="text-center mt-4">
              <Link to="/login" className="fw-semibold text-decoration-none hover-lift" style={{ color: '#6366F1' }}>
                <i className="bi bi-arrow-left me-2"></i>
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
