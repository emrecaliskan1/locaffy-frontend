import { StyleSheet } from 'react-native';

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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: '#2C3E50',
  },
  locationContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  locationLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  locationTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  profileButton: {
    padding: 8,
  },
  profileIcon: {
    fontSize: 24,
    color: '#2C3E50',
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    width: '100%',
    maxWidth: 400,
  },
  searchIcon: {
    fontSize: 16,
    color: '#6C757D',
    marginRight: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#2C3E50',
    paddingVertical: 0,
  },
  filterButton: {
    padding: 4,
    marginLeft: 6,
  },
  filterIcon: {
    fontSize: 20,
    color: '#6C757D',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  restaurantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardImageContainer: {
    position: 'relative',
    height: 180,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  statusBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#27AE60',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginRight: 4,
  },
  reviews: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  restaurantType: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'column',
    gap: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
});