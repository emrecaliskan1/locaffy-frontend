import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Platform, Alert } from 'react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/images`;

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return token;
  } catch (e) {
    return null;
  }
};

const buildHeaders = async (contentType = 'application/json') => {
  const token = await getToken();
  return {
    'Content-Type': contentType,
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const imageService = {

  // İzin yönetimi
  requestPermissions: async () => {
    try {
      if (Platform.OS !== 'web') {
        // Sadece medya kütüphanesi izni
        const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (mediaLibraryStatus !== 'granted') {
          Alert.alert(
            'İzin Gerekli',
            'Profil fotoğrafı yüklemek için galeri iznine ihtiyacımız var.',
            [{ text: 'Tamam' }]
          );
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('İzin isteme hatası:', error);
      return false;
    }
  },

  // Resim seçme seçeneklerini göster
  showImagePickerOptions: () => {
    return new Promise((resolve) => {
      // Web platformunda direkt galeriyi aç
      if (Platform.OS === 'web') {
        imageService.pickImageFromGallery().then((result) => {
          resolve(result);
        }).catch((error) => {
          console.error('Web galeri hatası:', error);
          resolve(null);
        });
        return;
      }

      // Mobil platformlarda sadece galeri
      imageService.pickImageFromGallery().then((result) => {
        resolve(result);
      }).catch((error) => {
        console.error('Galeri hatası:', error);
        resolve(null);
      });
    });
  },

  // Galeriden resim seç
  pickImageFromGallery: async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: Platform.OS === 'web' ? 'images' : ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled) {
        return result.assets[0];
      }
      return null;
    } catch (error) {
      console.error('Galeri seçim hatası:', error);
      throw error;
    }
  },

  // Tam profil fotoğrafı seçme ve yükleme işlemi
  selectAndUploadProfileImage: async () => {
    try {
      // İzinleri kontrol et
      const hasPermissions = await imageService.requestPermissions();
      if (!hasPermissions) {
        return { success: false, message: 'İzinler reddedildi' };
      }
      
      // Resim seçme seçeneklerini göster
      const selectedImage = await imageService.showImagePickerOptions();
      if (!selectedImage) {
        return { success: false, message: 'Resim seçilmedi' };
      }

      // Dosya boyutu kontrolü (5MB)
      if (selectedImage.fileSize && selectedImage.fileSize > 5 * 1024 * 1024) {
        return { 
          success: false, 
          message: 'Dosya boyutu çok büyük. Maksimum 5MB olmalıdır.' 
        };
      }

      // Platform specific file object oluştur
      let fileData;
      
      if (Platform.OS === 'web') {
        // Web için Blob objesi oluştur
        const response = await fetch(selectedImage.uri);
        const blob = await response.blob();
        fileData = new File([blob], selectedImage.fileName || `profile_${Date.now()}.jpg`, {
          type: selectedImage.mimeType || 'image/jpeg'
        });
      } else {
        // Mobil için URI-based object
        fileData = {
          uri: selectedImage.uri,
          type: selectedImage.mimeType || 'image/jpeg',
          name: selectedImage.fileName || `profile_${Date.now()}.jpg`
        };
      }

      // Sunucuya yükle
      const response = await imageService.uploadProfileImage(fileData);
      
      return {
        success: true,
        data: response,
        localUri: selectedImage.uri // Yerel önizleme için
      };

    } catch (error) {
      console.error('Profil fotoğrafı yükleme hatası:', error);
      
      return {
        success: false,
        message: error.response?.data?.error || error.message || 'Bir hata oluştu'
      };
    }
  },

  // NORMAL USER , BUSINESS OWNER , ADMIN
  uploadProfileImage: async (imageFile) => {
    try {
      const formData = new FormData();
      
      if (Platform.OS === 'web') {
        // Web platformu için File objesi direkt append edilir
        formData.append('file', imageFile);
      } else {
        // Mobil platformu için URI-based object
        formData.append('file', {
          uri: imageFile.uri,
          type: imageFile.type,
          name: imageFile.name
        });
      }
      
      const headers = await buildHeaders('multipart/form-data');
      
      const response = await axios.post(`${API_BASE_URL}/images/profile`, formData, { 
        headers,
        timeout: 30000
      });
      
      return response.data;
    } catch (error) {
      console.error('Profil fotoğrafı yükleme hatası:', error.response?.data || error.message);
      throw error;
    }
  },

  // BUSINESS OWNER , ADMIN
  uploadPlaceImage: async (placeId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      const headers = await buildHeaders('multipart/form-data');
      const response = await axios.post(`${BASE_URL}/place/${placeId}`, formData, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // NORMAL USER , BUSINESS OWNER , ADMIN
  deleteProfileImage: async () => {
    try {
      const headers = await buildHeaders();
      const response = await axios.delete(`${BASE_URL}/profile`, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // BUSINESS OWNER , ADMIN
  deletePlaceImage: async (placeId) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.delete(`${BASE_URL}/place/${placeId}`, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // BACKENDDEKİ MenuController İÇİNDEKİ IMAGE KONULU ENDPOINTLER

  // BUSINESS OWNER
  uploadMenuItemImage: async (menuItemId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      const headers = await buildHeaders('multipart/form-data');
      const response = await axios.post(`${API_BASE_URL}/menu/items/${menuItemId}/image`, formData, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // BUSINESS OWNER
  deleteMenuItemImage: async (menuItemId) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.delete(`${API_BASE_URL}/menu/items/${menuItemId}/image`, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default imageService;