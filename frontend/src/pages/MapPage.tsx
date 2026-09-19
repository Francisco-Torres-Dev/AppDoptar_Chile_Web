import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { reportService } from '../services/reportService';
import { getCurrentPosition } from '../services/mapService';
import type { Report, ReportType, ReportUrgency } from '../types';
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

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 16, { duration: 0.8 });
  }, [lat, lng, map]);
  return null;
}

function MapClickLocate({ onLocate }: { onLocate: () => void }) {
  useMapEvents({
    click() {
      onLocate();
    },
  });
  return null;
}

function filesToDataUrls(files: FileList): Promise<string[]> {
  return Promise.all(
    Array.from(files).slice(0, 4).map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error('No se pudo leer la foto'));
          reader.readAsDataURL(file);
        }),
    ),
  );
}

export default function MapPage() {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [form, setForm] = useState({
    type: 'herido' as ReportType,
    urgency: 'alto' as ReportUrgency,
    description: '',
    address: '',
  });

  useEffect(() => {
    reportService.getAll().then(setReports).finally(() => setLoading(false));
  }, []);

  const filtered = selectedFilter ? reports.filter((r) => r.type === selectedFilter) : reports;

  const requestLocation = async () => {
    setLocating(true);
    try {
      const pos = await getCurrentPosition();
      const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setUserPos(next);
      setShowForm(true);
      showToast('Mapa centrado en tu ubicación', 'success');
    } catch {
      showToast('No pudimos obtener tu ubicación. Activa el permiso del navegador.', 'error');
    } finally {
      setLocating(false);
    }
  };

  const help = async (id: string) => {
    if (!user) {
      showToast('Inicia sesión para ayudar', 'warning');
      return;
    }
    const updated = await reportService.helpReport(id, user.id);
    setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
    showToast('Registramos tu ayuda. Gracias.', 'success');
  };

  const handlePhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const urls = await filesToDataUrls(e.target.files);
    setPhotos(urls);
  };

  const submitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Inicia sesión para reportar', 'warning');
      return;
    }
    if (!userPos) {
      showToast('Primero comparte tu ubicación en el mapa', 'warning');
      return;
    }
    if (form.description.trim().length < 10) {
      showToast('Describe la situación con al menos 10 caracteres', 'warning');
      return;
    }
    setSubmitting(true);
    try {
      const created = await reportService.create({
        type: form.type,
        description: form.description,
        images: photos,
        latitude: userPos.lat,
        longitude: userPos.lng,
        address: form.address || 'Ubicación aproximada del reportero',
        commune: 'Zona cercana',
        region: 'Ubicación actual',
        urgency: form.urgency,
        reporterId: user.id,
        isDemo: true,
      });
      setReports((prev) => [created, ...prev]);
      setShowForm(false);
      setForm({ type: 'herido', urgency: 'alto', description: '', address: '' });
      setPhotos([]);
      showToast('Reporte publicado desde tu ubicación', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'No se pudo crear el reporte', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Cargando mapa..." />;

  return (
    <div>
      <div className="container py-4">
        <Breadcrumbs items={[{ label: 'Mapa de reportes' }]} />
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h1 className="h2 mb-1">Mapa de emergencias</h1>
            <p className="text-muted mb-0">Haz clic en el mapa para usar tu ubicación y reportar.</p>
          </div>
          <button className="btn btn-primary" onClick={requestLocation} disabled={locating}>
            {locating ? 'Obteniendo ubicación...' : 'Usar mi ubicación'}
          </button>
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
          <p className="small text-muted mb-0">Al hacer clic el navegador pedirá permiso de ubicación. El reporte se publica desde ese punto, sin mostrar tu dirección exacta.</p>
        </aside>
        <div className="map-canvas">
          <MapContainer center={userPos ? [userPos.lat, userPos.lng] : [-33.4489, -70.6693]} zoom={userPos ? 16 : 11} style={{ height: '100%', minHeight: 560, width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
            <MapClickLocate onLocate={requestLocation} />
            {userPos && <Recenter lat={userPos.lat} lng={userPos.lng} />}
            {userPos && (
              <CircleMarker center={[userPos.lat, userPos.lng]} radius={12} pathOptions={{ color: '#0b3a8a', fillColor: '#7ec8ea', fillOpacity: 0.85, weight: 3 }}>
                <Popup>Estás aquí. Puedes crear un reporte desde esta ubicación.</Popup>
              </CircleMarker>
            )}
            {filtered.map((report) => (
              <Marker key={report.id} position={[report.latitude, report.longitude]} icon={createMarkerIcon(report.type, report.urgency)}>
                <Popup>
                  <strong>{reportTypeIcons[report.type]} {report.type}</strong>
                  <p className="small mb-2 mt-2">{report.description}</p>
                  {report.images[0] && <img src={report.images[0]} alt="" style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />}
                  <p className="small text-muted">{report.commune} · {report.urgency}</p>
                  <p className="small">{report.helpersCount} personas están ayudando.</p>
                  <button type="button" className="btn btn-sm btn-primary w-100" onClick={() => help(report.id)}>
                    Estoy ayudando
                  </button>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {showForm && userPos && (
            <div className="map-report-card">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h2 className="h5 mb-1">Reportar desde aquí</h2>
                  <p className="small text-muted mb-0">Ubicación aproximada lista.</p>
                </div>
                <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setShowForm(false)} />
              </div>
              {!user ? (
                <p className="small mb-0">Inicia sesión para publicar el reporte con foto.</p>
              ) : (
                <form onSubmit={submitReport}>
                  <label className="form-label small fw-bold">Tipo</label>
                  <select className="form-select form-select-sm mb-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ReportType })}>
                    {Object.keys(reportTypeIcons).map((t) => (
                      <option key={t} value={t}>{reportTypeIcons[t as ReportType]} {t}</option>
                    ))}
                  </select>
                  <label className="form-label small fw-bold">Urgencia</label>
                  <select className="form-select form-select-sm mb-2" value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value as ReportUrgency })}>
                    <option value="bajo">Bajo</option>
                    <option value="medio">Medio</option>
                    <option value="alto">Alto</option>
                    <option value="critico">Crítico</option>
                  </select>
                  <label className="form-label small fw-bold">Foto</label>
                  <input type="file" accept="image/*" capture="environment" multiple className="form-control form-control-sm mb-2" onChange={handlePhotos} />
                  {photos.length > 0 && (
                    <div className="photo-preview-grid mb-2">
                      {photos.map((src) => <img key={src.slice(0, 40)} src={src} alt="Vista previa" />)}
                    </div>
                  )}
                  <label className="form-label small fw-bold">Descripción</label>
                  <textarea className="form-control form-control-sm mb-2" rows={3} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Qué ves, estado del animal y referencias de zona." />
                  <label className="form-label small fw-bold">Referencia (opcional)</label>
                  <input className="form-control form-control-sm mb-3" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Parque, esquina, sector..." />
                  <button className="btn btn-primary w-100" disabled={submitting}>
                    {submitting ? 'Publicando...' : 'Publicar reporte'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
