import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  StatusBar
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { reviewService } from '../../services';
import Toast from '../Toast/Toast';

const ReviewModal = ({ 
  visible, 
  onClose, 
  reservation, 
  onReviewSubmitted 
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const handleStarPress = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert('Puan Gerekli', 'Lütfen bir puan verin (1-5 yıldız).');
      return;
    }
    try {
      setSubmitting(true);
      const reviewData = {
        placeId: reservation.place?.id || reservation.placeId,
        rating: rating,
        comment: comment.trim() || null
      };
      const newReview = await reviewService.createReview(reviewData);
      
      setToast({
        visible: true,
        message: 'Değerlendirmeniz başarıyla gönderildi!',
        type: 'success'
      });

      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      setTimeout(() => {
        setRating(0);
        setComment('');
        setToast({ visible: false, message: '', type: 'success' });
        onClose();
      }, 2000);
    } catch (error) {
      setToast({
        visible: true,
        message: error.message || 'Değerlendirme eklenirken bir hata oluştu.',
        type: 'error'
      });

      setTimeout(() => {
        setToast({ visible: false, message: '', type: 'success' });
      }, 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleStarPress(star)}
            style={styles.starButton}
          >
            <FontAwesome
              name={star <= rating ? 'star' : 'star-o'}
              size={32}
              color={star <= rating ? '#F1C40F' : '#E1E8ED'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const getRatingText = () => {
    const ratingTexts = {
      1: 'Çok kötü bir deneyimdi.',
      2: 'Kötü bir deneyimdi.',
      3: 'Memnun kaldım.',
      4: 'Çok iyiydi.',
      5: 'Mükemmeldi.'
    };
    return rating > 0 ? ratingTexts[rating] : 'Puan Verin';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>İptal</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Değerlendirme</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Rezervasyon Bilgisi */}
          <View style={styles.reservationSection}>
            <Text style={styles.reservationNumber}>
              Rezervasyon: {reservation?.reservationNumber || `#${reservation?.id}`}
            </Text>
            <Text style={styles.restaurantName}>
              {reservation?.place?.name || reservation?.restaurantName || reservation?.placeName}
            </Text>
            <Text style={styles.restaurantAddress}>
              {reservation?.place?.address || reservation?.placeAddress || reservation?.address || 'Adres bilgisi yok'}
            </Text>
          </View>

          {/* Yıldız verme */}
          <View style={styles.ratingSection}>
            <Text style={styles.sectionTitle}>Puanınız</Text>
            {renderStars()}
            <Text style={styles.ratingText}>{getRatingText()}</Text>
          </View>

          {/* Yorum bölümü */}
          <View style={styles.commentSection}>
            <Text style={styles.sectionTitle}>
              Yorumunuz 
              <Text style={styles.optional}> (İsteğe bağlı)</Text>
            </Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Deneyiminizi paylaşın..."
              placeholderTextColor="#95A5A6"
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={4}
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{comment.length}/500</Text>
          </View>
        </ScrollView>

        {/* Gönder Butonu */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (rating === 0 || submitting) && styles.disabledButton
            ]}
            onPress={handleSubmitReview}
            disabled={rating === 0 || submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Değerlendirmeyi Gönder</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Toast */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  reservationSection: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
    alignItems: 'center',
  },
  reservationNumber: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
    textAlign: 'center',
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  ratingSection: {
    paddingVertical: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  optional: {
    fontWeight: 'normal',
    color: '#7F8C8D',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  starButton: {
    padding: 5,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
  },
  commentSection: {
    paddingVertical: 20,
  },
  commentInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#95A5A6',
    marginTop: 8,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
  },
  submitButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#E1E8ED',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default ReviewModal;