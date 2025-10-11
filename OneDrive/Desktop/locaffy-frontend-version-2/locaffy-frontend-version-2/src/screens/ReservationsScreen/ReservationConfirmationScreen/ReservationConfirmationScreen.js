import React, { useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Animated, Easing } from 'react-native';

export default function ReservationConfirmationScreen({ route, navigation }) {
  const scale = new Animated.Value(0.6);
  const opacity = new Animated.Value(0);
  const rotate = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: false }),
      Animated.spring(scale, { toValue: 1.05, friction: 6, useNativeDriver: false }),
      Animated.timing(rotate, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start(() => {
      // delay briefly then replace with Reservations so user lands there and cannot go back to confirmation
      setTimeout(() => {
        navigation.replace('Reservations', { from: 'restaurant', restaurant: route?.params?.restaurant });
      }, 700);
    });
  }, []);

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Animated.View style={[styles.badge, { opacity, transform: [{ scale }, { rotate: spin }] }]}> 
          <Text style={styles.check}>✓</Text>
        </Animated.View>
        <Text style={styles.title}>Rezervasyon Onaylandı</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  badge: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#27AE60', alignItems: 'center', justifyContent: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.18, shadowRadius: 8 },
  check: { color: '#fff', fontSize: 64, fontWeight: '800' },
  title: { marginTop: 18, fontSize: 18, fontWeight: '700', color: '#2C3E50' }
});
