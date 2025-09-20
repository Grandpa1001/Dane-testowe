import { describe, it, expect } from 'vitest';
import { validateREGON, randomInt } from './testUtils';

// Mock REGON generation function (extracted from App.tsx)
const generateREGON = (): string => {
  const weights = [8, 9, 2, 3, 4, 5, 6, 7];
  
  const regionDigits = randomInt(0, 49) * 2 + 1;
  
  const cyfry = [
    Math.floor(regionDigits / 10),
    regionDigits % 10
  ];
  
  for (let i = 2; i < weights.length; i++) {
    cyfry[i] = randomInt(0, 9);
  }

  let cyfra_kontrolna = 0;
  for (let i = 0; i < cyfry.length; i++) {
    cyfra_kontrolna += weights[i] * cyfry[i];
  }
  cyfra_kontrolna = (cyfra_kontrolna % 11) % 10;

  let result = cyfry.join('');
  result += cyfra_kontrolna;
  return result;
};

describe('REGON Generation and Validation', () => {
  it('should generate valid REGON', () => {
    const regon = generateREGON();
    expect(regon).toHaveLength(9);
    expect(regon).toMatch(/^\d{9}$/);
    expect(validateREGON(regon)).toBe(true);
  });

  it('should generate multiple valid REGONs', () => {
    for (let i = 0; i < 10; i++) {
      const regon = generateREGON();
      expect(validateREGON(regon)).toBe(true);
    }
  });

  it('should validate known correct REGON', () => {
    // Test with a manually calculated valid REGON
    const regon = '123456785';
    // Let's calculate if this is actually valid
    const weights = [8, 9, 2, 3, 4, 5, 6, 7];
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += parseInt(regon[i]) * weights[i];
    }
    const checkDigit = sum % 11;
    const expectedCheckDigit = checkDigit === 10 ? 0 : checkDigit;
    const expectedRegon = regon.substring(0, 8) + expectedCheckDigit;
    expect(validateREGON(expectedRegon)).toBe(true);
  });

  it('should reject invalid REGON', () => {
    expect(validateREGON('123456789')).toBe(false);
    expect(validateREGON('12345678')).toBe(false);
    expect(validateREGON('1234567890')).toBe(false);
    expect(validateREGON('abc123456')).toBe(false);
  });

  it('should have valid region digits (odd numbers 1-99)', () => {
    for (let i = 0; i < 20; i++) {
      const regon = generateREGON();
      const regionDigits = parseInt(regon.substring(0, 2));
      expect(regionDigits).toBeGreaterThanOrEqual(1);
      expect(regionDigits).toBeLessThanOrEqual(99);
      expect(regionDigits % 2).toBe(1);
    }
  });
});
