import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFFFFF' },
  backButton: { padding: 8 },
  backIcon: { fontSize: 22, color: '#2C3E50' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50' },
  content: { padding: 20 },
  restaurantName: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { color: '#7F8C8D' },
  value: { fontWeight: '600', color: '#2C3E50' },
  confirmButton: { marginTop: 30, backgroundColor: '#FF6B35', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  confirmText: { color: '#FFFFFF', fontWeight: 'bold' }
});
