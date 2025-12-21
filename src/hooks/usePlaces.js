import { useState, useCallback, useMemo } from 'react';
import { placeService } from '../services';
import { calculateDistance } from '../utils/distance';

export const usePlaces = (currentLocation = null) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Yakındaki mekanları yükle
  const loadPlaces = useCallback(async (location = currentLocation, radius = 10000) => {
    if (!location?.latitude || !location?.longitude) {
      setPlaces([]);
      return [];
    }

    try {
      setLoading(true);
      setError(null);

      const result = await placeService.getNearbyPlaces(
        location.latitude,
        location.longitude,
        radius,
        true
      );

      const placesData = Array.isArray(result) 
        ? result 
        : (result?.data ? (Array.isArray(result.data) ? result.data : []) : []);

      // Sadece müsait mekanları al
      const availablePlaces = placesData.filter(place => place && place.isAvailable !== false);

      // Mesafe hesapla ve ekle
      const placesWithDistance = availablePlaces.map(place => {
        let distance;
        if (place.distance !== undefined && place.distance !== null) {
          distance = typeof place.distance === 'number' ? place.distance / 1000 : place.distance;
        } else if (place.latitude && place.longitude) {
          distance = calculateDistance(
            location.latitude,
            location.longitude,
            place.latitude,
            place.longitude
          );
        } else {
          distance = Infinity;
        }
        return { ...place, calculatedDistance: distance };
      });

      // Mesafeye göre sırala
      const sortedPlaces = placesWithDistance.sort((a, b) => {
        return (a.calculatedDistance || Infinity) - (b.calculatedDistance || Infinity);
      });

      setPlaces(sortedPlaces);
      return sortedPlaces;
    } catch (err) {
      setError(err.message);
      setPlaces([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [currentLocation]);

  // Mekan detayı getir
  const getPlaceDetails = useCallback(async (placeId) => {
    try {
      setLoading(true);
      const result = await placeService.getPlaceDetails(placeId);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mekanları filtrele (client-side)
  const filterPlaces = useCallback((filters, searchText = '') => {
    return places.filter(place => {
      if (place.isAvailable === false) return false;

      // Arama filtresi
      const matchesSearch = !searchText || 
        place.name?.toLowerCase().includes(searchText.toLowerCase());

      // Kategori filtresi
      const matchesCategory = filters.category === 'all' ||
        place.placeType?.toLowerCase() === filters.category.toLowerCase() ||
        place.placeType === filters.category.toUpperCase();

      // Rating filtresi
      const matchesRating = filters.rating === 'all' ||
        (place.averageRating && place.averageRating >= parseFloat(filters.rating));

      // Uzaklık filtresi
      const matchesDistance = filters.distance === 'all' || (() => {
        if (!currentLocation?.latitude || !currentLocation?.longitude || 
            !place.latitude || !place.longitude) {
          return true;
        }
        const distance = place.calculatedDistance || calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          place.latitude,
          place.longitude
        );
        return distance <= parseInt(filters.distance) / 1000;
      })();

      // Açık mekanlar filtresi
      const matchesOpenNow = !filters.openNow || isPlaceOpen(place);

      return matchesSearch && matchesCategory && matchesRating && matchesDistance && matchesOpenNow;
    });
  }, [places, currentLocation]);

  return {
    places,
    loading,
    error,
    loadPlaces,
    getPlaceDetails,
    filterPlaces,
    setPlaces
  };
};

// Mekanın açık olup olmadığını kontrol et
export const isPlaceOpen = (place) => {
  if (!place.workingHours) return true;
  
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todaySchedule = place.workingHours[dayNames[currentDay]];
  
  if (!todaySchedule || todaySchedule.isClosed) return false;
  
  const [openHour, openMin] = todaySchedule.open.split(':').map(Number);
  const [closeHour, closeMin] = todaySchedule.close.split(':').map(Number);
  const openTime = openHour * 60 + openMin;
  const closeTime = closeHour * 60 + closeMin;
  
  return currentTime >= openTime && currentTime <= closeTime;
};

// Mekan tipi labelı
export const getPlaceTypeLabel = (type) => {
  const typeMap = {
    'CAFE': 'Kafe',
    'RESTAURANT': 'Restoran',
    'BAR': 'Bar',
    'BISTRO': 'Bistro',
    'DESSERT': 'Tatlıcı',
    'FASTFOOD': 'Fast Food',
  };
  return typeMap[type] || type;
};

export default usePlaces;
