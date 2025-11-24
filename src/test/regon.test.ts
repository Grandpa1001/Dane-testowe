import { describe, it, expect } from 'vitest';
import { validateREGON, validateREGON9, validateREGON14, randomInt } from './testUtils';

// Mock REGON generation function (extracted from App.tsx)
const generateREGON9 = (): string => {
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

const generateREGON14 = (): string => {
  const weights = [2, 4, 8, 5, 0, 9, 7, 3, 6, 1, 2, 4, 8];
  
  // Pierwsze 9 cyfr to REGON jednostki macierzystej
  const regon9 = generateREGON9();
  const cyfry = regon9.split('').map(Number);
  
  // Kolejne 4 cyfry to liczba porządkowa jednostki lokalnej
  for (let i = 9; i < 13; i++) {
    cyfry[i] = randomInt(0, 9);
  }

  // Oblicz cyfrę kontrolną dla 14-cyfrowego REGON
  let cyfra_kontrolna = 0;
  for (let i = 0; i < weights.length; i++) {
    cyfra_kontrolna += weights[i] * cyfry[i];
  }
  cyfra_kontrolna = cyfra_kontrolna % 11;
  if (cyfra_kontrolna === 10) {
    cyfra_kontrolna = 0;
  }

  let result = cyfry.join('');
  result += cyfra_kontrolna;
  return result;
};

describe('REGON Generation and Validation', () => {
  describe('REGON 9-cyfrowy', () => {
    it('should generate valid REGON', () => {
      const regon = generateREGON9();
      expect(regon).toHaveLength(9);
      expect(regon).toMatch(/^\d{9}$/);
      expect(validateREGON(regon)).toBe(true);
      expect(validateREGON9(regon)).toBe(true);
    });

    it('should generate multiple valid REGONs', () => {
      for (let i = 0; i < 10; i++) {
        const regon = generateREGON9();
        expect(validateREGON(regon)).toBe(true);
        expect(validateREGON9(regon)).toBe(true);
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
        const regon = generateREGON9();
        const regionDigits = parseInt(regon.substring(0, 2));
        expect(regionDigits).toBeGreaterThanOrEqual(1);
        expect(regionDigits).toBeLessThanOrEqual(99);
        expect(regionDigits % 2).toBe(1);
      }
    });
  });

  describe('REGON 14-cyfrowy', () => {
    it('should generate valid 14-digit REGON', () => {
      const regon = generateREGON14();
      expect(regon).toHaveLength(14);
      expect(regon).toMatch(/^\d{14}$/);
      expect(validateREGON(regon)).toBe(true);
      expect(validateREGON14(regon)).toBe(true);
    });

    it('should generate multiple valid 14-digit REGONs', () => {
      for (let i = 0; i < 10; i++) {
        const regon = generateREGON14();
        expect(validateREGON(regon)).toBe(true);
        expect(validateREGON14(regon)).toBe(true);
      }
    });

    it('should have valid 9-digit REGON as first 9 digits', () => {
      for (let i = 0; i < 10; i++) {
        const regon = generateREGON14();
        const regon9 = regon.substring(0, 9);
        expect(validateREGON9(regon9)).toBe(true);
      }
    });

    it('should validate known correct 14-digit REGON', () => {
      // Test with manually calculated valid REGON
      // First 9 digits must be valid REGON9, then calculate check digit
      const regon9 = '123456785'; // Valid 9-digit REGON
      const localDigits = '0123'; // Local unit digits
      const weights = [2, 4, 8, 5, 0, 9, 7, 3, 6, 1, 2, 4, 8];
      const allDigits = (regon9 + localDigits).split('').map(Number);
      
      let sum = 0;
      for (let i = 0; i < 13; i++) {
        sum += allDigits[i] * weights[i];
      }
      const checkDigit = sum % 11;
      const expectedCheckDigit = checkDigit === 10 ? 0 : checkDigit;
      const regon14 = regon9 + localDigits + expectedCheckDigit;
      
      expect(validateREGON14(regon14)).toBe(true);
    });
  });

  it('should reject invalid REGON', () => {
    expect(validateREGON('123456789')).toBe(false);
    expect(validateREGON('12345678')).toBe(false);
    expect(validateREGON('1234567890')).toBe(false);
    expect(validateREGON('abc123456')).toBe(false);
    expect(validateREGON('12345678901234')).toBe(false); // Invalid 14-digit
  });
});
