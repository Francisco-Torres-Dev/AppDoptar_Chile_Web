interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : size === 'lg' ? '' : '';
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5" role="status">
      <div className={`spinner-border text-primary ${sizeClass}`} aria-hidden="true" />
      {text && <p className="mt-3 text-muted mb-0">{text}</p>}
      <span className="visually-hidden">Cargando...</span>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card border-0 shadow-sm">
      <div className="skeleton skeleton-img" />
      <div className="card-body">
        <div className="skeleton skeleton-text w-75 mb-2" />
        <div className="skeleton skeleton-text w-50" />
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-5">
      {icon && <i className={`bi ${icon} display-4 text-muted mb-3 d-block`} />}
      <h3 className="h5">{title}</h3>
      {description && <p className="text-muted">{description}</p>}
      {action}
    </div>
  );
}
