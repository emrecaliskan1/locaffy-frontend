import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5DC' },
  header: { padding: 20, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', color: '#2C3E50' },
  content: { padding: 20, alignItems: 'center' },
  thanks: { fontSize: 24, fontWeight: '800', color: '#2C3E50', marginBottom: 10 },
  info: { color: '#7F8C8D', textAlign: 'center', marginBottom: 20 },
  summary: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, width: '100%', marginBottom: 20 },
  summaryText: { fontSize: 16, color: '#2C3E50', marginBottom: 6 },
  doneButton: { backgroundColor: '#FF6B35', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  doneText: { color: '#FFFFFF', fontWeight: '700' }
});
