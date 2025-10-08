import { StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ececedbb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#2C3E50',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  placeholder: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 16,
    marginHorizontal: 10,
  },
  activeTabButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7F8C8D',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 20,
  },
  reservationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  reservationNumber: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  reservationDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '500',
    flex: 1,
  },
  specialRequests: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  specialRequestsLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  specialRequestsText: {
    fontSize: 14,
    color: '#2C3E50',
    fontStyle: 'italic',
  },
  reservationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
    paddingTop: 15,
  },
  contactButton: {
    backgroundColor: '#3498DB',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
  },
});