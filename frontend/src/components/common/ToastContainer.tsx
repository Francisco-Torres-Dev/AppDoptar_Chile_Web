import { useToast } from '../../contexts/ToastContext';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100 }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast show align-items-center text-bg-${toast.type === 'error' ? 'danger' : toast.type} border-0 mb-2`}
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">{toast.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              aria-label="Cerrar"
              onClick={() => removeToast(toast.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
