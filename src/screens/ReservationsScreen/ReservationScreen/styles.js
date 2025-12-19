import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  content: {
    flex: 1,
  },
  restaurantInfo: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
    paddingVertical: 8,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  restaurantName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 6,
  },
  restaurantType: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 3,
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  sectionTitleLarge: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  datesContainer: {
    marginHorizontal: -5,
  },
  datesContent: {
    paddingHorizontal: 5,
  },
  dateItem: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 55,
  },
  dateFullDayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#AAAAAA',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  dateDayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDateCircle: {
    backgroundColor: '#667eea',
  },
  dateDayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#AAAAAA',
  },
  selectedDateNumberText: {
    color: '#FFFFFF',
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
  dateDayClosed: {
    color: '#BBBBBB',
  },
  dateClosedText: {
    fontSize: 9,
    color: '#BBBBBB',
    marginTop: 3,
  },
  peopleScrollContainer: {
    marginHorizontal: -5,
  },
  peopleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 25,
    paddingHorizontal: 5,
  },
  peopleOption: {
    alignItems: 'center',
    flexDirection: 'column',
    gap: 6,
  },
  selectedPeopleOption: {
    // Seçili kişi için ekstra stil
  },
  peopleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedPeopleIconContainer: {
    backgroundColor: '#667eea',
  },
  peopleNumberText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  selectedPeopleText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  timesContainer: {
    marginHorizontal: -5,
  },
  timesContent: {
    paddingHorizontal: 5,
  },
  timeSlot: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginHorizontal: 4,
    minWidth: 75,
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#667eea',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  selectedTimeText: {
    color: '#FFFFFF',
  },
  timeSlotReason: {
    fontSize: 9,
    color: '#777777',
    marginTop: 2,
    textAlign: 'center',
  },
  disabledTimeSlot: {
    backgroundColor: '#F5F5F5',
    opacity: 0.5,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  continueButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#E1E8ED',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loadingWrapper: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#7F8C8D',
  },
  todayDateItem: {
    borderWidth: 1.5,
    borderColor: '#2C3E50',
  },
  summarySection: {
    marginHorizontal: 20,
    paddingVertical: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#7F8C8D',
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  summaryActions: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#E1E8ED',
  },
  clearButtonText: {
    color: '#2C3E50',
    fontWeight: '600',
  },
  noteInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E1E8ED',
    minHeight: 80,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#95A5A6',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginHorizontal: 40,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  tickContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 20,
  },
});