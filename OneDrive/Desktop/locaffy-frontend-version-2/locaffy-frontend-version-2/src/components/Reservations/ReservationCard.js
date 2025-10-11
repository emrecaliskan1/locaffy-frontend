import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { dayNames, monthNames } from '../../static-data/reservationData';

const ReservationCard = ({ item, styles, onCancel, onCall, onReview }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'onaylandı':
        return '#27AE60';
      case 'beklemede':
        return '#667eea';
      case 'tamamlandı':
        return '#7F8C8D';
      case 'reddedildi':
        return '#E74C3C';
      case 'iptal-edildi':
        return '#F39C12';
      default:
        return '#7F8C8D';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    return {
      day: date.getDate(),
      dayName: dayNames[date.getDay()],
      month: monthNames[date.getMonth()],
      full: `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
    };
  };

  const canCancelReservation = (reservation) => {
    const reservationDate = new Date(reservation.date);
    const now = new Date();
    const timeDiff = reservationDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    
    return hoursDiff > 2;
  };

  const date = formatDate(item.date);

  return (
    <View style={styles.reservationCard}>
      <View style={styles.reservationHeader}>
        <View style={styles.restaurantInfo}>
          <Text style={[styles.restaurantName, { userSelect: 'none' }]}>{item.restaurantName}</Text>
          <Text style={[styles.reservationNumber, { userSelect: 'none' }]}>{item.reservationNumber}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.statusText}</Text>
        </View>
      </View>

      <View style={styles.reservationDetails}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { userSelect: 'none' }]}>📅 Tarih:</Text>
          <Text style={[styles.detailValue, { userSelect: 'none' }]}>{date.full} ({date.dayName})</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { userSelect: 'none' }]}>🕐 Saat:</Text>
          <Text style={[styles.detailValue, { userSelect: 'none' }]}>{item.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { userSelect: 'none' }]}>👥 Kişi:</Text>
          <Text style={[styles.detailValue, { userSelect: 'none' }]}>{item.people} kişi</Text>
        </View>
        {item.specialRequests && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { userSelect: 'none' }]}>💬 Not:</Text>
            <Text style={[styles.detailValue, { userSelect: 'none' }]}>{item.specialRequests}</Text>
          </View>
        )}
      </View>

      <View style={styles.reservationFooter}>
        {/* Action buttons: show for onaylandı or beklemede */}
        {(item.status === 'onaylandı' || item.status === 'beklemede') && (
          <View style={styles.actionButtons}>
            {/* Cancel button - left */}
            {canCancelReservation(item) ? (
              <TouchableOpacity style={[styles.cancelButton, { flex: 1, marginRight: 8 }]} onPress={() => onCancel ? onCancel(item) : null}>
                <Text style={styles.cancelButtonText}>İptal Et</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.cancelButton, { flex: 1, marginRight: 8, opacity: 0.6 }]}
                onPress={() => Alert.alert('İptal Edilemez', 'Bu rezervasyon iptal edilemez. Lütfen iptal koşullarını kontrol edin.')}
              >
                <Text style={styles.cancelButtonText}>İptal Et</Text>
              </TouchableOpacity>
            )}

            {/* Call button - right */}
            <TouchableOpacity style={[styles.callButton, { flex: 1 }]} onPress={() => onCall ? onCall(item) : null}>
              <Text style={styles.callButtonText}>Restoranı Ara</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Completed reservation review button or reviewed label */}
        {item.status === 'tamamlandı' && (
          item.isReviewed ? (
            <View style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#E1E1E1' }}>
              <Text style={{ color: '#7F8C8D', fontWeight: '700' }}>Değerlendirildi</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.rateButton} onPress={() => (typeof onReview === 'function' ? onReview(item) : null)}>
              <Text style={styles.rateButtonText}>Değerlendir</Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );
};

export default ReservationCard;