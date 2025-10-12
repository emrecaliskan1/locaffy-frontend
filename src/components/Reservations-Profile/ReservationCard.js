import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { dayNames, monthNames } from '../../static-data/reservationData';

const ReservationCard = ({ item, styles }) => {
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
          <Text style={styles.restaurantName}>{item.restaurantName}</Text>
          <Text style={styles.reservationNumber}>{item.reservationNumber}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.statusText}</Text>
        </View>
      </View>

      <View style={styles.reservationDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>📅 Tarih:</Text>
          <Text style={styles.detailValue}>{date.full} ({date.dayName})</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>🕐 Saat:</Text>
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

      <View style={styles.reservationFooter}>
        {item.status === 'onaylandı' && canCancelReservation(item) && (
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>İptal Et</Text>
          </TouchableOpacity>
        )}
        {item.status === 'tamamlandı' && !item.rating && (
          <TouchableOpacity style={styles.rateButton}>
            <Text style={styles.rateButtonText}>Değerlendir</Text>
          </TouchableOpacity>
        )}
        {item.status === 'onaylandı' && (
          <TouchableOpacity style={styles.callButton}>
            <Text style={styles.callButtonText}>Ara</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ReservationCard;