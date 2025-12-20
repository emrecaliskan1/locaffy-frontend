/**
 * Mesafe hesaplama fonksiyonu (Haversine formülü)
 * İki koordinat arasındaki mesafeyi km cinsinden hesaplar
 * 
 * @param {number} lat1 - İlk noktanın enlemi
 * @param {number} lon1 - İlk noktanın boylamı
 * @param {number} lat2 - İkinci noktanın enlemi
 * @param {number} lon2 - İkinci noktanın boylamı
 * @returns {number} Mesafe (km cinsinden)
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Dünya'nın yarıçapı (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};
