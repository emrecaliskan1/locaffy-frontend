import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  // Uygulama başlangıcında kullanıcı bilgilerini kontrol et
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Kimlik doğrulama durumunu kontrol et
  const checkAuthStatus = async () => {
    try {
      const token = await authService.isLoggedIn();
      const userInfo = await authService.getUserInfo();
      
      if (token && userInfo) {
        setUser(userInfo);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };


  //GİRİŞ
  const login = async (email, password) => {
    setLoading(true);
    try {
      // Frontend validasyonları
      if (!email || !password) {
        return { success: false, message: 'E-posta ve şifre gereklidir' };
      }
      if (!validateEmail(email)) {
        return { success: false, message: 'Geçerli bir e-posta adresi giriniz' };
      }

      const response = await authService.login(email, password);
    
      if (response && response.accessToken) {

        const userInfo = {
          username: response.username,
          email: response.email,
          userId: response.userId,
          profileImageUrl: response.profileImageUrl
        };
        setUser(userInfo);
        setIsLoggedIn(true);
        return { success: true, data: response };
      }
      return { success: false, message: 'Giriş başarısız' };
    } catch (error) {
      return { 
        success: false, 
        message: getErrorMessage(error)
      };
    } finally {
      setLoading(false);
    }
  };

  //KAYIT OL
  const register = async (username, email, password, passwordConfirm) => {
    setLoading(true);
    try {
      if (!username || !email || !password || !passwordConfirm) {
        return { success: false, message: 'Tüm alanları doldurunuz' };
      }
      
      if (!validateEmail(email)) {
        return { success: false, message: 'Geçerli bir e-posta adresi giriniz' };
      }
      
      if (password.length < 6) {
        return { success: false, message: 'Şifre en az 6 karakter olmalıdır' };
      }
      
      if (password !== passwordConfirm) {
        return { success: false, message: 'Şifreler eşleşmiyor' };
      }
      
      if (username.length < 3) {
        return { success: false, message: 'Kullanıcı adı en az 3 karakter olmalıdır' };
      }

      const response = await authService.register(username, email, password, passwordConfirm);
      
      if (response && response.accessToken) {
        // Backend'den gelen kullanıcı bilgilerini context'e kaydet
        const userInfo = {
          username: response.username,
          email: response.email,
          userId: response.userId,
          profileImageUrl: response.profileImageUrl
        };
        
        setUser(userInfo);
        setIsLoggedIn(true);
        return { success: true, data: response };
      }
      
      return { success: false, message: 'Kayıt başarısız' };
    } catch (error) {
      return { 
        success: false, 
        message: getErrorMessage(error)
      };
    } finally {
      setLoading(false);
    }
  };


  //ÇIKIŞ
  const logout = async () => {
    try {
      if (user?.userId) {
        await authService.logout(user.userId);
      } else {
        await authService.clearToken();
      }
      
      setUser(null);
      setIsLoggedIn(false);
      return { success: true };
    } catch (error) {
      // Hata olsa bile local state'i temizle
      setUser(null);
      setIsLoggedIn(false);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Çıkış işlemi başarısız' 
      };
    }
  };

  // PROFIL FOTOĞRAFI GÜNCELLEME
  const updateProfileImage = (imageUrl) => {
    if (user) {
      setUser(prev => ({
        ...prev,
        profileImageUrl: imageUrl
      }));
    }
  };

  const value = {
    user,
    isLoggedIn,
    isLoading,
    loading,
    login,
    register,
    logout,
    checkAuthStatus,
    updateProfileImage
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


const getErrorMessage = (error) => {
  if (error.message) {
    return error.message;
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.status === 401 || error.response?.status === 403) {
    return 'E-posta veya şifre yanlış';
  }
  
  if (error.response?.status === 409) {
    return 'Bu e-posta adresi zaten kullanılıyor';
  }
  
  if (error.response?.status === 400) {
    return 'Girdiğiniz bilgileri kontrol ediniz';
  }
  
  if (error.response?.status === 404) {
    return 'Kullanıcı bulunamadı';
  }

  return 'Bir hata oluştu. Lütfen tekrar deneyin.';
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
