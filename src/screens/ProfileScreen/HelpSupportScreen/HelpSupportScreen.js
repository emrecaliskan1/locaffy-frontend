import React, { useState } from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { styles } from './styles';

export default function HelpSupportScreen({ navigation }) {
  const { theme } = useTheme();
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqData = [
    {
      id: 1,
      question: 'Rezervasyon nasıl yapılır?',
      answer: 'Ana sayfada veya haritada istediğiniz restoranı seçin. Restoran detay sayfasında "Rezervasyon Yap" butonuna tıklayın. Tarih, saat ve kişi sayısını seçerek rezervasyonunuzu tamamlayın.',
    },
    {
      id: 2,
      question: 'Rezervasyonumu nasıl iptal edebilirim?',
      answer: 'Rezervasyonlarım sayfasından iptal etmek istediğiniz rezervasyonu seçin. Detay sayfasında "Rezervasyonu İptal Et" butonuna tıklayarak iptal işlemini tamamlayın.',
    },
    {
      id: 3,
      question: 'Rezervasyonumu değiştirebilir miyim?',
      answer: 'Evet, rezervasyonunuzu iptal edip yeni bir rezervasyon yapabilirsiniz. Rezervasyon detay sayfasından mevcut rezervasyonunuzu iptal edin ve ardından yeni tarih/saat ile rezervasyon yapın.',
    },
    {
      id: 4,
      question: 'Favori restoranlarıma nasıl eklerim?',
      answer: 'Restoran detay sayfasında kalp ikonuna tıklayarak restoranı favorilerinize ekleyebilirsiniz. Favori mekanlarınıza Profil > Favori Mekanlar sekmesinden ulaşabilirsiniz.',
    },
    {
      id: 5,
      question: 'Bildirimleri nasıl yönetirim?',
      answer: 'Profil sayfasından "Bildirimler" sekmesine girerek bildirim tercihlerinizi yönetebilirsiniz. Rezervasyon hatırlatmaları, yorumlar ve diğer bildirim türlerini özelleştirebilirsiniz.',
    },
    {
      id: 6,
      question: 'Hesap bilgilerimi nasıl güncellerim?',
      answer: 'Profil sayfasında "Hesap Bilgileri" sekmesine tıklayın. Buradan kullanıcı adınızı, e-posta adresinizi ve şifrenizi güncelleyebilirsiniz.',
    },
    {
      id: 7,
      question: 'Şehrimi nasıl değiştirebilirim?',
      answer: 'Profil sayfasından "Şehir Seç" sekmesine tıklayarak bulunduğunuz şehri değiştirebilirsiniz. Seçtiğiniz şehre göre restoranlar listelenecektir.',
    },
    {
      id: 8,
      question: 'Yorum nasıl yapabilirim?',
      answer: 'Geçmiş rezervasyonlarınızdan birini seçerek o restorana yorum yapabilirsiniz. Yıldız puanı ve yazılı yorumunuzu paylaşabilirsiniz.',
    },
    {
      id: 9,
      question: 'Harita görünümünde mekanları nasıl görürüm?',
      answer: 'Alt menüden "Harita" sekmesine tıklayın. Haritada kırmızı işaretçiler mekanları gösterir. İşaretçilere tıklayarak restoran bilgilerini görüntüleyebilirsiniz.',
    },
    {
      id: 10,
      question: 'Hesabımı nasıl silebilirim?',
      answer: 'Hesap silme işlemi için destek ekibimizle iletişime geçmeniz gerekmektedir. destek@locaffy.com adresine e-posta göndererek hesap silme talebinde bulunabilirsiniz.',
    },
  ];

  const contactOptions = [
    {
      icon: 'envelope',
      title: 'E-posta Desteği',
      description: 'destek@locaffy.com',
      action: () => Linking.openURL('mailto:destek@locaffy.com'),
    },
    {
      icon: 'phone',
      title: 'Telefon Desteği',
      description: '+90 539 709 88 33',
      action: () => Linking.openURL('tel:+905397098833'),
    },
    {
      icon: 'comments',
      title: 'Canlı Destek',
      description: 'Hafta içi 09:00 - 18:00',
      action: () => {
        // Canlı destek özelliği eklenebilir
      },
    },
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.colors.statusBar} backgroundColor={theme.colors.background} />
      <SafeAreaView edges={['top']} style={{ backgroundColor: theme.colors.background }}>
        <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Yardım ve Destek</Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* İletişim Seçenekleri */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Bize Ulaşın</Text>
          <View style={[styles.contactCard, { backgroundColor: theme.colors.card }]}>
            {contactOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.contactOption,
                  { borderBottomColor: theme.colors.borderLight },
                  index === contactOptions.length - 1 && styles.lastContactOption,
                ]}
                onPress={option.action}
              >
                <View style={styles.contactIconContainer}>
                  <FontAwesome name={option.icon} size={20} color="#667eea" />
                </View>
                <View style={styles.contactTextContainer}>
                  <Text style={[styles.contactTitle, { color: theme.colors.text }]}>
                    {option.title}
                  </Text>
                  <Text style={[styles.contactDescription, { color: theme.colors.textSecondary }]}>
                    {option.description}
                  </Text>
                </View>
                <FontAwesome name="chevron-right" size={16} color={theme.colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sıkça Sorulan Sorular */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Sıkça Sorulan Sorular</Text>
          <View style={[styles.faqCard, { backgroundColor: theme.colors.card }]}>
            {faqData.map((faq, index) => (
              <View key={faq.id}>
                <TouchableOpacity
                  style={[
                    styles.faqItem,
                    { borderBottomColor: theme.colors.borderLight },
                    expandedFaq === faq.id && styles.faqItemExpanded,
                  ]}
                  onPress={() => toggleFaq(faq.id)}
                >
                  <View style={styles.faqHeader}>
                    <Text style={[styles.faqQuestion, { color: theme.colors.text }]}>
                      {faq.question}
                    </Text>
                    <FontAwesome
                      name={expandedFaq === faq.id ? 'chevron-up' : 'chevron-down'}
                      size={14}
                      color={theme.colors.textSecondary}
                    />
                  </View>
                  {expandedFaq === faq.id && (
                    <Text style={[styles.faqAnswer, { color: theme.colors.textSecondary }]}>
                      {faq.answer}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Ek Yardım */}
        <View style={[styles.helpBox, { backgroundColor: theme.colors.card }]}>
          <FontAwesome name="info-circle" size={24} color="#667eea" style={styles.helpIcon} />
          <Text style={[styles.helpTitle, { color: theme.colors.text }]}>
            Sorununuza çözüm bulamadınız mı?
          </Text>
          <Text style={[styles.helpDescription, { color: theme.colors.textSecondary }]}>
            Destek ekibimiz size yardımcı olmak için burada. E-posta veya telefon ile bizimle iletişime geçebilirsiniz.
          </Text>
          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => Linking.openURL('mailto:destek@locaffy.com')}
          >
            <Text style={styles.helpButtonText}>Destek Talebi Oluştur</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}
