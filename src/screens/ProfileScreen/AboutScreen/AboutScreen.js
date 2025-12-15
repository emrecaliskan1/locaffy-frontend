import React from 'react';
import { View, Text, ScrollView, StatusBar, Image, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { styles } from './styles';

export default function AboutScreen({ navigation }) {
  const { theme } = useTheme();

  const appInfo = {
    name: 'Locaffy',
    version: '1.0.0',
    description: 'Mekan rezervasyonlarını kolaylaştıran, güvenilir ve kullanıcı dostu mobil uygulama.',
  };

  const contactItems = [
    {
      icon: 'envelope',
      title: 'E-posta',
      value: 'destek@locaffy.com',
      onPress: () => Linking.openURL('mailto:destek@locaffy.com'),
    },
    {
      icon: 'globe',
      title: 'Web Sitesi',
      value: 'locaffy.store',
      onPress: () => Linking.openURL('https://www.locaffy.store/#home'),
    },
    {
      icon: 'instagram',
      title: 'Instagram',
      value: '@locaffy',
      onPress: () => Linking.openURL(''),
    },
  ];

  const features = [
    {
      icon: 'search',
      title: 'Kolay Arama',
      description: 'Yakınınızdaki mekanları kolayca keşfedin ve inceleyin.',
    },
    {
      icon: 'calendar-check-o',
      title: 'Hızlı Rezervasyon',
      description: 'Birkaç dokunuşla rezervasyonunuzu tamamlayın.',
    },
    {
      icon: 'heart',
      title: 'Favori Listesi',
      description: 'Beğendiğiniz mekanları kaydedin ve tekrar ziyaret edin.',
    },
    {
      icon: 'map-marker',
      title: 'Harita Görünümü',
      description: 'Restoranları harita üzerinde görüntüleyin ve yol tarifini alın.',
    },
    {
      icon: 'star',
      title: 'Değerlendirme ve Yorumlar',
      description: 'Diğer kullanıcıların deneyimlerini okuyun ve kendi görüşlerinizi paylaşın.',
    },
    {
      icon: 'bell',
      title: 'Bildirimler',
      description: 'Rezervasyon hatırlatmaları ve özel fırsatlardan haberdar olun.',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.colors.statusBar} backgroundColor={theme.colors.background} />
      <SafeAreaView edges={['top']} style={{ backgroundColor: theme.colors.background }}>
        <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Hakkında</Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Logo ve Uygulama Bilgileri */}
        <View style={[styles.appInfoCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.logoContainer}>
            <Image source={require('../../../../assets/locaffyicon.png')} style={styles.logo} />
          </View>
          <Text style={[styles.appName, { color: theme.colors.text }]}>{appInfo.name}</Text>
          <Text style={[styles.appVersion, { color: theme.colors.textSecondary }]}>
            Versiyon {appInfo.version}
          </Text>
          <Text style={[styles.appDescription, { color: theme.colors.textSecondary }]}>
            {appInfo.description}
          </Text>
        </View>

        {/* Özellikler */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Özellikler</Text>
          <View style={[styles.featuresCard, { backgroundColor: theme.colors.card }]}>
            {features.map((feature, index) => (
              <View
                key={index}
                style={[
                  styles.featureItem,
                  { borderBottomColor: theme.colors.borderLight },
                  index === features.length - 1 && styles.lastFeatureItem,
                ]}
              >
                <View style={styles.featureIconContainer}>
                  <FontAwesome name={feature.icon} size={20} color="#667eea" />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                    {feature.title}
                  </Text>
                  <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* İletişim */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>İletişim</Text>
          <View style={[styles.contactCard, { backgroundColor: theme.colors.card }]}>
            {contactItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.contactItem,
                  { borderBottomColor: theme.colors.borderLight },
                  index === contactItems.length - 1 && styles.lastContactItem,
                ]}
                onPress={item.onPress}
              >
                <View style={styles.contactLeft}>
                  <FontAwesome name={item.icon} size={18} color="#667eea" style={styles.contactIcon} />
                  <View>
                    <Text style={[styles.contactTitle, { color: theme.colors.textSecondary }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.contactValue, { color: theme.colors.text }]}>
                      {item.value}
                    </Text>
                  </View>
                </View>
                <FontAwesome name="external-link" size={16} color={theme.colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Yasal */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Yasal</Text>
          <View style={[styles.legalCard, { backgroundColor: theme.colors.card }]}>
            <TouchableOpacity style={[styles.legalItem, { borderBottomColor: theme.colors.borderLight }]}>
              <Text style={[styles.legalText, { color: theme.colors.text }]}>Gizlilik Politikası</Text>
              <Text style={[styles.chevron, { color: theme.colors.textTertiary }]}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.legalItem, { borderBottomColor: theme.colors.borderLight }]}>
              <Text style={[styles.legalText, { color: theme.colors.text }]}>Kullanım Şartları</Text>
              <Text style={[styles.chevron, { color: theme.colors.textTertiary }]}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.lastLegalItem}>
              <Text style={[styles.legalText, { color: theme.colors.text }]}>Lisanslar</Text>
              <Text style={[styles.chevron, { color: theme.colors.textTertiary }]}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Alt Bilgi */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            © 2025 Locaffy. Tüm hakları saklıdır.
          </Text>
          <Text style={[styles.footerSubtext, { color: theme.colors.textTertiary }]}>
            Türkiye'de ❤️ ile yapıldı
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}
