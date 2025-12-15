import * as Calendar from 'expo-calendar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/**
 * Calendar Reminder Service
 * Rezervasyon onaylandığında takvim hatırlatıcısı oluşturur
 * ve rezervasyon iptal edildiğinde hatırlatıcıyı siler.
 */

const CALENDAR_STORAGE_PREFIX = 'eventId_';

class CalendarReminderService {
  /**
   * Takvim izinlerini iste
   * @returns {Promise<boolean>} İzin verildi mi?
   */
  async requestCalendarPermissions() {
    try {
      if (Platform.OS === 'web') {
        console.warn('Calendar not supported on web');
        return false;
      }

      const { status } = await Calendar.requestCalendarPermissionsAsync();
      
      if (status === 'granted') {
        console.log('✅ Calendar permissions granted');
        return true;
      } else {
        console.warn('⚠️ Calendar permissions denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting calendar permissions:', error);
      return false;
    }
  }

  /**
   * Default takvimi al veya oluştur
   * @returns {Promise<string|null>} Takvim ID'si
   */
  async getDefaultCalendar() {
    try {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      
      console.log(`📅 Found ${calendars.length} calendars`);
      
      // Herhangi bir takvim var mı?
      if (calendars.length === 0) {
        console.warn('No calendars found on device');
        // Android için yeni takvim oluşturmayı dene
        if (Platform.OS === 'android') {
          return await this.createLocalCalendar();
        }
        return null;
      }
      
      // iOS için - allowsModifications olan ilk takvim
      if (Platform.OS === 'ios') {
        const defaultCalendar = calendars.find(cal => cal.allowsModifications);
        if (defaultCalendar) {
          console.log(`📅 Using iOS calendar: ${defaultCalendar.title}`);
          return defaultCalendar.id;
        }
      }

      // Android için - owner veya primary olan
      if (Platform.OS === 'android') {
        const ownerCalendar = calendars.find(cal => cal.accessLevel === 'owner');
        if (ownerCalendar) {
          console.log(`📅 Using Android calendar: ${ownerCalendar.title}`);
          return ownerCalendar.id;
        }
        
        const primaryCalendar = calendars.find(cal => cal.isPrimary);
        if (primaryCalendar) {
          console.log(`📅 Using Android primary calendar: ${primaryCalendar.title}`);
          return primaryCalendar.id;
        }
      }

      // Herhangi bir yazılabilir takvim
      const writableCalendar = calendars.find(cal => 
        cal.allowsModifications !== false && 
        cal.accessLevel !== 'read'
      );
      
      if (writableCalendar) {
        console.log(`📅 Using writable calendar: ${writableCalendar.title}`);
        return writableCalendar.id;
      }
      
      // Hiçbiri bulunamadıysa ilk takvimi kullan (son çare)
      if (calendars[0]) {
        console.log(`⚠️ Using first available calendar: ${calendars[0].title}`);
        return calendars[0].id;
      }

      return null;
    } catch (error) {
      console.error('Error getting calendar:', error);
      return null;
    }
  }

  /**
   * Android için lokal takvim oluştur
   * @returns {Promise<string|null>}
   */
  async createLocalCalendar() {
    try {
      if (Platform.OS !== 'android') return null;
      
      // Android'de Local takvim kaynağını bul
      const sources = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const localSource = sources.find(cal => cal.source?.type === 'local');
      
      if (!localSource) {
        console.warn('⚠️ No local calendar source - Google account may not be set up');
        console.warn('ℹ️ To enable calendar reminders: Add a Google account in Settings → Accounts');
        return null;
      }

      const newCalendarId = await Calendar.createCalendarAsync({
        title: 'Locaffy',
        color: '#DC143C',
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: localSource.source.id,
        source: localSource.source,
        name: 'Locaffy Calendar',
        ownerAccount: 'personal',
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });

      console.log(`✅ Created new calendar: ${newCalendarId}`);
      return newCalendarId;
    } catch (error) {
      console.error('Error creating calendar:', error);
      return null;
    }
  }

  /**
   * Rezervasyon zamanından hatırlatıcı tarihleri hesapla
   * @param {string} reservationTime - ISO format rezervasyon zamanı
   * @returns {Object} Başlangıç ve bitiş zamanları, alarmlar ve geçerlilik
   */
  calculateReminderDates(reservationTime) {
    let reservationDate;
    
    // Backend format: "2025-12-25T19:00:00"
    if (reservationTime.includes('T')) {
      const [datePart, timePart] = reservationTime.split('T');
      const [year, month, day] = datePart.split('-');
      const [hour, minute] = timePart.split(':');
      reservationDate = new Date(year, month - 1, day, hour, minute);
    } else {
      reservationDate = new Date(reservationTime);
    }

    const now = new Date();
    const timeUntilReservation = reservationDate.getTime() - now.getTime();
    const hoursUntilReservation = timeUntilReservation / (60 * 60 * 1000);

    // Rezervasyon 30 dakikadan daha yakınsa hatırlatıcı oluşturma
    if (hoursUntilReservation < 0.5) {
      return { isValid: false, reason: 'Reservation is less than 30 minutes away' };
    }

    let startDate;
    let alarms = [];

    // Rezervasyon 2+ saat sonraysa: normal (2 saat önce + 30 dk önce)
    if (hoursUntilReservation >= 2) {
      startDate = new Date(reservationDate.getTime() - (2 * 60 * 60 * 1000));
      alarms = [
        { relativeOffset: 0, method: Calendar.AlarmMethod.ALERT },      // 2 saat önce
        { relativeOffset: 90, method: Calendar.AlarmMethod.ALERT },     // 30 dk önce
      ];
    } 
    // Rezervasyon 30 dk - 2 saat arasıysa: sadece 30 dk önce
    else {
      startDate = new Date(reservationDate.getTime() - (30 * 60 * 1000));
      alarms = [
        { relativeOffset: 0, method: Calendar.AlarmMethod.ALERT },      // 30 dk önce
      ];
    }

    return { 
      startDate, 
      endDate: reservationDate, 
      alarms,
      isValid: true 
    };
  }

  /**
   * Takvim hatırlatıcısı oluştur
   * @param {Object} reservation - Rezervasyon objesi
   * @returns {Promise<string|null>} Event ID
   */
  async createReminder(reservation) {
    try {
      if (Platform.OS === 'web') {
        console.warn('Calendar not supported on web');
        return null;
      }

      // İzin kontrolü
      const hasPermission = await this.requestCalendarPermissions();
      if (!hasPermission) return null;

      // Takvim ID
      const calendarId = await this.getDefaultCalendar();
      if (!calendarId) {
        console.warn('⚠️ No calendar found - reminder will not be created');
        return null;
      }

      // Tarihleri hesapla
      const dateInfo = this.calculateReminderDates(reservation.reservationTime);
      
      // Rezervasyon çok yakınsa hatırlatıcı oluşturma
      if (!dateInfo.isValid) {
        console.log(`⏰ Skipping reminder for reservation ${reservation.id}: ${dateInfo.reason}`);
        return null;
      }

      const { startDate, endDate, alarms } = dateInfo;

      // Etkinlik detayları
      const eventDetails = {
        title: 'Locaffy Rezervasyon Hatırlatması',
        notes: `Yaklaşan rezervasyonunuz için hatırlatma.\n\nMekan: ${reservation.placeName || reservation.place?.name || 'Bilinmiyor'}\nTarih: ${this.formatDateTime(endDate)}\nKişi Sayısı: ${reservation.numberOfPeople || '-'}`,
        startDate: startDate,
        endDate: endDate,
        timeZone: 'Europe/Istanbul',
        alarms: alarms,
      };

      // Etkinlik oluştur
      const eventId = await Calendar.createEventAsync(calendarId, eventDetails);
      
      if (eventId) {
        await this.saveEventId(reservation.id, eventId);
        console.log(`✅ Reminder created for reservation ${reservation.id}`);
        return eventId;
      }

      return null;
    } catch (error) {
      console.error('Error creating reminder:', error);
      return null;
    }
  }

  /**
   * Takvim hatırlatıcısını sil
   * @param {number} reservationId - Rezervasyon ID
   * @returns {Promise<boolean>}
   */
  async deleteReminder(reservationId) {
    try {
      if (Platform.OS === 'web') return false;

      const eventId = await this.getEventId(reservationId);
      if (!eventId) {
        console.warn(`No event ID found for reservation ${reservationId}`);
        return false;
      }

      const hasPermission = await this.requestCalendarPermissions();
      if (!hasPermission) return false;

      await Calendar.deleteEventAsync(eventId);
      await this.removeEventId(reservationId);
      
      console.log(`✅ Reminder deleted for reservation ${reservationId}`);
      return true;
    } catch (error) {
      console.error('Error deleting reminder:', error);
      return false;
    }
  }

  /**
   * Event ID'yi kaydet
   */
  async saveEventId(reservationId, eventId) {
    try {
      const key = `${CALENDAR_STORAGE_PREFIX}${reservationId}`;
      await AsyncStorage.setItem(key, eventId);
    } catch (error) {
      console.error('Error saving event ID:', error);
    }
  }

  /**
   * Event ID'yi al
   */
  async getEventId(reservationId) {
    try {
      const key = `${CALENDAR_STORAGE_PREFIX}${reservationId}`;
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error getting event ID:', error);
      return null;
    }
  }

  /**
   * Event ID'yi sil
   */
  async removeEventId(reservationId) {
    try {
      const key = `${CALENDAR_STORAGE_PREFIX}${reservationId}`;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing event ID:', error);
    }
  }

  /**
   * Tarih formatla
   */
  formatDateTime(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  /**
   * Rezervasyon durum değişikliklerini izle
   * @param {Array} oldReservations - Eski liste
   * @param {Array} newReservations - Yeni liste
   */
  async watchStatusChanges(oldReservations, newReservations) {
    try {
      if (Platform.OS === 'web') return;
      if (!newReservations || newReservations.length === 0) return;

      // İlk yükleme - APPROVED olanlar için hatırlatıcı oluştur (ama sadece yoksa)
      if (!oldReservations || oldReservations.length === 0) {
        // Background'da çalıştır - UI'ı bloklamadan
        setTimeout(async () => {
          for (const reservation of newReservations) {
            if (reservation.status === 'APPROVED') {
              const existingEventId = await this.getEventId(reservation.id);
              if (!existingEventId) {
                console.log(`📅 Initial load - creating reminder for reservation ${reservation.id}`);
                await this.createReminder(reservation);
              } else {
                console.log(`ℹ️ Reminder already exists for reservation ${reservation.id}`);
              }
            }
          }
        }, 100);
        return;
      }

      // Durum değişikliklerini tespit et
      for (const newRes of newReservations) {
        const oldRes = oldReservations.find(r => r.id === newRes.id);

        // Yeni rezervasyon eklendi ve onaylı - event ID yoksa oluştur
        if (!oldRes && newRes.status === 'APPROVED') {
          const existingEventId = await this.getEventId(newRes.id);
          if (!existingEventId) {
            console.log(`📅 New approved reservation ${newRes.id} - creating reminder`);
            await this.createReminder(newRes);
          }
          continue;
        }

        // Durum değişti
        if (oldRes && oldRes.status !== newRes.status) {
          // PENDING → APPROVED: Hatırlatıcı oluştur (yoksa)
          if (oldRes.status === 'PENDING' && newRes.status === 'APPROVED') {
            const existingEventId = await this.getEventId(newRes.id);
            if (!existingEventId) {
              console.log(`📅 Reservation ${newRes.id} approved - creating reminder`);
              await this.createReminder(newRes);
            } else {
              console.log(`ℹ️ Reminder already exists for reservation ${newRes.id}`);
            }
          }
          
          // APPROVED → CANCELLED/REJECTED: Hatırlatıcıyı sil
          if (oldRes.status === 'APPROVED' && 
              (newRes.status === 'CANCELLED' || newRes.status === 'REJECTED')) {
            console.log(`🗑️ Reservation ${newRes.id} cancelled - deleting reminder`);
            await this.deleteReminder(newRes.id);
          }
        }
      }
    } catch (error) {
      console.error('Error watching status changes:', error);
    }
  }
}

const calendarReminderService = new CalendarReminderService();

export default calendarReminderService;
