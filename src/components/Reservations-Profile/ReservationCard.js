import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { reservationService } from '../../services';

const ReservationCard = ({ item, styles, onCancel, isPast, navigation }) => {
  const [showRejectModal, setShowRejectModal] = useState(false);

  const formatDate = (reservationTime) => {
    return reservationService.formatReservationTime(reservationTime);
  };

  const getStatusColor = (status) => {
    if (isPast) {
      return reservationService.getPastReservationStatusColor(status, item.reservationTime);
    }
    return reservationService.getReservationStatusColor(status);
  };

  const getStatusText = (status) => {
    if (isPast) {
      return reservationService.getPastReservationStatusText(status, item.reservationTime);
    }
    return reservationService.getReservationStatusText(status);
  };

  const showCancelButton = (item.status === 'APPROVED' || item.status === 'PENDING') && !isPast;
  const showReviewButton = isPast && item.status === 'APPROVED' && reservationService.isReservationPast(item.reservationTime);
  const showRejectReasonButton = item.status === 'REJECTED' && item.rejectionReason;

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

      {/* Rezervasyon Detayları */}
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
      </View>

      {/* Butonlar */}
      {isPast ? (
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
          {showReviewButton && (
            <TouchableOpacity 
              style={[styles.rateButton, { flex: 1 }]}
              onPress={() => navigation?.navigate('Review', { reservation: item })}
            > 
              <Text style={styles.rateButtonText}>Değerlendir</Text>
            </TouchableOpacity>
          )}
          {showRejectReasonButton && (
            <TouchableOpacity 
              style={[styles.rejectReasonButton, { flex: 1 }]}
              onPress={() => setShowRejectModal(true)}
            > 
              <Text style={styles.rejectReasonButtonText}>Red Sebebini Gör</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
          {showCancelButton && (
            <TouchableOpacity 
              style={[styles.cancelButton, { flex: 1, alignItems: 'center', justifyContent: 'center' }]} 
              onPress={() => onCancel && onCancel(item)}
            >
              <Text style={styles.cancelButtonText}>İptal Et</Text>
            </TouchableOpacity>
          )}
          {showRejectReasonButton && (
            <TouchableOpacity 
              style={[styles.rejectReasonButton, { flex: 1 }]}
              onPress={() => setShowRejectModal(true)}
            > 
              <Text style={styles.rejectReasonButtonText}>Red Sebebini Gör</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
      {/* Red Sebebi Modal */}
      <Modal
        visible={showRejectModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRejectModal(false)}
      >
        <View style={{ 
          flex: 1, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          <View style={{ 
            backgroundColor: '#fff', 
            borderRadius: 16, 
            padding: 24, 
            width: 320, 
            maxWidth: '90%', 
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4
          }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: 'bold', 
              color: '#F44336', 
              marginBottom: 16,
              textAlign: 'center'
            }}>
              Rezervasyon Reddedildi
            </Text>
            <Text style={{ 
              fontSize: 14, 
              color: '#666', 
              marginBottom: 4 
            }}>
              Red Sebebi:
            </Text>
            <Text style={{ 
              fontSize: 16, 
              color: '#2C3E50', 
              lineHeight: 24,
              marginBottom: 20,
              backgroundColor: '#f8f9fa',
              padding: 12,
              borderRadius: 8,
              borderLeftWidth: 4,
              borderLeftColor: '#F44336'
            }}>
              {item.rejectionReason}
            </Text>
            <TouchableOpacity
              style={{ 
                backgroundColor: '#F44336', 
                paddingHorizontal: 24, 
                paddingVertical: 12, 
                borderRadius: 8,
                alignSelf: 'center'
              }}
              onPress={() => setShowRejectModal(false)}
            >
              <Text style={{ 
                color: '#fff', 
                fontWeight: 'bold', 
                fontSize: 16 
              }}>
                Tamam
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ReservationCard;