import { useState, useCallback } from 'react';
import { reservationService, calendarReminderService } from '../services';

export const useReservations = () => {
  const [activeReservations, setActiveReservations] = useState([]);
  const [pastReservations, setPastReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Kullanıcı rezervasyonlarını yükle
  const loadReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const reservations = await reservationService.getUserReservations();

      const previousReservations = [...activeReservations, ...pastReservations];
      if (previousReservations.length > 0) {
        await calendarReminderService.watchStatusChanges(previousReservations, reservations);
      } else if (reservations.length > 0) {
        await calendarReminderService.watchStatusChanges([], reservations);
      }

      const now = new Date();

      // Aktif rezervasyonlar
      const active = reservations.filter(res => {
        const resTime = parseReservationTime(res.reservationTime);
        return resTime >= now && (res.status === 'APPROVED' || res.status === 'PENDING');
      });

      // Geçmiş rezervasyonlar
      const past = reservations.filter(res => {
        const resTime = parseReservationTime(res.reservationTime);
        return resTime < now || 
          ['REJECTED', 'CANCELLED', 'NO_SHOW', 'COMPLETED'].includes(res.status);
      });

      // Tarihe göre sırala (en yeniler üstte)
      const sortByDate = (a, b) => {
        const dateA = new Date(a.createdAt || a.reservationTime);
        const dateB = new Date(b.createdAt || b.reservationTime);
        return dateB - dateA;
      };

      setActiveReservations(active.sort(sortByDate));
      setPastReservations(past.sort(sortByDate));

      return { active, past };
    } catch (err) {
      setError(err.message);
      return { active: [], past: [] };
    } finally {
      setLoading(false);
    }
  }, [activeReservations, pastReservations]);

  // Yeni rezervasyon oluştur
  const createReservation = useCallback(async (reservationData) => {
    try {
      setLoading(true);
      setError(null);

      const result = await reservationService.createReservation(reservationData);
      
      // Başarılı ise listeyi güncelle
      await loadReservations();

      return { success: true, data: result, message: 'Rezervasyon başarıyla oluşturuldu' };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message || 'Rezervasyon oluşturulamadı' };
    } finally {
      setLoading(false);
    }
  }, [loadReservations]);

  // Rezervasyon iptal et
  const cancelReservation = useCallback(async (reservationId, reason) => {
    try {
      setLoading(true);
      setError(null);

      await reservationService.cancelReservation(reservationId, reason);
    
      await loadReservations();

      return { success: true, message: 'Rezervasyon iptal edildi' };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message || 'Rezervasyon iptal edilemedi' };
    } finally {
      setLoading(false);
    }
  }, [loadReservations]);

  // Rezervasyonun iptal edilip edilemeyeceğini kontrol et
  const canCancelReservation = useCallback((reservation) => {
    return reservationService.canCancelReservation(reservation);
  }, []);

  // İlk müsait tarihi al
  const getFirstAvailableDate = useCallback(async (placeId) => {
    try {
      return await reservationService.getFirstAvailableDate(placeId);
    } catch (err) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return tomorrow.toISOString();
    }
  }, []);

  return {
    activeReservations,
    pastReservations,
    loading,
    error,
    loadReservations,
    createReservation,
    cancelReservation,
    canCancelReservation,
    getFirstAvailableDate
  };
};

// Rezervasyon zamanını parse et
const parseReservationTime = (timeString) => {
  if (timeString.includes('T')) {
    const [datePart, timePart] = timeString.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    return new Date(year, month - 1, day, hour, minute);
  }
  return new Date(timeString);
};

// Rezervasyon durumu label ve rengi
export const getReservationStatusInfo = (status) => {
  const statusMap = {
    PENDING: { label: 'Beklemede', color: '#F39C12', icon: 'clock-o' },
    APPROVED: { label: 'Onaylandı', color: '#27AE60', icon: 'check-circle' },
    REJECTED: { label: 'Reddedildi', color: '#E74C3C', icon: 'times-circle' },
    CANCELLED: { label: 'İptal Edildi', color: '#95A5A6', icon: 'ban' },
    COMPLETED: { label: 'Tamamlandı', color: '#3498DB', icon: 'check' },
    NO_SHOW: { label: 'Gelmedi', color: '#E74C3C', icon: 'user-times' }
  };
  return statusMap[status] || { label: status, color: '#95A5A6', icon: 'question' };
};

export default useReservations;
