// Mock order verileri - Backend'den gelecek
export const mockOrders = {
  active: [
    {
      id: 1,
      restaurantName: 'Günaydın Steakhouse',
      restaurantImage: require('../../assets/korean.jpeg'),
      orderNumber: '#12345',
      status: 'hazırlanıyor',
      statusText: 'Hazırlanıyor',
      orderTime: '14:30',
      estimatedTime: '15:00',
      total: 89.90,
      items: [
        { name: 'Izgara Biftek', quantity: 1, price: 89.90 }
      ],
      tableNumber: '15'
    },
    {
      id: 2,
      restaurantName: 'Pizza Palace',
      restaurantImage: require('../../assets/korean.jpeg'),
      orderNumber: '#12346',
      status: 'yolda',
      statusText: 'Teslimat Yolda',
      orderTime: '13:45',
      estimatedTime: '14:15',
      total: 45.50,
      items: [
        { name: 'Margherita Pizza', quantity: 1, price: 35.00 },
        { name: 'Coca Cola', quantity: 2, price: 5.25 }
      ],
      courierName: 'Mehmet',
      courierPhone: '+90 555 123 45 67'
    }
  ],
  completed: [
    {
      id: 3,
      restaurantName: 'Sushi Master',
      restaurantImage: require('../../assets/korean.jpeg'),
      orderNumber: '#12344',
      status: 'teslim edildi',
      statusText: 'Teslim Edildi',
      orderTime: '12:30',
      deliveredTime: '13:00',
      total: 125.00,
      items: [
        { name: 'Sushi Set', quantity: 1, price: 125.00 }
      ],
      rating: 5,
      completedDate: '2024-01-20'
    },
    {
      id: 4,
      restaurantName: 'Günaydın Steakhouse',
      restaurantImage: require('../../assets/korean.jpeg'),
      orderNumber: '#12343',
      status: 'iptal edildi',
      statusText: 'İptal Edildi',
      orderTime: '11:30',
      total: 67.50,
      items: [
        { name: 'Tavuk Şiş', quantity: 2, price: 33.75 }
      ],
      cancelReason: 'Restoran tarafından iptal edildi',
      completedDate: '2024-01-19'
    }
  ]
};