import { TOrder, TUser } from '../../src/utils/types';

// 1. Моковые данные пользователя
export const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

// 2. Моковые данные заказа
export const mockOrder: TOrder = {
  _id: '123',
  ingredients: ['60d3b41abdacab0026a733c6', '60d3b41abdacab0026a733c7'],
  status: 'done',
  name: 'Space флюоресцентный бургер',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  number: 12345
};

// 3. Моковые токены
export const mockTokens = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token'
};

// 4. Моки API ответов
export const mockApiResponses = {
  // Ответ для получения данных пользователя
  getUser: {
    success: true,
    user: mockUser
  },

  // Ответ для создания заказа
  createOrder: {
    success: true,
    name: mockOrder.name,
    order: {
      number: mockOrder.number
    }
  },

  // Ответ для авторизации
  auth: {
    success: true,
    user: mockUser,
    accessToken: `Bearer ${mockTokens.accessToken}`,
    refreshToken: mockTokens.refreshToken
  }
};

// Добавляем типы для TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      mockApi(): void;
      setMockTokens(): void;
    }
  }
}
