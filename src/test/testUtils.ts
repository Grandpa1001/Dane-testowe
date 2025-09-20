// Utility functions for testing data generation algorithms

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const mod97 = (numStr: string): number => {
  let remainder = 0;
  for (let i = 0; i < numStr.length; i += 7) {
    const part = remainder.toString() + numStr.substring(i, i + 7);
    remainder = parseInt(part, 10) % 97;
  }
  return remainder;
};

export const lettersToDigits = (str: string): string => {
  return str.replace(/[A-Z]/g, ch => (ch.charCodeAt(0) - 55).toString());
};

export const validateNRB = (nrb: string): boolean => {
  const cleaned = String(nrb).replace(/\s+/g, '');
  if (!/^\d{26}$/.test(cleaned)) return false;

  const rearranged = cleaned.slice(2) + 'PL' + cleaned.slice(0, 2);
  const numeric = lettersToDigits(rearranged);

  return mod97(numeric) === 1;
};

export const validatePESEL = (pesel: string): boolean => {
  if (!/^\d{11}$/.test(pesel)) return false;
  
  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  let sum = 0;
  
  for (let i = 0; i < 10; i++) {
    sum += parseInt(pesel[i]) * weights[i];
  }
  
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(pesel[10]);
};

export const validateREGON = (regon: string): boolean => {
  if (!/^\d{9}$/.test(regon)) return false;
  
  const weights = [8, 9, 2, 3, 4, 5, 6, 7];
  let sum = 0;
  
  for (let i = 0; i < 8; i++) {
    sum += parseInt(regon[i]) * weights[i];
  }
  
  const checkDigit = (sum % 11) % 10;
  return checkDigit === parseInt(regon[8]);
};

export const validateNIP = (nip: string): boolean => {
  const cleaned = nip.replace(/[-\s]/g, '');
  if (!/^\d{10}$/.test(cleaned)) return false;
  
  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  let sum = 0;
  
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * weights[i];
  }
  
  const checkDigit = sum % 11;
  const expectedCheckDigit = checkDigit === 10 ? 0 : checkDigit;
  return expectedCheckDigit === parseInt(cleaned[9]);
};
