import { StyleSheet, Dimensions, Platform } from 'react-native';

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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    ...createShadowStyle(2),
    zIndex: 1,
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
  searchButton: {
    padding: 8,
  },
  searchIcon: {
    fontSize: 20,
    color: '#2C3E50',
  },
  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  // Web Map Styles
  webMapContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  // Web Mobil Görünüm Stilleri
  webMobileMap: {
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
    borderColor: '#FFFFFF',
    ...createShadowStyle(3),
  },
  webUserInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4285F4',
  },
  webRestaurantPin: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -15 }, { translateY: -25 }],
  },
  webPinHead: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EA4335',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...createShadowStyle(3),
  },
  webPinIcon: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  webPinPoint: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#EA4335',
    marginTop: -2,
  },
  webMapControls: {
    position: 'absolute',
    right: 16,
    bottom: 150,
    backgroundColor: '#FFFFFF',
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
    color: '#666666',
  },
  webCompass: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
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
  webMapPlaceholder: {
    height: 200,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#BBDEFB',
    borderStyle: 'dashed',
  },
  webMapText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  webMapSubtext: {
    fontSize: 14,
    color: '#424242',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  webRestaurantList: {
    flex: 1,
    padding: 16,
  },
  webListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  webRestaurantItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
  webRestaurantInfo: {
    flex: 1,
  },
  webRestaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  webRestaurantType: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  webRestaurantRating: {
    fontSize: 14,
    color: '#F39C12',
    fontWeight: '600',
    marginBottom: 4,
  },
  webRestaurantAddress: {
    fontSize: 12,
    color: '#95A5A6',
  },
  webRestaurantIcon: {
    fontSize: 24,
    marginLeft: 12,
  },
  // Real Map Styles
  mapContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  realMap: {
    flex: 1,
  },
  customMarker: {
    alignItems: 'center',
  },
  markerContainer: {
    backgroundColor: '#EA4335',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  markerEmoji: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  markerTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#EA4335',
    marginTop: -2,
  },
  // Bottom Sheet Styles
  bottomSheet: {
    position: 'absolute',
    bottom: 90, // Bottom tab navigator için space
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    maxHeight: 200,
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
    color: '#2C3E50',
    marginBottom: 12,
  },
  restaurantScrollList: {
    flex: 1,
  },
  restaurantListItem: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  restaurantItemInfo: {
    flex: 1,
  },
  restaurantItemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
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
    color: '#666666',
    fontWeight: '500',
  },
  // Bottom Info Bar Styles
  bottomInfo: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoText: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '500',
  },
  listButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  listButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  tabSpacer: {
    height: 90, // Bottom tab navigator için space
  },
});