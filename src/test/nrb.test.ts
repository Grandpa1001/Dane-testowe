import { describe, it, expect } from 'vitest';
import { validateNRB, randomInt, mod97, lettersToDigits } from './testUtils';

// Mock NRB generation functions (extracted from App.tsx)
const generateNRBHelper = (bankId8: string, accountNumber: string): string => {
  const bank = String(bankId8).padStart(8, '0');
  const acc = String(accountNumber).padStart(16, '0');
  const bban = bank + acc;

  const rearranged = bban + "PL00";
  const numeric = lettersToDigits(rearranged);

  const remainder = mod97(numeric);
  const check = (98 - remainder).toString().padStart(2, '0');

  const result = check + bban;
  return result;
};

const generateNRB = (): string => {
  const unitCodes = ["10100000", "10100039", "10100055", "10100068", "10101010", "10101023", "10101049", "10101078", "10101140", "10101212", "10101238", "10101270", "10101339", "10101371", "10101397", "10101401", "10101469", "10101528", "10101599", "10101674", "10101704", "10200003", "10200016", "10200029", "10200032", "10200045", "10200058", "10200061", "10200074", "10201013", "10201026", "10201042", "10201055", "10201068", "10201097", "10201127", "10201156", "10201169", "10201185", "10201260", "10201332", "10201390", "10201433", "10201462", "10201475", "10201491", "10201505", "10201563", "10201592", "10201664", "10201752", "10201778", "10201811", "10201853", "10201866", "10201879", "10201909", "10201912", "10201954", "10201967", "10202036", "10202124", "10202137", "10202212", "10202241", "10202267", "10202313", "10202368", "10202384", "10202401", "10202430", "10202472", "10202498", "10202528", "10202629", "10202645", "10202674", "10202733", "10202746", "10202762", "10202791", "10202821", "10202847", "10202892", "10202906", "10202964", "10202980", "10203017", "10203088", "10203121", "10203147", "10203150", "10203176", "10203206", "10203219", "10203235", "10203352", "10203378", "10203408", "10203437", "10203440", "10203453", "10203466", "10203541", "10203570", "10203583", "10203613", "10203639", "10203668", "10203714", "10203802", "10203844", "10203903", "10203916", "10203958", "10203974", "10204027", "10204115", "10204128", "10204144", "10204160", "10204274", "10204287", "10204317", "10204391", "10204405", "10204476", "10204564", "10204580", "10204649", "10204665", "10204681", "10204708", "10204724", "10204753", "10204795", "10204812", "10204867", "10204870", "10204900", "10204913", "10204926", "10204939", "10204955", "10204984", "10205011", "10205024", "10205040", "10205095", "10205112", "10205138", "10205170", "10205200", "10205226", "10205242", "10205297", "10205356", "10205385", "10205402", "10205460", "10205558", "10205561", "10205574", "10205587", "10205590", "10205604", "10205617", "10205620", "10205633", "10205659"];
  
  const bankId8 = unitCodes[randomInt(0, unitCodes.length - 1)];
  const accountNumber = randomInt(0, 9999999999999999).toString().padStart(16, '0');
  
  const result = generateNRBHelper(bankId8, accountNumber);
  return result;
};

describe('NRB Generation and Validation', () => {
  it('should generate valid NRB', () => {
    const nrb = generateNRB();
    expect(nrb).toHaveLength(26);
    expect(nrb).toMatch(/^\d{26}$/);
    expect(validateNRB(nrb)).toBe(true);
  });

  it('should generate multiple valid NRBs', () => {
    for (let i = 0; i < 10; i++) {
      const nrb = generateNRB();
      expect(validateNRB(nrb)).toBe(true);
    }
  });

  it('should validate known correct NRB', () => {
    const nrb = generateNRBHelper('10201026', '0000042270200000');
    expect(nrb).toBe('84102010260000042270200000');
    expect(validateNRB(nrb)).toBe(true);
  });

  it('should reject invalid NRB', () => {
    expect(validateNRB('1234567890123456789012345')).toBe(false);
    expect(validateNRB('123456789012345678901234')).toBe(false);
    expect(validateNRB('12345678901234567890123456')).toBe(false);
    expect(validateNRB('abc1234567890123456789012')).toBe(false);
  });

  it('should use real bank codes', () => {
    const unitCodes = ["10100000", "10201026", "10200003"];
    for (const bankCode of unitCodes) {
      const nrb = generateNRBHelper(bankCode, '0000000000000000');
      expect(nrb).toHaveLength(26);
      expect(validateNRB(nrb)).toBe(true);
      expect(nrb.substring(2, 10)).toBe(bankCode);
    }
  });

  it('should pad account numbers correctly', () => {
    const nrb = generateNRBHelper('10201026', '123');
    expect(nrb).toHaveLength(26);
    expect(nrb.substring(10)).toBe('0000000000000123');
    expect(validateNRB(nrb)).toBe(true);
  });

  it('should calculate modulo 97 correctly', () => {
    // Test with known values
    expect(mod97('101000000000000000000000252100')).toBe(73);
    expect(mod97('102010260000042270200000252100')).toBe(14);
  });

  it('should convert letters to digits correctly', () => {
    expect(lettersToDigits('PL00')).toBe('252100');
    expect(lettersToDigits('PL')).toBe('2521');
  });
});
