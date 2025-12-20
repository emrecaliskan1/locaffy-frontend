# Locaffy Mobile App

Locaffy, kullanıcıların restoranları keşfetmesini, menüleri incelemesini ve kolayca rezervasyon yapmasını sağlayan modern bir mobil uygulamadır. React Native ve Expo kullanılarak geliştirilmiştir.

## 📱 Özellikler

- **Kullanıcı Kimlik Doğrulama:** Güvenli giriş ve kayıt işlemleri.
- **Şehir Seçimi:** Kullanıcıların bulunduğu veya ilgilendiği şehri seçebilmesi.
- **Restoran Keşfi:**
  - **Harita Görünümü:** Restoranları harita üzerinde görüntüleme ve filtreleme.
  - **Liste Görünümü:** Popüler ve yakındaki restoranları listeleme.
- **Restoran Detayları:**
  - Menü görüntüleme.
  - Kullanıcı yorumları ve puanları.
  - Restoran bilgileri ve çalışma saatleri.
- **Rezervasyon Yönetimi:**
  - Tarih, saat ve kişi sayısı seçerek rezervasyon yapma.
  - Geçmiş ve gelecek rezervasyonları görüntüleme.
  - Takvim entegrasyonu ile hatırlatmalar.
- **Favoriler:** Beğenilen restoranları favorilere ekleme.
- **Profil Yönetimi:** Hesap bilgileri, bildirim ayarları ve yardım merkezi.
- **Karanlık/Aydınlık Mod:** Kullanıcı tercihine göre tema desteği.

## 🛠 Teknolojiler

Bu proje aşağıdaki teknolojiler kullanılarak geliştirilmiştir:

- **[React Native](https://reactnative.dev/)** - Mobil uygulama geliştirme framework'ü.
- **[Expo](https://expo.dev/)** - React Native uygulamaları için geliştirme platformu.
- **[React Navigation](https://reactnavigation.org/)** - Uygulama içi navigasyon yönetimi (Stack & Bottom Tabs).
- **[Axios](https://axios-http.com/)** - HTTP istekleri için.
- **[Async Storage](https://react-native-async-storage.github.io/async-storage/)** - Yerel veri saklama.
- **Expo Libraries:** Location, Calendar, Image Picker, Media Library vb.

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

1.  **Depoyu klonlayın:**

    ```bash
    git clone https://github.com/kullaniciadi/locaffy-frontend.git
    cd locaffy-frontend
    ```

2.  **Bağımlılıkları yükleyin:**

    ```bash
    npm install
    ```

3.  **Uygulamayı başlatın:**

    ```bash
    npx expo start
    ```

4.  **Uygulamayı test edin:**
    - **Fiziksel Cihaz:** Expo Go uygulamasını telefonunuza indirin ve terminaldeki QR kodunu taratın.
    - **Emülatör:** Android Studio veya Xcode simülatörlerini kullanarak çalıştırın (`a` veya `i` tuşlarına basarak).

## 📂 Proje Yapısı

```
locaffy-frontend/
├── assets/              # Görseller ve ikonlar
├── src/
│   ├── components/      # Yeniden kullanılabilir bileşenler (Butonlar, Kartlar vb.)
│   ├── constants/       # Sabit veriler (Renkler, Şehirler vb.)
│   ├── context/         # Global state yönetimi (Auth, Theme, Location)
│   ├── navigation/      # Navigasyon yapılandırması
│   ├── screens/         # Uygulama ekranları
│   ├── services/        # API servisleri
│   └── utils/           # Yardımcı fonksiyonlar
├── App.js               # Ana giriş dosyası
├── app.json             # Expo yapılandırması
└── package.json         # Proje bağımlılıkları
```

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.
