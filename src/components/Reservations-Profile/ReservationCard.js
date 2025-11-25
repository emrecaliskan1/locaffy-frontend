import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { reservationService } from '../../services';

const ReservationCard = ({ item, styles, onCancel, isPast, navigation }) => {
  const formatDate = (reservationTime) => {
    return reservationService.formatReservationTime(reservationTime);
  };

  const getStatusColor = (status) => {
    return reservationService.getReservationStatusColor(status);
  };

  const getStatusText = (status) => {
    return reservationService.getReservationStatusText(status);
  };

  const showCancelButton = (item.status === 'APPROVED' || item.status === 'PENDING') && !isPast;
  const showReviewButton = isPast && item.status === 'APPROVED' && reservationService.isReservationPast(item.reservationTime);

  return (
    <View style={styles.reservationCard}>
      <View style={styles.reservationHeader}>
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{item.placeName}</Text>
          <Text style={styles.reservationNumber}>#{item.id}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}> 
          <Text style={[styles.statusText, { fontSize: item.status === 'APPROVED' ? 12 : 14 }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.reservationDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>📅 Tarih & Saat:</Text>
          <Text style={styles.detailValue}>{formatDate(item.reservationTime)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>👥 Kişi:</Text>
          <Text style={styles.detailValue}>{item.numberOfPeople} kişi</Text>
        </View>
        {item.note && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>💬 Not:</Text>
            <Text style={styles.detailValue}>{item.note}</Text>
          </View>
        )}
        {item.status === 'REJECTED' && item.rejectionReason && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>❌ Red Sebebi:</Text>
            <Text style={[styles.detailValue, { color: '#F44336' }]}>{item.rejectionReason}</Text>
          </View>
        )}
      </View>

      {/* Butonlar */}
      {isPast ? (
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
          <TouchableOpacity style={[styles.searchButton, { flex: 1 }]}> 
            <Text style={styles.searchButtonText}>Restoranı Ara</Text>
          </TouchableOpacity>
          {showReviewButton && (
            <TouchableOpacity 
              style={[styles.reviewButton, { flex: 1 }]}
              onPress={() => navigation?.navigate('Review', { reservation: item })}
            > 
              <Text style={styles.reviewButtonText}>Değerlendir</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
          <TouchableOpacity style={[styles.searchButton, { flex: 1 }]}> 
            <Text style={styles.searchButtonText}>Restoranı Ara</Text>
          </TouchableOpacity>
          {showCancelButton && (
            <TouchableOpacity 
              style={[styles.cancelButton, { flex: 1, alignItems: 'center', justifyContent: 'center' }]} 
              onPress={() => onCancel && onCancel(item)}
            >
              <Text style={styles.cancelButtonText}>İptal Et</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default ReservationCard;