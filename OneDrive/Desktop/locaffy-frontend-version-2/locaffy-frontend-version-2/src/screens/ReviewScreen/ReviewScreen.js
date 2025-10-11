import React, { useState } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';

export default function ReviewScreen({ route, navigation }) {
  const { reservation } = route.params || {};
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // mock backend
  const saveReviewToBackend = async (rating, comment, reservationId) => {
    // simulate network
    return new Promise((res) => setTimeout(() => res(true), 700));
  };

  const handleSend = async () => {
    if (rating < 1) return alert('Lütfen 1-5 arasında bir değerlendirme seçin');
    setSubmitting(true);
    const ok = await saveReviewToBackend(rating, comment, reservation.id);
    setSubmitting(false);
    if (ok) {
      setDone(true);
      setTimeout(() => {
        // Replace current screen with Reservations so user can't go back to the thank-you screen
        // preserve the originating 'from' param so Reservations keeps its previous back behaviour
        const from = route?.params?.from;
        navigation.replace('Reservations', { reviewedId: reservation.id, from });
      }, 2000);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)} style={[styles.star, rating >= i && styles.starActive]}>
          <Text style={{ color: rating >= i ? '#fff' : '#667eea', fontWeight: '700', fontSize: 18 }}>{rating >= i ? '★' : '☆'}</Text>
        </TouchableOpacity>
      );
    }
    return <View style={{ flexDirection: 'row', justifyContent: 'center' }}>{stars}</View>;
  };

  if (done) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.thanks}>Geri Dönüşünüz İçin Teşekkür Ederiz!</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{reservation?.restaurantName} Değerlendir</Text>

        <View style={{ marginVertical: 20 }}>
          {renderStars()}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Deneyiminizi anlatın..."
          multiline
          numberOfLines={6}
          value={comment}
          onChangeText={setComment}
        />

        <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={submitting}>
          <Text style={styles.sendText}>{submitting ? 'Gönderiliyor...' : 'Geri Bildirimi Gönder'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { padding: 20 },
  title: { fontSize: 20, fontWeight: '700', color: '#2C3E50' },
  star: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#FFD54F', alignItems: 'center', justifyContent: 'center', marginHorizontal: 6, backgroundColor: 'transparent' },
  starActive: { backgroundColor: '#FFD54F', borderColor: '#FFC107' },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 12, minHeight: 120, textAlignVertical: 'top' },
  sendButton: { marginTop: 16, backgroundColor: '#667eea', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  sendText: { color: '#fff', fontWeight: '700' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  thanks: { fontSize: 20, fontWeight: '800', color: '#2C3E50' }
});
