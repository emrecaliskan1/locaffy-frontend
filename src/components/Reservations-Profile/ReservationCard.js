import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { dayNames, monthNames } from '../../static-data/reservationData';

const ReservationCard = ({ item, styles, onCancel, isPast, navigation }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'onaylandı':
        return '#10B981';
      case 'beklemede':
        return '#6366F1';
      case 'tamamlandı':
        return '#6B7280';
      case 'reddedildi':
        return '#EF4444';
      default:
        return '#6B7280';
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

  const showCancelButton = (item.status === 'onaylandı' || item.status === 'beklemede');
  const showCancelledBadge = isPast && item.status === 'iptal edildi';
  const showReviewButton = isPast && item.status === 'tamamlandı';
  const isReviewed = item.rating !== undefined && item.rating !== null;
  const date = formatDate(item.date);

  return (
    <View style={styles.reservationCard}>
      <View style={styles.reservationHeader}>
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{item.restaurantName}</Text>
          <Text style={styles.reservationNumber}>{item.reservationNumber}</Text>
        </View>
        {/* Sadece geçmişte ve iptal edildi ise cancelledBadge göster, statusBadge gösterme */}
        {showCancelledBadge ? (
          <View style={[styles.statusBadge, styles.cancelledBadge]}>
            <Text style={styles.statusText}>İptal Edildi</Text>
          </View>
        ) : (
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}> 
            <Text style={styles.statusText}>{item.statusText}</Text>
          </View>
        )}
      </View>

      <View style={styles.reservationDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>📅 Tarih:</Text>
          <Text style={styles.detailValue}>{date.full} ({date.dayName})</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>🕒 Saat:</Text>
          <Text style={styles.detailValue}>{item.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>👥 Kişi:</Text>
          <Text style={styles.detailValue}>{item.people} kişi</Text>
        </View>
        {item.specialRequests && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>💬 Not:</Text>
            <Text style={styles.detailValue}>{item.specialRequests}</Text>
          </View>
        )}
      </View>

      {/* Butonlar: Aktif rezervasyonda iki buton yan yana, geçmişte sadece ara butonu sola yaslanmış ve sabit boyutta */}
      {isPast ? (
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
          <TouchableOpacity style={[styles.searchButton, { flex: 1 }]}> 
            <Text style={styles.searchButtonText}>Restoranı Ara</Text>
          </TouchableOpacity>
          {showReviewButton && (
            <TouchableOpacity 
              style={[
                styles.reviewButton, 
                { flex: 1 },
                isReviewed && styles.reviewButtonDisabled
              ]}
              onPress={() => !isReviewed && navigation?.navigate('Review', { reservation: item })}
              disabled={isReviewed}
            > 
              <Text style={[styles.reviewButtonText, isReviewed && styles.reviewButtonTextDisabled]}>
                {isReviewed ? 'Değerlendirildi' : 'Değerlendir'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
          <TouchableOpacity style={[styles.searchButton, { flex: 1 }]}> 
            <Text style={styles.searchButtonText}>Restoranı Ara</Text>
          </TouchableOpacity>
          {showCancelButton && (
            <TouchableOpacity style={[styles.cancelButton, { flex: 1, alignItems: 'center', justifyContent: 'center' }]} onPress={() => {
              if (typeof onCancel === 'function') {
                onCancel(item);
              } else {
                console.warn('onCancel fonksiyonu tanımlı değil!');
              }
            }}>
              <Text style={styles.cancelButtonText}>İptal Et</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default ReservationCard;