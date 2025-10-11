export const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

export const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

export const availableTimes = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', 
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30'
];

export const maxPeople = 8;

// Mock rezervasyon verileri - Backend'den gelecek
export const mockReservations = {
  active: [
    {
      id: 1,
      restaurantName: 'Günaydın Steakhouse',
      restaurantImage: require('../../assets/steakhouse.jpeg'),
      reservationNumber: '#R12345',
      status: 'onaylandı',
      statusText: 'Onaylandı',
      // set date 3 days from now for testing cancel
      date: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().slice(0,10),
      time: '19:30',
      people: 4,
      specialRequests: 'Pencere kenarı masa istiyoruz',
      phone: '+90 555 123 45 67'
    },
    {
      id: 2,
      restaurantName: 'Pizza Palace',
      restaurantImage: require('../../assets/korean.jpeg'),
      reservationNumber: '#R12346',
      status: 'beklemede',
      statusText: 'Beklemede',
      // set date 4 days from now
      date: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString().slice(0,10),
      time: '20:00',
      people: 2,
      specialRequests: null,
      phone: '+90 555 123 45 67'
    }
  ],
  completed: [
    {
      id: 3,
      restaurantName: 'Sushi Master',
      restaurantImage: require('../../assets/korean.jpeg'),
      reservationNumber: '#R12344',
      status: 'tamamlandı',
      statusText: 'Tamamlandı',
      date: '2024-01-20',
      time: '18:30',
      people: 3,
      specialRequests: 'Vejetaryen seçenekler',
      phone: '+90 555 123 45 67',
      rating: 5,
      isReviewed: false
    },
    {
      id: 4,
      restaurantName: 'Günaydın Steakhouse',
      restaurantImage: require('../../assets/korean.jpeg'),
      reservationNumber: '#R12343',
      status: 'reddedildi',
      statusText: 'Reddedildi',
      date: '2024-01-18',
      time: '19:00',
      people: 6,
      specialRequests: null,
      phone: '+90 555 123 45 67'
    }
  ]
};