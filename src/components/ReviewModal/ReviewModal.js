import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  ScrollView,
  StatusBar
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { reviewService } from '../../services';
import { useTheme } from '../../context/ThemeContext';
import Toast from '../Toast/Toast';
import styles from './styles';
import { useToast } from '../../hooks';

const ReviewModal = ({ 
  visible, 
  onClose, 
  reservation, 
  onReviewSubmitted 
}) => {
  const { theme } = useTheme();
  const { toast, showToast, hideToast } = useToast();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleStarPress = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      showToast('Lütfen bir puan verin (1-5 yıldız).', 'error');
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
      
      showToast('Değerlendirmeniz başarıyla gönderildi!', 'success');

      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      setTimeout(() => {
        setRating(0);
        setComment('');
        hideToast();
        onClose();
      }, 2000);
    } catch (error) {
      showToast(error.message || 'Değerlendirme eklenirken bir hata oluştu.', 'error');
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
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeText, { color: theme.colors.primary }]}>İptal</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>Değerlendirme</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Rezervasyon Bilgisi */}
          <View style={[styles.reservationSection, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.reservationNumber, { color: theme.colors.primary }]}>
              Rezervasyon: {reservation?.reservationNumber || `#${reservation?.id}`}
            </Text>
            <Text style={[styles.restaurantName, { color: theme.colors.text }]}>
              {reservation?.place?.name || reservation?.restaurantName || reservation?.placeName}
            </Text>
            <Text style={[styles.restaurantAddress, { color: theme.colors.textSecondary }]}>
              {reservation?.place?.address || reservation?.placeAddress || reservation?.address || 'Adres bilgisi yok'}
            </Text>
          </View>

          {/* Yıldız verme */}
          <View style={[styles.ratingSection, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Puanınız</Text>
            {renderStars()}
            <Text style={[styles.ratingText, { color: theme.colors.primary }]}>{getRatingText()}</Text>
          </View>

          {/* Yorum bölümü */}
          <View style={styles.commentSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Yorumunuz 
              <Text style={[styles.optional, { color: theme.colors.textSecondary }]}> (İsteğe bağlı)</Text>
            </Text>
            <TextInput
              style={[styles.commentInput, { 
                backgroundColor: theme.colors.surface, 
                borderColor: theme.colors.border,
                color: theme.colors.text 
              }]}
              placeholder="Deneyiminizi paylaşın..."
              placeholderTextColor={theme.colors.textTertiary}
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={4}
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={[styles.charCount, { color: theme.colors.textTertiary }]}>{comment.length}/500</Text>
          </View>
        </ScrollView>

        {/* Gönder Butonu */}
        <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: theme.colors.primary },
              (rating === 0 || submitting) && [styles.disabledButton, { backgroundColor: theme.colors.border }]
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
        onHide={hideToast}
      />
    </Modal>
  );
};

export default ReviewModal;
