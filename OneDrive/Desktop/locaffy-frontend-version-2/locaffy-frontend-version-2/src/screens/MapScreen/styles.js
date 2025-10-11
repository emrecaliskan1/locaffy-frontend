import { StyleSheet, Dimensions, Platform } from 'react-native';
import COLORS from '../../constants/colors';

const { width, height } = Dimensions.get('window');

// Web uyumlu shadow helper
const createShadowStyle = (elevation) => {
  if (Platform.OS === 'web') {
    return {
      boxShadow: `0 ${elevation * 0.5}px ${elevation * 1}px rgba(0, 0, 0, 0.15)`,
    };
  }
  return {
    elevation,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: elevation * 0.5,
    },
    shadowOpacity: 0.15,
    shadowRadius: elevation * 0.8,
  };
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    ...createShadowStyle(2),
    zIndex: 1,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#4285F4',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  searchButton: {
    padding: 8,
  },
  searchIcon: {
    fontSize: 22,
    color: '#EA4335',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285F4',
    marginTop: 12,
  },
  // Web Map Styles
  webMapContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  webMapView: {
    flex: 1,
    position: 'relative',
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#F0F4F7',
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(158, 158, 158, 0.15)',
  },
  webUserLocation: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  webUserDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(66, 133, 244, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    ...createShadowStyle(3),
  },
  webUserInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4285F4',
  },
  webRestaurantPin: {
    alignItems: 'center',
  },
  webRestaurantContainer: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -15 }, { translateY: -25 }],
  },
  webPinHead: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EA4335',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    ...createShadowStyle(4),
  },
  webPinIcon: {
    fontSize: 16,
    color: '#fff',
  },
  webPinPoint: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#EA4335',
    marginTop: -3,
  },
  webMarkerLabel: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 10,
    maxWidth: 100,
  },
  webMarkerLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  webMapControls: {
    position: 'absolute',
    right: 16,
    bottom: 150,
    backgroundColor: '#fff',
    borderRadius: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  webZoomButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  webZoomText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  webCompass: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  webCompassText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EA4335',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  realMap: {
    flex: 1,
    borderRadius: 0,
    overflow: 'hidden',
  },
  customMarker: {
    alignItems: 'center',
  },
  customMarkerContainer: {
    alignItems: 'center',
  },
  markerContainer: {
    backgroundColor: '#EA4335',
    padding: 6,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerEmoji: {
    fontSize: 20,
    color: '#fff',
  },
  markerTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#EA4335',
    marginTop: -3,
  },
  markerLabel: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 5,
    maxWidth: 120,
  },
  markerLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 65,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  bottomSheetHeader: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  bottomSheetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },
  restaurantScrollList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    maxHeight: 200,
  },
  restaurantListItem: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    padding: 12,
    marginBottom: 6,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  restaurantItemInfo: {
    flex: 1,
  },
  restaurantItemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  restaurantItemType: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  restaurantItemRating: {
    fontSize: 12,
    color: '#F39C12',
    fontWeight: '600',
    marginBottom: 2,
  },
  restaurantItemAddress: {
    fontSize: 10,
    color: '#95A5A6',
  },
  restaurantItemRight: {
    alignItems: 'center',
    marginLeft: 8,
  },
  restaurantItemIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  restaurantItemDistance: {
    fontSize: 10,
    color: '#4285F4',
    fontWeight: '500',
  },
  tabSpacer: {
    height: 70, // Bottom tab navigator için uygun mesafe
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 350,
    ...createShadowStyle(10),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 10,
  },
  modalRestaurantIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EA4335',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalIconEmoji: {
    fontSize: 24,
    color: '#fff',
  },
  modalCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  modalRestaurantName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5,
  },
  modalRestaurantType: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalRating: {
    fontSize: 16,
    color: '#F39C12',
    fontWeight: '600',
  },
  modalDistance: {
    fontSize: 14,
    color: '#4285F4',
    fontWeight: '500',
  },
  modalAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  modalPrice: {
    fontSize: 14,
    color: '#27AE60',
    fontWeight: '600',
  },
  modalActions: {
    padding: 20,
    paddingTop: 10,
  },
  modalDetailButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    ...createShadowStyle(3),
  },
  modalDetailButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});