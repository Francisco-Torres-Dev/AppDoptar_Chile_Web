import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { reportService } from '../services/reportService';
import type { ReportType, ReportUrgency } from '../types';

export default function CreateReportPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    type: 'herido' as ReportType,
    description: '',
    latitude: -33.4489,
    longitude: -70.6693,
    address: '',
    commune: 'Santiago',
    region: 'Metropolitana',
    urgency: 'alto' as ReportUrgency,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'latitude' || name === 'longitude' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.description.trim()) {
      showToast('Por favor describe la situación', 'warning');
      return;
    }

    if (!user) {
      showToast('Debes iniciar sesión para crear un reporte', 'error');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      await reportService.create({
        type: form.type,
        description: form.description,
        images: [],
        latitude: form.latitude,
        longitude: form.longitude,
        address: form.address,
        commune: form.commune,
        region: form.region,
        urgency: form.urgency,
        reporterId: user.id,
        isDemo: true,
      });
      showToast('¡Reporte creado exitosamente! Gracias por ayudar.', 'success');
      navigate('/mapa');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al crear el reporte', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">Sesión requerida</h4>
          <p>Debes iniciar sesión para reportar una emergencia. Esto nos ayuda a validar reports y contactarte si es necesario.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Breadcrumbs items={[{ label: 'Mapa', to: '/mapa' }, { label: 'Reportar emergencia' }]} />
      
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-danger text-white py-4">
              <h1 className="h3 mb-0">
                <i className="bi bi-exclamation-circle me-2" />
                Reportar emergencia animal
              </h1>
              <p className="text-white-50 mb-0 mt-2">Tu reporte ayudará a salvar una vida</p>
            </div>

            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* Tipo de reporte */}
                <div className="mb-4">
                  <label htmlFor="type" className="form-label fw-bold">
                    <i className="bi bi-tag me-2" />
                    Tipo de emergencia *
                  </label>
                  <select 
                    id="type"
                    name="type"
                    className="form-select form-select-lg" 
                    required 
                    value={form.type} 
                    onChange={handleChange}
                  >
                    <option value="herido">🔴 Animal herido</option>
                    <option value="abandonado">🟠 Animal abandonado</option>
                    <option value="perdido">🔵 Animal perdido</option>
                    <option value="hambriento">🟡 Animal hambriento</option>
                    <option value="maltratado">🟣 Animal maltratado</option>
                    <option value="atrapado">🔴 Animal atrapado</option>
                    <option value="encontrado">🟢 Animal encontrado</option>
                    <option value="otro">⚫ Otro</option>
                  </select>
                </div>

                {/* Urgencia */}
                <div className="mb-4">
                  <label htmlFor="urgency" className="form-label fw-bold">
                    <i className="bi bi-lightning me-2" />
                    Nivel de urgencia *
                  </label>
                  <select 
                    id="urgency"
                    name="urgency"
                    className="form-select form-select-lg" 
                    required 
                    value={form.urgency}
                    onChange={handleChange}
                  >
                    <option value="bajo">🟢 Bajo - Puede esperar algunas horas</option>
                    <option value="medio">🟡 Medio - Necesita atención pronto</option>
                    <option value="alto">🟠 Alto - Es urgente</option>
                    <option value="critico">🔴 Crítico - ¡EMERGENCIA INMEDIATA!</option>
                  </select>
                </div>

                {/* Descripción */}
                <div className="mb-4">
                  <label htmlFor="description" className="form-label fw-bold">
                    <i className="bi bi-chat-left-text me-2" />
                    Descripción detallada *
                  </label>
                  <textarea 
                    id="description"
                    name="description"
                    className="form-control form-control-lg" 
                    required 
                    rows={5} 
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe qué tipo de animal es, su condición, comportamiento, si está herido, si tiene collar, etc."
                  />
                  <small className="text-muted">Mínimo 10 caracteres</small>
                </div>

                {/* Ubicación */}
                <div className="mb-4">
                  <label htmlFor="address" className="form-label fw-bold">
                    <i className="bi bi-geo-alt me-2" />
                    Dirección
                  </label>
                  <input 
                    id="address"
                    type="text" 
                    name="address"
                    className="form-control form-control-lg" 
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Calle, número, referencias..."
                  />
                </div>

                {/* Comuna y Región */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label htmlFor="commune" className="form-label fw-bold">
                      <i className="bi bi-buildings me-2" />
                      Comuna
                    </label>
                    <input 
                      id="commune"
                      type="text" 
                      name="commune"
                      className="form-control form-control-lg" 
                      value={form.commune}
                      onChange={handleChange}
                      placeholder="Ej: Santiago"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="region" className="form-label fw-bold">
                      <i className="bi bi-map me-2" />
                      Región
                    </label>
                    <input 
                      id="region"
                      type="text" 
                      name="region"
                      className="form-control form-control-lg" 
                      value={form.region}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Coordenadas (opcional) */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label htmlFor="latitude" className="form-label fw-bold small">
                      Latitud
                    </label>
                    <input 
                      id="latitude"
                      type="number" 
                      name="latitude"
                      className="form-control form-control-sm" 
                      step="0.0001"
                      value={form.latitude}
                      onChange={handleChange}
                      placeholder="-33.8688"
                    />
                    <small className="text-muted">Automática si no especificas</small>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="longitude" className="form-label fw-bold small">
                      Longitud
                    </label>
                    <input 
                      id="longitude"
                      type="number" 
                      name="longitude"
                      className="form-control form-control-sm" 
                      step="0.0001"
                      value={form.longitude}
                      onChange={handleChange}
                      placeholder="-51.2093"
                    />
                    <small className="text-muted">Automática si no especificas</small>
                  </div>
                </div>

                {/* Botones */}
                <div className="d-grid gap-2 mb-3">
                  <button 
                    type="submit" 
                    className="btn btn-danger btn-lg fw-bold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creando reporte...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2" />
                        Enviar reporte de emergencia
                      </>
                    )}
                  </button>
                </div>

                <button 
                  type="button" 
                  className="btn btn-outline-secondary w-100"
                  disabled={loading}
                  onClick={() => navigate('/mapa')}
                >
                  Cancelar
                </button>
              </form>
            </div>
          </div>

          {/* Info Box */}
          <div className="alert alert-info mt-4" role="alert">
            <h5 className="alert-heading">💡 ¿Cómo describir mejor?</h5>
            <ul className="mb-0">
              <li>Especifica la especie (perro, gato, etc.)</li>
              <li>Describe características (tamaño, color, raza si la conoces)</li>
              <li>Menciona si está herido, enfermo o asustado</li>
              <li>Incluye el comportamiento del animal</li>
              <li>Sé lo más específico posible con la ubicación</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
