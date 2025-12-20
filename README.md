#  Locaffy Mobile App

<p align="center">
<img src="assets/locaffy.png" alt="Locaffy Logo" width="200"/>





<b>Şehrin lezzetlerini keşfet, masanı saniyeler içinde ayırt. Tüm deneyimlerini diğer kullanıcılarla paylaş.</b>
</p>

<p align="center">
<img src="[https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB](https://www.google.com/search?q=https://img.shields.io/badge/React_Native-20232A%3Fstyle%3Dfor-the-badge%26logo%3Dreact%26logoColor%3D61DAFB)" />
<img src="[https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)" />
<img src="[https://img.shields.io/badge/OpenStreetMap-7EBC6F?style=for-the-badge&logo=openstreetmap&logoColor=white](https://www.google.com/search?q=https://img.shields.io/badge/OpenStreetMap-7EBC6F%3Fstyle%3Dfor-the-badge%26logo%3Dopenstreetmap%26logoColor%3Dwhite)" />
<img src="[https://img.shields.io/badge/License-MIT-green.style=for-the-badge](https://www.google.com/search?q=https://img.shields.io/badge/License-MIT-green.style%3Dfor-the-badge)" />
</p>

---

## 📖 Hakkında

**Locaffy**, kullanıcıların mekan keşfetme, menü inceleme ve rezervasyon süreçlerini dijitalleştiren modern bir mobil uygulamadır. Gerçek zamanlı harita desteği ve topluluk geri bildirimleri ile en doğru mekan tercihini yapmanıza, kolaylıkla rezervasyonlarınızı tamamlamanıza yardımcı olur.

---

## ✨ Öne Çıkan Özellikler

| Özellik | Açıklama |
| --- | --- |
| 🔍 **Akıllı Keşif** | Harita veya liste üzerinden çevrendeki en iyi mekanları bul. |
| ⭐ **Puanlama ve Yorumlar** | Deneyimlerini paylaş, mekanlara puan ver ve diğer kullanıcıların yorumlarını incele. |
| 📅 **Hızlı Rezervasyon** | Kişi sayısı, tarih ve saat seçerek anında yerini ayırt. |
| 🗺️ **Harita Entegrasyonu** | **OpenStreetMap** altyapısı ile restoranları lokasyon bazlı görüntüle. |
| 🌗 **Tema Desteği** | Karanlık (Dark) ve Aydınlık (Light) mod seçenekleri. |
| 🔔 **Hatırlatıcılar** | Takvim entegrasyonu ile rezervasyon bildirimleri al. |

---

## 🛠️ Teknoloji Yığını

Locaffy, modern ve performanslı bir deneyim için şu teknolojileri kullanır:

* **Framework:** [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/)
* **Harita Servisi:** [OpenStreetMap](https://www.openstreetmap.org/) (Lokasyon verileri ve harita katmanları)
* **Navigasyon:** React Navigation (Stack & Bottom Tabs)
* **Veri Yönetimi:** Axios (API) & Async Storage (Yerel Saklama)
* **Native Servisler:** Expo Location, Calendar, Image Picker

---

## 📂 Proje Yapısı

```bash
locaffy-frontend/
├── assets/             # Görseller, ikonlar ve fontlar
├── src/
│   ├── components/     # Yeniden kullanılabilir UI bileşenleri
│   ├── constants/      # Renk paleti, API uç noktaları ve sabitler
│   ├── context/        # Global State (Auth, Tema, Konum)
│   ├── navigation/     # Navigasyon yapılandırması
│   ├── screens/        # Uygulama ekranları (Keşfet, Rezervasyon, Profil)
│   ├── services/       # API servis katmanı
│   └── utils/          # Yardımcı fonksiyonlar
├── App.js              # Ana giriş noktası
└── app.json            # Expo yapılandırması

```

---

## 🚀 Kurulum ve Başlatma

1. **Depoyu Klonlayın:**
```bash
git clone https://github.com/kullaniciadi/locaffy-frontend.git
cd locaffy-frontend

```


2. **Bağımlılıkları Yükleyin:**
```bash
npm install

```


3. **Uygulamayı Çalıştırın:**
```bash
npx expo start

```



> [!IMPORTANT]
> Uygulamayı fiziksel bir cihazda test etmek için **Expo Go** uygulamasını kullanabilir veya bir Android emülatörü üzerinde çalıştırabilirsiniz.

---


---

## 📜 Lisans

Bu proje **MIT Lisansı** ile korunmaktadır.
