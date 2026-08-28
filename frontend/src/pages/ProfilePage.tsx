import { useState } from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { userService } from '../services/userService';
import { CHILE_REGIONS, ROLE_LABELS } from '../utils/constants';
import { formatDate } from '../utils/formatters';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    region: user?.region || '',
    commune: user?.commune || '',
  });

  if (!user) return null;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userService.update(user.id, form);
      await refreshUser();
      setEditing(false);
      showToast('Perfil actualizado', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'No se pudo guardar', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-4">
      <Breadcrumbs items={[{ label: 'Mi perfil' }]} />
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card p-4 text-center">
            <div className="avatar mx-auto mb-3" style={{ width: 80, height: 80, fontSize: '1.6rem' }}>
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <h1 className="h4 mb-1">{user.firstName} {user.lastName}</h1>
            <p className="text-muted mb-2">{user.email}</p>
            <span className="badge text-bg-success">{ROLE_LABELS[user.role]}</span>
            <p className="small text-muted mt-3 mb-0">Miembro desde {formatDate(user.createdAt)}</p>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 mb-0">Información personal</h2>
              {!editing && (
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>Editar</button>
              )}
            </div>
            {editing ? (
              <form onSubmit={save} className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre</label>
                  <input className="form-control" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Apellido</label>
                  <input className="form-control" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Teléfono</label>
                  <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Región</label>
                  <select className="form-select" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
                    {CHILE_REGIONS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Comuna</label>
                  <input className="form-control" value={form.commune} onChange={(e) => setForm({ ...form, commune: e.target.value })} />
                </div>
                <div className="col-12 d-flex gap-2">
                  <button className="btn btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
                  <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>Cancelar</button>
                </div>
              </form>
            ) : (
              <dl className="row mb-0">
                <dt className="col-sm-3">Teléfono</dt><dd className="col-sm-9">{user.phone || '—'}</dd>
                <dt className="col-sm-3">Región</dt><dd className="col-sm-9">{user.region}</dd>
                <dt className="col-sm-3">Comuna</dt><dd className="col-sm-9">{user.commune}</dd>
                <dt className="col-sm-3">Correo</dt><dd className="col-sm-9">{user.emailVerified ? 'Verificado' : 'Pendiente de verificación'}</dd>
              </dl>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
