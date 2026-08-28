import { useEffect, useState } from 'react';
import { favoriteService } from '../services/notificationService';
import type { FavoriteType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export function useFavorite(itemType: FavoriteType, itemId: string) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsFavorite(false);
      return;
    }
    favoriteService.isFavorite(user.id, itemType, itemId).then(setIsFavorite);
  }, [user, itemType, itemId]);

  const toggle = async () => {
    if (!user) {
      showToast('Debes iniciar sesión para guardar favoritos', 'warning');
      return;
    }
    setLoading(true);
    try {
      const added = await favoriteService.toggle(user.id, itemType, itemId);
      setIsFavorite(added);
      showToast(added ? 'Agregado a favoritos' : 'Eliminado de favoritos', 'success');
    } finally {
      setLoading(false);
    }
  };

  return { isFavorite, toggle, loading };
}
