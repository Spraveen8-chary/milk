import { User, Product, Bill, Notification, DeliveryDay } from './types';

export const CURRENT_USER_KEY = 'universal_milk_user';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Fresh Cow Milk',
    category: 'Milk',
    price: 60,
    unit: '1L',
    image: 'https://picsum.photos/200/200?random=1',
    description: 'Farm fresh unpasteurized cow milk delivered daily morning.'
  },
  {
    id: 'p2',
    name: 'Buffalo Milk',
    category: 'Milk',
    price: 80,
    unit: '1L',
    image: 'https://picsum.photos/200/200?random=2',
    description: 'Rich and creamy buffalo milk, high in fat content.'
  },
  {
    id: 'p3',
    name: 'Desi Ghee',
    category: 'Ghee',
    price: 600,
    unit: '500ml',
    image: 'https://picsum.photos/200/200?random=3',
    description: 'Pure homemade style desi ghee with rich aroma.'
  },
  {
    id: 'p4',
    name: 'Fresh Paneer',
    category: 'Paneer',
    price: 120,
    unit: '200g',
    image: 'https://picsum.photos/200/200?random=4',
    description: 'Soft and fresh malai paneer.'
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'admin1',
    name: 'Dairy Owner',
    email: 'admin@universalmilk.com',
    phone: '9876543210',
    address: '123 Dairy Farm, Green Valley',
    role: 'admin',
    avatar: 'https://picsum.photos/100/100?random=10'
  },
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9988776655',
    address: 'Flat 402, Sunshine Apts, City Center',
    role: 'user',
    avatar: 'https://picsum.photos/100/100?random=11'
  }
];

export const MOCK_BILLS: Bill[] = [
  {
    id: 'b1',
    month: '2023-09',
    amount: 1850,
    status: 'paid',
    dueDate: '2023-10-05'
  },
  {
    id: 'b2',
    month: '2023-10',
    amount: 1920,
    status: 'pending',
    dueDate: '2023-11-05'
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Bill Generated',
    message: 'Your bill for October 2023 is generated. Amount: ₹1920',
    date: '2023-11-01',
    read: false,
    type: 'alert'
  },
  {
    id: 'n2',
    title: 'Price Update',
    message: 'Cow milk price will increase by ₹2 from next month.',
    date: '2023-10-25',
    read: true,
    type: 'info'
  }
];

// Helper to generate calendar data
export const generateMockCalendar = (year: number, month: number): DeliveryDay[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: DeliveryDay[] = [];
  
  for (let i = 1; i <= daysInMonth; i++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    // Random status
    const rand = Math.random();
    let status: 'pending' | 'delivered' | 'skipped' = 'pending';
    if (i < new Date().getDate()) {
        status = rand > 0.1 ? 'delivered' : 'skipped';
    } else if (i === new Date().getDate()) {
        status = 'pending';
    }

    days.push({
      date,
      status,
      items: [{ productId: 'p1', quantity: 1 }]
    });
  }
  return days;
};
