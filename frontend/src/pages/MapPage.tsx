import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { reportService } from '../services/reportService';
import type { Report, ReportType } from '../types';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const reportTypeIcons: Record<ReportType, string> = {
  herido: '🔴', abandonado: '🟠', perdido: '🔵', hambriento: '🟡',
  maltratado: '🟣', atrapado: '🔴', encontrado: '🟢', otro: '⚫',
};

const reportTypeColors: Record<ReportType, string> = {
  herido: '#c45c3e', abandonado: '#d4a017', perdido: '#3d7a8c', hambriento: '#e0b429',
  maltratado: '#6b4c8a', atrapado: '#c45c3e', encontrado: '#2f6b4f', otro: '#6B7280',
};

function createMarkerIcon(type: ReportType, urgency: string) {
  const opacity = { bajo: 0.65, medio: 0.8, alto: 1, critico: 1 }[urgency] || 0.8;
  return L.divIcon({
    html: `<div style="background:${reportTypeColors[type]};opacity:${opacity};border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,.25)">${reportTypeIcons[type]}</div>`,
    className: 'custom-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

export default function MapPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('');

  useEffect(() => {
    reportService.getAll().then(setReports).finally(() => setLoading(false));
  }, []);

  const filtered = selectedFilter ? reports.filter((r) => r.type === selectedFilter) : reports;

  const help = async (id: string) => {
    if (!user) {
      showToast('Inicia sesión para ayudar', 'warning');
      navigate('/login');
      return;
    }
    const updated = await reportService.helpReport(id, user.id);
    setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
    showToast('Registramos tu ayuda. Gracias.', 'success');
  };

  if (loading) return <LoadingSpinner text="Cargando mapa..." />;

  return (
    <div>
      <div className="container py-4">
        <Breadcrumbs items={[{ label: 'Mapa de reportes' }]} />
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h1 className="h2 mb-1">Mapa de emergencias</h1>
            <p className="text-muted mb-0">{filtered.length} reportes de demostración</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/reportar')}>Crear reporte</button>
        </div>
      </div>

      <div className="map-layout border-top">
        <aside className="p-4" style={{ background: 'white', borderRight: '1px solid var(--line)' }}>
          <label className="form-label fw-bold">Tipo de reporte</label>
          <select className="form-select mb-4" value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
            <option value="">Todos ({reports.length})</option>
            {Object.keys(reportTypeIcons).map((t) => (
              <option key={t} value={t}>{t} ({reports.filter((r) => r.type === t).length})</option>
            ))}
          </select>
          <p className="small text-muted">Los pines usan colores distintos por categoría. Los textos incluyen [DEMO].</p>
        </aside>
        <div className="map-canvas">
          <MapContainer center={[-33.4489, -70.6693]} zoom={11} style={{ height: '100%', minHeight: 560, width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
            {filtered.map((report) => (
              <Marker key={report.id} position={[report.latitude, report.longitude]} icon={createMarkerIcon(report.type, report.urgency)}>
                <Popup>
                  <strong>{reportTypeIcons[report.type]} {report.type}</strong>
                  <p className="small mb-2 mt-2">{report.description}</p>
                  <p className="small text-muted">{report.commune} · {report.urgency}</p>
                  <p className="small">{report.helpersCount} personas están ayudando.</p>
                  <button type="button" className="btn btn-sm btn-primary w-100" onClick={() => help(report.id)}>
                    Estoy ayudando
                  </button>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
