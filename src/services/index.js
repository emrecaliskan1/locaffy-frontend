export { default as authService } from './authService';
export { default as placeService } from './placeService';
export { default as menuService } from './menuService';
export { default as reviewService } from './reviewService';
export { default as adminService } from './adminService';
export { default as imageService } from './imageService';
export { default as userService } from './userService';
export { default as reservationService } from './reservationService';

export { 
  businessService, 
  businessApplicationService 
} from './businessService';


/*

const myPlaces = await businessService.getMyPlaces();
const myMenuItems = await menuService.getMyMenuItems();

const nearbyPlaces = await placeService.getNearbyPlaces(40.7128, -74.0060);
const placeReviews = await reviewService.getPlaceReviews(1);

const imageFile = new File(['...'], 'profile.jpg', { type: 'image/jpeg' });
await imageService.uploadProfileImage(imageFile);

*/