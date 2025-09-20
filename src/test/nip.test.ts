import { describe, it, expect } from 'vitest';
import { validateNIP, randomInt } from './testUtils';

// Mock NIP generation function (extracted from App.tsx)
const generateNIP = (): string => {
  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  
  let cyfry: number[];
  let cyfra_kontrolna: number;
  
  do {
    // Generuj 9 cyfr (pierwsze 3 nie mogą być zerami)
    cyfry = [
      randomInt(1, 9), // pierwsza cyfra nie może być 0
      randomInt(1, 9), // druga cyfra nie może być 0
      randomInt(1, 9), // trzecia cyfra nie może być 0
      randomInt(0, 9), // pozostałe cyfry mogą być 0-9
      randomInt(0, 9),
      randomInt(0, 9),
      randomInt(0, 9),
      randomInt(0, 9),
      randomInt(0, 9)
    ];

    // Oblicz cyfrę kontrolną
    cyfra_kontrolna = 0;
    for (let i = 0; i < cyfry.length; i++) {
      cyfra_kontrolna += weights[i] * cyfry[i];
    }
    cyfra_kontrolna %= 11;
  } while (cyfra_kontrolna === 10); // Powtarzaj jeśli cyfra kontrolna = 10

  // Połącz wszystkie cyfry
  let result = cyfry.join('');
  result += cyfra_kontrolna;
  return result;
};

describe('NIP Generation and Validation', () => {
  it('should generate valid NIP', () => {
    const nip = generateNIP();
    expect(nip).toHaveLength(10);
    expect(nip).toMatch(/^\d{10}$/);
    expect(validateNIP(nip)).toBe(true);
  });

  it('should generate multiple valid NIPs', () => {
    for (let i = 0; i < 10; i++) {
      const nip = generateNIP();
      expect(validateNIP(nip)).toBe(true);
    }
  });

  it('should validate known correct NIP', () => {
    // Test with a manually calculated valid NIP
    const nip = '1234567890';
    // Let's calculate if this is actually valid
    const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(nip[i]) * weights[i];
    }
    const checkDigit = sum % 11;
    const expectedCheckDigit = checkDigit === 10 ? 0 : checkDigit;
    const expectedNip = nip.substring(0, 9) + expectedCheckDigit;
    expect(validateNIP(expectedNip)).toBe(true);
  });

  it('should reject invalid NIP', () => {
    expect(validateNIP('1234567891')).toBe(false);
    expect(validateNIP('123456789')).toBe(false);
    expect(validateNIP('12345678901')).toBe(false);
    expect(validateNIP('abc1234567')).toBe(false);
  });

  it('should not start with zeros', () => {
    for (let i = 0; i < 20; i++) {
      const nip = generateNIP();
      expect(nip[0]).not.toBe('0');
      expect(nip[1]).not.toBe('0');
      expect(nip[2]).not.toBe('0');
    }
  });

  it('should handle NIP with dashes', () => {
    // Test with a manually calculated valid NIP
    const nip = '1234567890';
    const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(nip[i]) * weights[i];
    }
    const checkDigit = sum % 11;
    const expectedCheckDigit = checkDigit === 10 ? 0 : checkDigit;
    const expectedNip = nip.substring(0, 9) + expectedCheckDigit;
    
    expect(validateNIP(expectedNip.substring(0, 3) + '-' + expectedNip.substring(3, 6) + '-' + expectedNip.substring(6, 8) + '-' + expectedNip.substring(8, 10))).toBe(true);
    expect(validateNIP(expectedNip.substring(0, 3) + ' ' + expectedNip.substring(3, 6) + ' ' + expectedNip.substring(6, 8) + ' ' + expectedNip.substring(8, 10))).toBe(true);
  });
});
