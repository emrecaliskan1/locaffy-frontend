import { useState, useCallback, useEffect } from 'react';
import { userService } from '../services';


export const useFavorites = (placeId = null) => {
  const [favorites, setFavorites] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Tüm favorileri yükle
  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getFavorites();
      setFavorites(data || []);
      return data || [];
    } catch (err) {
      setError(err.message);
      setFavorites([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Belirli bir mekanın favori durumunu kontrol et
  const checkFavoriteStatus = useCallback(async (id = placeId) => {
    if (!id) return false;

    try {
      const favs = await userService.getFavorites();
      const isFav = favs?.some(fav => fav.id === id) || false;
      setIsFavorite(isFav);
      return isFav;
    } catch (err) {
      setIsFavorite(false);
      return false;
    }
  }, [placeId]);

  // Favori toggle işlemi
  const toggleFavorite = useCallback(async (id = placeId) => {
    if (!id || loading) return { success: false };

    try {
      setLoading(true);
      setError(null);

      const currentStatus = favorites.some(fav => fav.id === id);
      
      if (currentStatus) {
        await userService.removeFromFavorites(id);
        setFavorites(prev => prev.filter(fav => fav.id !== id));
        if (id === placeId) setIsFavorite(false);
        return { success: true, action: 'removed', message: 'Mekan favorilerden çıkarıldı' };
      } else {
        await userService.addToFavorites(id);
        // Favori eklendikten sonra listeyi güncelle
        const updatedFavorites = await userService.getFavorites();
        setFavorites(updatedFavorites || []);
        if (id === placeId) setIsFavorite(true);
        return { success: true, action: 'added', message: 'Mekan favorilere eklendi' };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message || 'Favori işlemi gerçekleştirilemedi' };
    } finally {
      setLoading(false);
    }
  }, [placeId, favorites, loading]);

  // placeId değiştiğinde favori durumunu kontrol et
  useEffect(() => {
    if (placeId) {
      checkFavoriteStatus(placeId);
    }
  }, [placeId, checkFavoriteStatus]);

  return {
    favorites,
    isFavorite,
    loading,
    error,
    loadFavorites,
    toggleFavorite,
    checkFavoriteStatus
  };
};

export default useFavorites;
