import { describe, it, expect } from 'vitest';
import { randomInt } from './testUtils';

// Mock functions for other fields (extracted from App.tsx)

const generateMDowod = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const prefix = 'MA';
  
  const letter1 = letters[randomInt(0, letters.length - 1)];
  const letter2 = letters[randomInt(0, letters.length - 1)];
  const randomNumbers = randomInt(1000, 9999).toString();
  
  const baseNumber = prefix + letter1 + letter2 + randomNumbers;
  
  const weights = [7, 3, 1, 7, 3, 1, 7, 3];
  let sum = 0;
  
  for (let i = 0; i < baseNumber.length; i++) {
    const char = baseNumber[i];
    if (char >= 'A' && char <= 'Z') {
      sum += (char.charCodeAt(0) - 55) * weights[i];
    } else if (char >= '0' && char <= '9') {
      sum += parseInt(char) * weights[i];
    }
  }
  
  const controlDigit = (sum % 10).toString();
  return baseNumber.substring(0, 4) + controlDigit + baseNumber.substring(4);
};

const generatePassportNumber = (): string => {
  const firstLetter = 'AE'[randomInt(0, 1)];
  const secondLetter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[randomInt(0, 25)];
  const digits = randomInt(100000, 999999).toString();
  
  let passport = firstLetter + secondLetter + digits;
  
  const weights = [7, 3, 1, 7, 3, 1, 7, 3];
  let sum = 0;
  
  for (let i = 0; i < passport.length; i++) {
    const char = passport[i];
    if (char >= 'A' && char <= 'Z') {
      sum += (char.charCodeAt(0) - 55) * weights[i];
    } else if (char >= '0' && char <= '9') {
      sum += parseInt(char) * weights[i];
    }
  }
  
  const controlDigit = (sum % 10).toString();
  passport = passport.substr(0, 2) + controlDigit.toString() + passport.substr(2);
  
  return passport;
};

const generateLandRegisterNumber = (): string => {
  const courtCodes = [
    'GD1', 'GD2', 'GD3', 'GD4', 'GD5', 'GD6', 'GD7', 'GD8', 'GD9',
    'KR1', 'KR2', 'KR3', 'KR4', 'KR5', 'KR6', 'KR7', 'KR8', 'KR9',
    'WA1', 'WA2', 'WA3', 'WA4', 'WA5', 'WA6', 'WA7', 'WA8', 'WA9'
  ];
  
  const courtCode = courtCodes[randomInt(0, courtCodes.length - 1)];
  const bookNumber = randomInt(10000000, 99999999).toString();
  
  const calculateControlDigit = (code: string): string => {
    const weights = [1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3];
    let sum = 0;
    
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      if (char >= 'A' && char <= 'Z') {
        sum += (char.charCodeAt(0) - 55) * weights[i];
      } else if (char >= '0' && char <= '9') {
        sum += parseInt(char) * weights[i];
      }
    }
    
    return (sum % 10).toString();
  };
  
  const controlDigit = calculateControlDigit(courtCode + bookNumber);
  return courtCode + '/' + bookNumber + '/' + controlDigit;
};

const generateSWIFT = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let swift = '';
  
  for (let i = 0; i < 4; i++) {
    swift += letters[randomInt(0, 25)];
  }
  
  swift += 'PL';
  swift += randomInt(10, 99).toString();
  
  return swift;
};

const generateGUID = (): string => {
  const hex = '0123456789abcdef';
  let uuid = '';
  
  for (let i = 0; i < 32; i++) {
    uuid += hex[randomInt(0, 15)];
  }
  
  return [
    uuid.substring(0, 8),
    uuid.substring(8, 12),
    uuid.substring(12, 16),
    uuid.substring(16, 20),
    uuid.substring(20, 32)
  ].join('-');
};

describe('Other Fields Generation', () => {
  describe('mDowód', () => {
    it('should generate valid mDowód', () => {
      const mDowod = generateMDowod();
      expect(mDowod).toHaveLength(9);
      expect(mDowod).toMatch(/^MA[A-Z]{2}\d{5}$/);
    });

    it('should start with MA prefix', () => {
      for (let i = 0; i < 10; i++) {
        const mDowod = generateMDowod();
        expect(mDowod.substring(0, 2)).toBe('MA');
      }
    });
  });

  describe('Passport Number', () => {
    it('should generate valid passport number', () => {
      const passport = generatePassportNumber();
      expect(passport).toHaveLength(9);
      expect(passport).toMatch(/^[AE][A-Z]\d{7}$/);
    });

    it('should start with A or E', () => {
      for (let i = 0; i < 10; i++) {
        const passport = generatePassportNumber();
        expect(['A', 'E']).toContain(passport[0]);
      }
    });
  });

  describe('Land Register Number', () => {
    it('should generate valid land register number', () => {
      const landRegister = generateLandRegisterNumber();
      expect(landRegister).toMatch(/^[A-Z]{2}\d\/\d{8}\/\d$/);
    });

    it('should have correct format', () => {
      for (let i = 0; i < 10; i++) {
        const landRegister = generateLandRegisterNumber();
        const parts = landRegister.split('/');
        expect(parts).toHaveLength(3);
        expect(parts[0]).toMatch(/^[A-Z]{2}\d$/);
        expect(parts[1]).toMatch(/^\d{8}$/);
        expect(parts[2]).toMatch(/^\d$/);
      }
    });
  });

  describe('SWIFT Code', () => {
    it('should generate valid SWIFT code', () => {
      const swift = generateSWIFT();
      expect(swift).toHaveLength(8);
      expect(swift).toMatch(/^[A-Z]{4}PL\d{2}$/);
    });

    it('should end with PL', () => {
      for (let i = 0; i < 10; i++) {
        const swift = generateSWIFT();
        expect(swift.substring(4, 6)).toBe('PL');
      }
    });
  });

  describe('GUID/UUID', () => {
    it('should generate valid GUID', () => {
      const guid = generateGUID();
      expect(guid).toHaveLength(36);
      expect(guid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });

    it('should generate unique GUIDs', () => {
      const guids = new Set();
      for (let i = 0; i < 100; i++) {
        const guid = generateGUID();
        expect(guids.has(guid)).toBe(false);
        guids.add(guid);
      }
    });
  });
});
