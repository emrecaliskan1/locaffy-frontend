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

  return {
    places,
    loading,
    error,
    loadPlaces,
    setPlaces
  };
};

// Mekanın açık olup olmadığını kontrol et
export const isPlaceOpen = (place) => {
  // workingDays ve openingHours kontrolü (backend formatı)
  if (!place.workingDays || !place.openingHours) return true;
  
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const dayMap = {
    // Türkçe büyük harf format
    'PAZAR': 0, 'PAZARTESİ': 1, 'SALI': 2, 'ÇARŞAMBA': 3,
    'PERŞEMBE': 4, 'CUMA': 5, 'CUMARTESİ': 6,
    // Türkçe normal format
    'Pazar': 0, 'Pazartesi': 1, 'Salı': 2, 'Çarşamba': 3,
    'Perşembe': 4, 'Cuma': 5, 'Cumartesi': 6
  };

  let workingDayNumbers = [];
  const workingDays = place.workingDays.trim();
  
  // Aralık formatı: "Pazartesi-Cuma" veya "PAZARTESİ-CUMA"
  if (workingDays.includes('-')) {
    const [startDay, endDay] = workingDays.split('-').map(day => day.trim());
    const startDayNum = dayMap[startDay];
    const endDayNum = dayMap[endDay];
    
    if (startDayNum !== undefined && endDayNum !== undefined) {
      if (startDayNum <= endDayNum) {
        for (let i = startDayNum; i <= endDayNum; i++) {
          workingDayNumbers.push(i);
        }
      } else {
        for (let i = startDayNum; i <= 6; i++) {
          workingDayNumbers.push(i);
        }
        for (let i = 0; i <= endDayNum; i++) {
          workingDayNumbers.push(i);
        }
      }
    }
  } 
  // Virgüllü format: "Pazartesi,Salı,Çarşamba"
  else if (workingDays.includes(',')) {
    const days = workingDays.split(',').map(day => day.trim());
    workingDayNumbers = days.map(day => dayMap[day]).filter(num => num !== undefined);
  } 
  // Hergün formatı
  else if (workingDays === 'Hergün' || workingDays === 'HERGÜN' || 
           workingDays === 'Pazartesi-Pazar' || workingDays === 'PAZARTESİ-PAZAR') {
    workingDayNumbers = [0, 1, 2, 3, 4, 5, 6];
  } 
  // Tek gün formatı
  else {
    const dayNum = dayMap[workingDays];
    if (dayNum !== undefined) {
      workingDayNumbers = [dayNum];
    }
  }

  // Bugün çalışıyor mu?
  if (!workingDayNumbers.includes(currentDay)) {
    return false;
  }

  // Çalışma saatlerini kontrol et (format: "09:00-22:00" veya "09:00 - 22:00")
  const openingHours = place.openingHours.trim();
  const timeParts = openingHours.split('-').map(t => t.trim());
  
  if (timeParts.length === 2) {
    const [openTime, closeTime] = timeParts;
    const [openHour, openMin] = openTime.split(':').map(Number);
    const [closeHour, closeMin] = closeTime.split(':').map(Number);
    
    if (!isNaN(openHour) && !isNaN(closeHour)) {
      const openMinutes = openHour * 60 + (openMin || 0);
      const closeMinutes = closeHour * 60 + (closeMin || 0);
      
      return currentTime >= openMinutes && currentTime <= closeMinutes;
    }
  }
  
  return true;
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
