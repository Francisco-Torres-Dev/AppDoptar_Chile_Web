import { copyToClipboard, getShareUrls, shareContent } from '../../utils/share';
import { useToast } from '../../contexts/ToastContext';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const { showToast } = useToast();
  const urls = getShareUrls(title, url);

  const handleNativeShare = async () => {
    const shared = await shareContent(title, title, url);
    if (!shared) showToast('Compartir no disponible en este dispositivo', 'info');
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(url);
    showToast(ok ? 'Enlace copiado' : 'No se pudo copiar', ok ? 'success' : 'error');
  };

  return (
    <div className="d-flex flex-wrap gap-2">
      <button type="button" className="btn btn-sm btn-outline-success" onClick={handleNativeShare}>
        <i className="bi bi-share me-1" /> Compartir
      </button>
      <a href={urls.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-success">
        <i className="bi bi-whatsapp me-1" /> WhatsApp
      </a>
      <a href={urls.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
        <i className="bi bi-facebook me-1" /> Facebook
      </a>
      <a href={urls.twitter} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-dark">
        <i className="bi bi-twitter-x me-1" /> X
      </a>
      <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleCopy}>
        <i className="bi bi-clipboard me-1" /> Copiar enlace
      </button>
    </div>
  );
}
