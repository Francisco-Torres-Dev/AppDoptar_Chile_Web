import { Link } from 'react-router-dom';
import type { Report } from '../../types';
import { REPORT_TYPE_CONFIG } from '../../utils/constants';
import { formatRelativeTime } from '../../utils/formatters';

interface ReportCardProps {
  report: Report;
}

const urgencyConfig: Record<string, { color: string; icon: string }> = {
  bajo: { color: '#10B981', icon: 'bi-check-circle-fill' },
  medio: { color: '#F59E0B', icon: 'bi-exclamation-circle-fill' },
  alto: { color: '#EF4444', icon: 'bi-exclamation-triangle-fill' },
  critico: { color: '#DC2626', icon: 'bi-slash-circle-fill' },
};

export function ReportCard({ report }: ReportCardProps) {
  const config = REPORT_TYPE_CONFIG[report.type];
  const urgency = urgencyConfig[report.urgency];

  return (
    <article className="card report-card border-0 shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex align-items-start gap-3">
          {report.images[0] && (
            <div className="position-relative flex-shrink-0">
              <img 
                src={report.images[0]} 
                alt="" 
                className="report-thumb rounded" 
                loading="lazy" 
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-md)'
                }} 
              />
            </div>
          )}
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
              <span 
                className="badge text-white fw-semibold" 
                style={{ backgroundColor: config.color }}
              >
                <i className={`bi ${config.icon} me-1`} />
                {config.label}
              </span>
              <span 
                className="badge text-white fw-semibold" 
                style={{ backgroundColor: urgency.color }}
              >
                <i className={`bi ${urgency.icon} me-1`} />
                {report.urgency.charAt(0).toUpperCase() + report.urgency.slice(1)}
              </span>
              {report.isDemo && (
                <span className="badge bg-warning text-dark fw-semibold">Demo</span>
              )}
            </div>
            
            <p className="mb-2 small text-dark" style={{ lineHeight: '1.6' }}>
              {report.description.slice(0, 120)}...
            </p>
            
            <div className="d-flex align-items-center gap-3 mb-3">
              <p className="text-muted small mb-0">
                <i className="bi bi-geo-alt-fill me-1" style={{ color: 'var(--primary)' }} />
                {report.commune}
              </p>
              <p className="text-muted small mb-0">
                <i className="bi bi-clock-fill me-1" style={{ color: 'var(--primary)' }} />
                {formatRelativeTime(report.createdAt)}
              </p>
            </div>
            
            <Link 
              to="/mapa" 
              className="btn btn-sm btn-outline-primary fw-semibold"
            >
              <i className="bi bi-map-fill me-1"></i>
              Ver en mapa
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
