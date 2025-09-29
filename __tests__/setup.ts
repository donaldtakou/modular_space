// Setup global test environment
import '@testing-library/jest-dom';
import { jest, beforeAll, afterAll } from '@jest/globals';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock environment variables
process.env.ALIBABA_API_KEY = 'test_key';
process.env.ALIBABA_API_SECRET = 'test_secret';

// Global beforeAll
beforeAll(() => {
  // Add any global setup here
});

// Global afterAll
afterAll(() => {
  // Add any global cleanup here
  jest.clearAllMocks();
});