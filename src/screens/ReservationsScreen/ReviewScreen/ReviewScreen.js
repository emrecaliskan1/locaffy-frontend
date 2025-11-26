import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { styles } from './styles';
import { useTheme } from '../../../context/ThemeContext';

export default function ReviewScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { reservation } = route.params || {};
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showThankYouModal, setShowThankYouModal] = useState(false);

  const handleSubmit = () => {
    // TODO: Backend'e gönderilecek - API çağrısı yapılacak
    // POST /api/reviews
    // Body: { reservationId: reservation.id, rating, comment, restaurantId: reservation.restaurantId }
    // Bu yorum restoranın yorumlar kısmına eklenecek
    
    console.log('Review submitted:', { 
      reservationId: reservation?.id,
      restaurantName: reservation?.restaurantName,
      rating, 
      comment,
      timestamp: new Date().toISOString()
    });
    
    setShowThankYouModal(true);
    
    // 2 saniye sonra geçmiş rezervasyonlara dön
    setTimeout(() => {
      setShowThankYouModal(false);
      navigation.goBack();
    }, 2000);
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
          >
            <FontAwesome
              name={star <= rating ? 'star' : 'star-o'}
              size={40}
              color={star <= rating ? '#F1C40F' : '#E1E8ED'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <FontAwesome name="arrow-left" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Değerlendirme</Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Restaurant Info */}
        <View style={styles.restaurantCard}>
          <Text style={styles.restaurantName}>{reservation?.restaurantName}</Text>
          <Text style={styles.reservationNumber}>{reservation?.reservationNumber}</Text>
        </View>

        {/* Rating Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deneyiminizi Puanlayın</Text>
          <Text style={styles.sectionSubtitle}>
            {rating === 0
              ? 'Bir yıldız seçin'
              : rating === 1
              ? 'Çok Kötü'
              : rating === 2
              ? 'Kötü'
              : rating === 3
              ? 'Orta'
              : rating === 4
              ? 'İyi'
              : 'Mükemmel'}
          </Text>
          {renderStars()}
        </View>

        {/* Comment Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yorumunuz</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Deneyiminizi bizimle paylaşın... (İsteğe bağlı)"
            placeholderTextColor="#95A5A6"
            multiline
            numberOfLines={6}
            value={comment}
            onChangeText={setComment}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              rating === 0 && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={rating === 0}
          >
            <Text style={styles.submitButtonText}>Gönder</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Thank You Modal */}
      <Modal
        visible={showThankYouModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.thankYouCard}>
            <FontAwesome name="check-circle" size={64} color="#27AE60" />
            <Text style={styles.thankYouTitle}>Geri Bildiriminiz İçin</Text>
            <Text style={styles.thankYouTitle}>Teşekkür Ederiz!</Text>
            <Text style={styles.thankYouSubtitle}>
              Değerlendirmeniz kaydedildi
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
