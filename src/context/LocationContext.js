import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cities } from '../constants/cities';
import Toast from '../components/Toast/Toast';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsCitySelection, setNeedsCitySelection] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('warning');
  const [onCitySelectedCallback, setOnCitySelectedCallback] = useState(null);

  // Uygulama başlangıcında lokasyon durumunu kontrol et
  useEffect(() => {
    initializeLocation();
    
    // Global tetikleme sistemi kuruluyor
    global.triggerLocationCheck = checkLocationAfterLogin;
    
    return () => {
      global.triggerLocationCheck = null;
    };
  }, []);

  const initializeLocation = async () => {
    try {
      setIsLoading(true);
      
      // Önce kaydedilmiş şehir var mı kontrol et
      const savedCity = await AsyncStorage.getItem('selectedCity');
      
      // Lokasyon izni kontrol et
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      
      if (existingStatus === 'granted') {
        setHasLocationPermission(true);
        // GPS izni varsa, gerçek konumu almaya çalış
        const success = await getCurrentLocation();
        
        if (!success) {
          // GPS konum alınamadı, kaydedilmiş şehir var mı kontrol et
          if (savedCity) {
            const cityData = JSON.parse(savedCity);
            setSelectedCity(cityData);
            setCurrentLocation({
              latitude: cityData.coordinates.lat,
              longitude: cityData.coordinates.lng,
              cityName: cityData.name
            });
            setNeedsCitySelection(false);
          } else {
            setNeedsCitySelection(true);
          }
        } else {
          setNeedsCitySelection(false);
        }
      } else {
        setHasLocationPermission(false);
        
        // Konum izni yoksa:
        // - Eğer kaydedilmiş şehir varsa → onu kullan, şehir seçme ekranını gösterme
        // - Eğer kaydedilmiş şehir yoksa → şehir seçme ekranını göster
        if (savedCity) {
          const cityData = JSON.parse(savedCity);
          setSelectedCity(cityData);
          setCurrentLocation({
            latitude: cityData.coordinates.lat,
            longitude: cityData.coordinates.lng,
            cityName: cityData.name
          });
          setNeedsCitySelection(false);
        } else {
          // Hiç şehir seçilmemişse şehir seçme ekranını göster
          setNeedsCitySelection(true);
        }
      }
    } catch (error) {
      console.log('Lokasyon başlatma hatası:', error);
      setHasLocationPermission(false);
      
      const savedCity = await AsyncStorage.getItem('selectedCity');
      if (savedCity) {
        const cityData = JSON.parse(savedCity);
        setSelectedCity(cityData);
        setCurrentLocation({
          latitude: cityData.coordinates.lat,
          longitude: cityData.coordinates.lng,
          cityName: cityData.name
        });
        setNeedsCitySelection(false);
      } else {
        setNeedsCitySelection(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Giriş sonrası konum kontrolü (AuthContext'ten çağrılacak)
  const checkLocationAfterLogin = async () => {
    try {
      setIsLoading(true);
      
      const savedCity = await AsyncStorage.getItem('selectedCity');
      
      // Lokasyon izni kontrol et
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      
      if (existingStatus === 'granted') {
        setHasLocationPermission(true);
        if (!savedCity) {
          await getCurrentLocation();
        }
        setNeedsCitySelection(false);
      } else {
        setHasLocationPermission(false);
        if (!savedCity) {
          setNeedsCitySelection(true);
          showLocationToast();
        }
      }
      
      if (savedCity) {
        const cityData = JSON.parse(savedCity);
        setSelectedCity(cityData);
        setCurrentLocation({
          latitude: cityData.coordinates.lat,
          longitude: cityData.coordinates.lng,
          cityName: cityData.name
        });
        setNeedsCitySelection(false);
      }
    } catch (error) {
      console.log('Giriş sonrası konum kontrolü hatası:', error);
      const savedCity = await AsyncStorage.getItem('selectedCity');
      if (!savedCity) {
        setNeedsCitySelection(true);
        showLocationToast();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showLocationToast = () => {
    setToastMessage('Konum izni verilmedi, bir şehir seçin');
    setToastType('warning');
    setShowToast(true);
  };

  const showSuccessToast = (message) => {
    setToastMessage(message);
    setToastType('success');
    setShowToast(true);
  };

  // Koordinatlara göre en yakın şehri bulma fonksiyonu
  const findNearestCity = (latitude, longitude) => {
    let nearestCity = null;
    let minDistance = Infinity;

    cities.forEach(city => {
      const distance = calculateDistance(
        latitude, 
        longitude, 
        city.coordinates.lat, 
        city.coordinates.lng
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = city;
      }
    });

    return nearestCity?.name || 'Bilinmeyen Konum';
  };

  // İki koordinat arasındaki mesafeyi hesaplama
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');
      
      if (status === 'granted') {
        await getCurrentLocation();
        setNeedsCitySelection(false);
        return true;
      } else {
        setNeedsCitySelection(true);
        return false;
      }
    } catch (error) {
      console.log('Lokasyon izni hatası:', error);
      setHasLocationPermission(false);
      setNeedsCitySelection(true);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 15000,
        maximumAge: 10000
      });
      
      // Koordinatlara göre en yakın şehri bul
      const cityName = findNearestCity(location.coords.latitude, location.coords.longitude);

      const locationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        cityName: cityName
      };

      setCurrentLocation(locationData);
      
      // GPS konumu kullanıldığında manuel seçimi temizle
      setSelectedCity(null);
      await AsyncStorage.removeItem('selectedCity');
      
      // Mevcut konumu kaydet
      await AsyncStorage.setItem('currentLocation', JSON.stringify(locationData));
      
      showSuccessToast(`Konumunuz ${cityName} olarak ayarlandı`);
      
      return true;
    } catch (error) {
      console.log('Mevcut konum alınamadı:', error);
      // GPS hatası aldıysak şehir seçimi gerektiğini işaretle
      setNeedsCitySelection(true);
      return false;
    }
  };

  const selectCity = async (city) => {
    try {
      const locationData = {
        latitude: city.coordinates.lat,
        longitude: city.coordinates.lng,
        cityName: city.name
      };

      setSelectedCity(city);
      setCurrentLocation(locationData);
      setNeedsCitySelection(false);

      await AsyncStorage.setItem('selectedCity', JSON.stringify(city));
      await AsyncStorage.setItem('currentLocation', JSON.stringify(locationData));
      
      showSuccessToast(`Konumunuz ${city.name} olarak ayarlandı`);
      
      if (onCitySelectedCallback) {
        setTimeout(() => {
          onCitySelectedCallback();
          setOnCitySelectedCallback(null);
        }, 1500);
      }
      
      return true;
    } catch (error) {
      console.log('Şehir seçimi hatası:', error);
      return false;
    }
  };

  const getLocationText = () => {
    if (currentLocation) {
      if (hasLocationPermission && !selectedCity) {
        return currentLocation.cityName;
      }
      else if (selectedCity) {
        return selectedCity.name;
      }
      else {
        return currentLocation.cityName;
      }
    }
    return 'Konum Seçilmedi';
  };

  const value = {
    currentLocation,
    selectedCity,
    hasLocationPermission,
    isLoading,
    needsCitySelection,
    initializeLocation,
    requestLocationPermission,
    selectCity,
    getLocationText,
    setNeedsCitySelection,
    checkLocationAfterLogin,
    setOnCitySelectedCallback
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
      <Toast
        visible={showToast}
        message={toastMessage}
        type={toastType}
        onHide={() => setShowToast(false)}
      />
    </LocationContext.Provider>
  );
};