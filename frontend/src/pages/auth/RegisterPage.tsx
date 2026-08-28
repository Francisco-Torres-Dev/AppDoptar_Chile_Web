import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CHILE_REGIONS } from '../../utils/constants';
import { isStrongPassword, isValidEmail, isValidPhone, passwordsMatch, required } from '../../utils/validation';

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    phone: '', region: '', commune: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!required(form.firstName)) e.firstName = 'Nombre requerido';
    if (!required(form.lastName)) e.lastName = 'Apellido requerido';
    if (!isValidEmail(form.email)) e.email = 'Email inválido';
    if (!isStrongPassword(form.password)) e.password = 'Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo';
    if (!passwordsMatch(form.password, form.confirmPassword)) e.confirmPassword = 'Las contraseñas no coinciden';
    if (!isValidPhone(form.phone)) e.phone = 'Teléfono inválido';
    if (!required(form.region)) e.region = 'Región requerida';
    if (!required(form.commune)) e.commune = 'Comuna requerida';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const message = await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        phone: form.phone,
        region: form.region,
        commune: form.commune,
      });
      setSuccess(message);
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Error al registrar' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center align-items-center min-vh-80">
          <div className="col-md-6 text-center animate-scale-in">
            <div className="card border-0 shadow-lg p-5" style={{ borderRadius: 'var(--radius-xl)' }}>
              <div className="mb-4">
                <i className="bi bi-envelope-check display-1 text-success mb-3" style={{ fontSize: '4rem' }} />
              </div>
              <h1 className="h3 fw-bold gradient-text mb-3">{success}</h1>
              <p className="text-muted lead mb-4">Revisa tu bandeja de entrada para verificar tu cuenta y comenzar a ayudar a mascotas.</p>
              <Link to="/login" className="btn btn-lg fw-bold" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', color: 'white', border: 'none' }}>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Ir a iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center min-vh-80">
        <div className="col-lg-7 col-md-8">
          <div className="card border-0 shadow-lg p-4 animate-scale-in" style={{ borderRadius: 'var(--radius-xl)' }}>
            <div className="text-center mb-4">
              <div className="mb-3">
                <i className="bi bi-heart-pulse-fill" style={{ fontSize: '3rem', color: 'var(--primary)' }}></i>
              </div>
              <h1 className="h3 fw-bold gradient-text mb-2">Crear cuenta</h1>
              <p className="text-muted">Únete a nuestra comunidad y comienza a ayudar a mascotas</p>
            </div>
            
            {errors.form && (
              <div className="alert alert-danger border-0 shadow-sm mb-4 animate-slide-in">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {errors.form}
              </div>
            )}
            
            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="firstName" className="form-label fw-semibold">
                    <i className="bi bi-person-fill me-1" style={{ color: 'var(--primary)' }}></i>
                    Nombre
                  </label>
                  <input 
                    id="firstName" 
                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} 
                    value={form.firstName} 
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })} 
                    placeholder="Tu nombre"
                  />
                  {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                </div>
                <div className="col-md-6">
                  <label htmlFor="lastName" className="form-label fw-semibold">
                    <i className="bi bi-person-fill me-1" style={{ color: 'var(--primary)' }}></i>
                    Apellido
                  </label>
                  <input 
                    id="lastName" 
                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} 
                    value={form.lastName} 
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })} 
                    placeholder="Tu apellido"
                  />
                  {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                </div>
                <div className="col-12">
                  <label htmlFor="email" className="form-label fw-semibold">
                    <i className="bi bi-envelope-fill me-1" style={{ color: 'var(--primary)' }}></i>
                    Email
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                    value={form.email} 
                    onChange={(e) => setForm({ ...form, email: e.target.value })} 
                    placeholder="tu@email.com"
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="col-md-6">
                  <label htmlFor="password" className="form-label fw-semibold">
                    <i className="bi bi-lock-fill me-1" style={{ color: 'var(--primary)' }}></i>
                    Contraseña
                  </label>
                  <input 
                    type="password" 
                    id="password" 
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`} 
                    value={form.password} 
                    onChange={(e) => setForm({ ...form, password: e.target.value })} 
                    placeholder="••••••••"
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                <div className="col-md-6">
                  <label htmlFor="confirmPassword" className="form-label fw-semibold">
                    <i className="bi bi-lock-fill me-1" style={{ color: 'var(--primary)' }}></i>
                    Confirmar contraseña
                  </label>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} 
                    value={form.confirmPassword} 
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} 
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>
                <div className="col-md-6">
                  <label htmlFor="phone" className="form-label fw-semibold">
                    <i className="bi bi-telephone-fill me-1" style={{ color: 'var(--primary)' }}></i>
                    Teléfono
                  </label>
                  <input 
                    id="phone" 
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`} 
                    value={form.phone} 
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                    placeholder="+56912345678"
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>
                <div className="col-md-6">
                  <label htmlFor="region" className="form-label fw-semibold">
                    <i className="bi bi-geo-alt-fill me-1" style={{ color: 'var(--primary)' }}></i>
                    Región
                  </label>
                  <select 
                    id="region" 
                    className={`form-select ${errors.region ? 'is-invalid' : ''}`} 
                    value={form.region} 
                    onChange={(e) => setForm({ ...form, region: e.target.value })}
                  >
                    <option value="">Seleccionar...</option>
                    {CHILE_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {errors.region && <div className="invalid-feedback">{errors.region}</div>}
                </div>
                <div className="col-12">
                  <label htmlFor="commune" className="form-label fw-semibold">
                    <i className="bi bi-geo-alt-fill me-1" style={{ color: 'var(--primary)' }}></i>
                    Comuna
                  </label>
                  <input 
                    id="commune" 
                    className={`form-control ${errors.commune ? 'is-invalid' : ''}`} 
                    value={form.commune} 
                    onChange={(e) => setForm({ ...form, commune: e.target.value })} 
                    placeholder="Tu comuna"
                  />
                  {errors.commune && <div className="invalid-feedback">{errors.commune}</div>}
                </div>
              </div>
              <button 
                type="submit" 
                className="btn btn-lg w-100 mt-4 fw-bold" 
                style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', color: 'white', border: 'none' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Registrando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus-fill me-2"></i>
                    Crear cuenta
                  </>
                )}
              </button>
            </form>
            <p className="text-center small mt-4 mb-0 text-muted">
              ¿Ya tienes cuenta? 
              <Link to="/login" className="fw-semibold text-decoration-none ms-1 hover-lift">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
