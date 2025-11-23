import { MOCK_PRODUCTS, MOCK_USERS, MOCK_BILLS, generateMockCalendar } from '../constants';
import { Product, Bill, DeliveryDay } from '../types';

export const MockService = {
  getProducts: (): Promise<Product[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_PRODUCTS), 500);
    });
  },

  getBills: (userId: string): Promise<Bill[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_BILLS), 600);
    });
  },

  getMonthlyDeliveries: (year: number, month: number): Promise<DeliveryDay[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(generateMockCalendar(year, month)), 400);
    });
  },

  updateDeliveryStatus: (date: string, status: 'skipped' | 'pending'): Promise<boolean> => {
    return new Promise((resolve) => {
        // Logic to simulate backend update
        console.log(`Updated ${date} to ${status}`);
        setTimeout(() => resolve(true), 300);
    });
  }
};
