/**
 * Unit tests for backend order validation logic.
 */
import { describe, it, expect } from 'vitest';
import { calculateTotalAmount, isValidProductIdsArray } from './order.service.js';

describe('Order Service', () => {
  it('calculates the correct total amount', () => {
    const products = [
      { price: 100.5 },
      { price: 49.5 },
      { price: 25 },
    ];

    expect(calculateTotalAmount(products)).toBe(175);
  });

  it('validates product ID arrays correctly', () => {
    expect(isValidProductIdsArray(['1', '2', '3'])).toBe(true);
    expect(isValidProductIdsArray([])).toBe(false);
    expect(isValidProductIdsArray(null)).toBe(false);
    expect(isValidProductIdsArray('not-an-array')).toBe(false);
  });
});
