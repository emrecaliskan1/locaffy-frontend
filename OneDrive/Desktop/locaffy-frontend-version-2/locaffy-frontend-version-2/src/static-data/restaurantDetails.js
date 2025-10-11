export const mockRestaurantDetailData = {
  // Sadece menü ve yorumlar - restoran bilgileri route'dan gelecek
  menu: {
    categories: [
      {
        id: 'main',
        name: 'Ana Yemekler',
        items: [
          {
            id: 1,
            name: 'Izgara Biftek',
            description: 'Özel baharatlarla marine edilmiş dana biftek',
            price: 89.90,
            image: require('../../assets/steakhouse.jpeg'),
            isPopular: true
          },
          {
            id: 2,
            name: 'Tavuk Şinitzel',
            description: 'Çıtır tavuk göğsü, patates kızartması ile',
            price: 65.90,
            image: require('../../assets/steakhouse.jpeg'),
            isPopular: false
          },
          {
            id: 3,
            name: 'Balık Fileto',
            description: 'Taze levrek fileto, sebze garnitürü ile',
            price: 75.90,
            image: require('../../assets/steakhouse.jpeg'),
            isPopular: true
          }
        ]
      },
      {
        id: 'drinks',
        name: 'İçecekler',
        items: [
          {
            id: 4,
            name: 'Ayran',
            description: 'Ev yapımı ayran',
            price: 8.90,
            image: require('../../assets/steakhouse.jpeg'),
            isPopular: false
          },
          {
            id: 5,
            name: 'Türk Kahvesi',
            description: 'Geleneksel Türk kahvesi',
            price: 12.90,
            image: require('../../assets/steakhouse.jpeg'),
            isPopular: true
          }
        ]
      },
      {
        id: 'desserts',
        name: 'Tatlılar',
        items: [
          {
            id: 6,
            name: 'Baklava',
            description: 'Antep fıstıklı baklava',
            price: 25.90,
            image: require('../../assets/steakhouse.jpeg'),
            isPopular: true
          }
        ]
      }
    ]
  },
  reviews: [
    {
      id: 1,
      userName: 'Ahmet Y.',
      rating: 5,
      comment: 'Harika bir restoran! Et yemekleri çok lezzetli.',
      date: '2024-01-15',
      helpful: 12
    },
    {
      id: 2,
      userName: 'Fatma K.',
      rating: 4,
      comment: 'Güzel bir mekan, servis hızlı. Tavsiye ederim.',
      date: '2024-01-10',
      helpful: 8
    },
    {
      id: 3,
      userName: 'Mehmet S.',
      rating: 5,
      comment: 'Mükemmel bir deneyim. Her şey çok güzeldi.',
      date: '2024-01-08',
      helpful: 15
    }
  ]
};