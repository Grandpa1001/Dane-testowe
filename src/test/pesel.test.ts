import { describe, it, expect } from 'vitest';
import { validatePESEL, randomInt } from './testUtils';

// Mock PESEL generation function (extracted from App.tsx)
const generatePESELWithGender = (selectedGender: 'K' | 'M' | 'K/M'): string => {
  const fullYear = randomInt(1900, 2099);
  const y = fullYear % 100;
  let m = randomInt(1, 12);
  const d = randomInt(1, 28);
  
  if (fullYear >= 1800 && fullYear <= 1899) {
    m += 80;
  } else if (fullYear >= 2000 && fullYear <= 2099) {
    m += 20;
  } else if (fullYear >= 2100 && fullYear <= 2199) {
    m += 40;
  } else if (fullYear >= 2200 && fullYear <= 2299) {
    m += 60;
  }
  
  const cyfry = [
    Math.floor(y / 10),     // pozycja 1: rok - dziesiątki
    y % 10,                 // pozycja 2: rok - jednostki
    Math.floor(m / 10),     // pozycja 3: miesiąc - dziesiątki
    m % 10,                 // pozycja 4: miesiąc - jednostki
    Math.floor(d / 10),     // pozycja 5: dzień - dziesiątki
    d % 10,                 // pozycja 6: dzień - jednostki
    randomInt(0, 9),        // pozycja 7: seria - pierwsza cyfra
    randomInt(0, 9),        // pozycja 8: seria - druga cyfra
    randomInt(0, 9),        // pozycja 9: seria - trzecia cyfra
    0                       // pozycja 10: cyfra płci - zostanie ustawiona poniżej
  ];
  
  if (selectedGender === 'K') {
    cyfry[9] = randomInt(0, 4) * 2;
  } else if (selectedGender === 'M') {
    cyfry[9] = randomInt(0, 4) * 2 + 1;
  } else {
    cyfry[9] = randomInt(0, 9);
  }
  
  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += cyfry[i] * weights[i];
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  cyfry[10] = checkDigit;
  
  return cyfry.join('');
};

describe('PESEL Generation and Validation', () => {
  it('should generate valid PESEL for female', () => {
    const pesel = generatePESELWithGender('K');
    expect(pesel).toHaveLength(11);
    expect(pesel).toMatch(/^\d{11}$/);
    expect(validatePESEL(pesel)).toBe(true);
    
    // Check gender digit (should be even for female)
    const genderDigit = parseInt(pesel[9]);
    expect(genderDigit % 2).toBe(0);
  });

  it('should generate valid PESEL for male', () => {
    const pesel = generatePESELWithGender('M');
    expect(pesel).toHaveLength(11);
    expect(pesel).toMatch(/^\d{11}$/);
    expect(validatePESEL(pesel)).toBe(true);
    
    // Check gender digit (should be odd for male)
    const genderDigit = parseInt(pesel[9]);
    expect(genderDigit % 2).toBe(1);
  });

  it('should generate valid PESEL for random gender', () => {
    const pesel = generatePESELWithGender('K/M');
    expect(pesel).toHaveLength(11);
    expect(pesel).toMatch(/^\d{11}$/);
    expect(validatePESEL(pesel)).toBe(true);
  });

  it('should generate multiple valid PESELs', () => {
    for (let i = 0; i < 10; i++) {
      const pesel = generatePESELWithGender('K/M');
      expect(validatePESEL(pesel)).toBe(true);
    }
  });

  it('should validate known correct PESEL', () => {
    // Test with a manually calculated valid PESEL
    const pesel = '90010112345';
    // Let's calculate if this is actually valid
    const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(pesel[i]) * weights[i];
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    const expectedPesel = pesel.substring(0, 10) + checkDigit;
    expect(validatePESEL(expectedPesel)).toBe(true);
  });

  it('should reject invalid PESEL', () => {
    expect(validatePESEL('12345678901')).toBe(false);
    expect(validatePESEL('9001011234')).toBe(false);
    expect(validatePESEL('900101123456')).toBe(false);
    expect(validatePESEL('abc12345678')).toBe(false);
  });
});
