import { useState, useEffect } from 'react';
import { RefreshCw, Copy, Github, X, Info } from 'lucide-react';

interface TestData {
  firstName: string;
  lastName: string;
  pesel: string;
  regon: string;
  nip: string;
  nrb: string;
  idNumber: string;
  mDowod: string;
  passportNumber: string;
  landRegisterNumber: string;
  swift: string;
  guid: string;
}

function App() {
  const [data, setData] = useState<TestData>({
    firstName: '',
    lastName: '',
    pesel: '',
    regon: '',
    nip: '',
    nrb: '',
    idNumber: '',
    mDowod: '',
    passportNumber: '',
    landRegisterNumber: '',
    swift: '',
    guid: ''
  });
  
  const [copiedField, setCopiedField] = useState<string>('');
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'python' | 'javascript'>('python');
  const [showLandRegisterModal, setShowLandRegisterModal] = useState<boolean>(false);
  const [showMDowodModal, setShowMDowodModal] = useState<boolean>(false);
  const [showIDNumberModal, setShowIDNumberModal] = useState<boolean>(false);
  const [gender, setGender] = useState<'K' | 'M' | 'K/M'>('K/M');

  // Obsługa zmiany płci - przegenerowuje imię i PESEL
  const handleGenderChange = (newGender: 'K' | 'M' | 'K/M') => {
    setGender(newGender);
    
    // Przegeneruj imię i PESEL zgodnie z nową płcią
    const newData = { ...data };
    
    // Generuj nowe imię
    const selectedGender = newGender === 'K/M' ? (randomInt(0, 1) === 0 ? 'K' : 'M') : newGender;
    newData.firstName = selectedGender === 'K' 
      ? femaleNames[randomInt(0, femaleNames.length - 1)]
      : maleNames[randomInt(0, maleNames.length - 1)];
    
    // Generuj nowy PESEL
    newData.pesel = generatePESELWithGender(newGender);
    
    setData(newData);
  };

  // Polskie imiona i nazwiska
  const maleNames = [
    'Piotr', 'Tomasz', 'Krzysztof', 'Andrzej', 'Jan', 'Michał', 'Paweł', 'Marcin',
    'Łukasz', 'Jakub', 'Mateusz', 'Dawid', 'Adrian', 'Bartosz', 'Kamil', 'Rafał',
    'Kacper', 'Filip', 'Szymon', 'Krystian', 'Damian', 'Patryk', 'Mikołaj', 'Adam',
    'Marek', 'Grzegorz', 'Tadeusz', 'Wojciech', 'Mariusz', 'Robert', 'Dariusz', 'Łukasz'
  ];

  const femaleNames = [
    'Anna', 'Katarzyna', 'Agnieszka', 'Barbara', 'Ewa', 'Aleksandra', 'Joanna', 'Magdalena',
    'Monika', 'Natalia', 'Karolina', 'Sylwia', 'Patrycja', 'Weronika', 'Klaudia', 'Paulina',
    'Dominika', 'Martyna', 'Julia', 'Natalia', 'Wiktoria', 'Oliwia', 'Zuzanna', 'Amelia',
    'Marta', 'Alicja', 'Dorota', 'Beata', 'Małgorzata', 'Iwona', 'Renata', 'Grażyna'
  ];

  const lastNames = [
    'Nowak', 'Kowalski', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński', 'Lewandowski',
    'Zieliński', 'Szymański', 'Woźniak', 'Dąbrowski', 'Kozłowski', 'Jankowski', 'Mazur',
    'Wojciechowski', 'Kwiatkowski', 'Krawczyk', 'Kaczmarek', 'Piotrowski', 'Grabowski'
  ];

  // Generowanie losowej liczby
  const randomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };


  // Generowanie PESEL z uwzględnieniem płci - zgodnie z oficjalnym algorytmem
  const generatePESELWithGender = (selectedGender: 'K' | 'M' | 'K/M'): string => {
    const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    
    // Generuj losową datę urodzenia (1900-2099)
    const fullYear = randomInt(1900, 2099);
    const y = fullYear % 100;
    let m = randomInt(1, 12);
    const d = randomInt(1, 28);
    
    // Dostosuj miesiąc dla różnych stuleci
    if (fullYear >= 1800 && fullYear <= 1899) {
      m += 80;
    } else if (fullYear >= 2000 && fullYear <= 2099) {
      m += 20;
    } else if (fullYear >= 2100 && fullYear <= 2199) {
      m += 40;
    } else if (fullYear >= 2200 && fullYear <= 2299) {
      m += 60;
    }
    
    // Utwórz tablicę cyfr PESEL (10 pozycji przed cyfrą kontrolną)
    const cyfry = [
      Math.floor(y / 10),  // pozycja 1: rok - dziesiątki
      y % 10,              // pozycja 2: rok - jednostki
      Math.floor(m / 10),  // pozycja 3: miesiąc - dziesiątki
      m % 10,              // pozycja 4: miesiąc - jednostki
      Math.floor(d / 10),  // pozycja 5: dzień - dziesiątki
      d % 10,              // pozycja 6: dzień - jednostki
      randomInt(0, 9),     // pozycja 7: seria - pierwsza cyfra
      randomInt(0, 9),     // pozycja 8: seria - druga cyfra
      randomInt(0, 9),     // pozycja 9: seria - trzecia cyfra
      0                    // pozycja 10: cyfra płci - zostanie ustawiona poniżej
    ];
    
    // Ustaw cyfrę płci zgodnie z wyborem (pozycja 10)
    if (selectedGender === 'K') {
      // Kobiety: cyfra płci parzysta (0,2,4,6,8)
      cyfry[9] = randomInt(0, 4) * 2;
    } else if (selectedGender === 'M') {
      // Mężczyźni: cyfra płci nieparzysta (1,3,5,7,9)
      cyfry[9] = randomInt(0, 4) * 2 + 1;
    } else {
      // K/M: losowo
      cyfry[9] = randomInt(0, 9);
    }
    
    // Oblicz cyfrę kontrolną (pozycja 11)
    let cyfra_kontrolna = 0;
    for (let i = 0; i < cyfry.length; i++) {
      cyfra_kontrolna += weights[i] * cyfry[i];
    }
    cyfra_kontrolna = (10 - (cyfra_kontrolna % 10)) % 10;
    
    // Połącz wszystkie cyfry: YYMMDDSSSCK
    // gdzie C to cyfra płci (pozycja 10), K to cyfra kontrolna (pozycja 11)
    const result = cyfry.join('') + cyfra_kontrolna;
    return result;
  };

  // Generowanie REGON - zgodnie z oficjalnym algorytmem
  const generateREGON = (): string => {
    // Generuj 9-cyfrowy REGON (domyślnie)
    return generateREGON9();
  };

  // Generowanie 9-cyfrowego REGON
  const generateREGON9 = (): string => {
    const weights = [8, 9, 2, 3, 4, 5, 6, 7];
    
    // Generuj cyfry regionu (nieparzyste liczby 1-99)
    const regionDigits = randomInt(0, 49) * 2 + 1;
    
    // Pierwsze 2 cyfry to region
    const cyfry = [
      Math.floor(regionDigits / 10),
      regionDigits % 10
    ];
    
    // Pozostałe 6 cyfr (pozycje 2-7)
    for (let i = 2; i < weights.length; i++) {
      cyfry[i] = randomInt(0, 9);
    }

    // Oblicz cyfrę kontrolną
    let cyfra_kontrolna = 0;
    for (let i = 0; i < cyfry.length; i++) {
      cyfra_kontrolna += weights[i] * cyfry[i];
    }
    cyfra_kontrolna = (cyfra_kontrolna % 11) % 10;

    // Połącz wszystkie cyfry
    let result = cyfry.join('');
    result += cyfra_kontrolna;
    return result;
  };


  // Generowanie NIP - zgodnie z oficjalnym algorytmem
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

  const mod97 = (numStr: string): number => {
    let remainder = 0;
    for (let i = 0; i < numStr.length; i += 7) {
      const part = remainder.toString() + numStr.substring(i, i + 7);
      remainder = parseInt(part, 10) % 97;
    }
    return remainder;
  };

  const lettersToDigits = (str: string): string => {
    return str.replace(/[A-Z]/g, ch => (ch.charCodeAt(0) - 55).toString());
  };

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

  // Generowanie numeru dowodu osobistego - zgodnie z walidatorem testerzy.pl
  const generateIDNumber = (): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Pełny alfabet z O i Q
    
    // Generuj 3 litery
    let lettersPart = '';
    for (let i = 0; i < 3; i++) {
      lettersPart += letters[randomInt(0, letters.length - 1)];
    }
    
    // Generuj 5 cyfr (nie 6!)
    const digitsPart = randomInt(10000, 99999).toString();
    
    // Oblicz cyfrę kontrolną zgodnie z walidatorem testerzy.pl
    const controlDigit = calculateIDControlDigit(lettersPart, digitsPart);
    
    // Zwróć numer w formacie: 3 litery + cyfra kontrolna + 5 cyfr
    return lettersPart + controlDigit + digitsPart;
  };

  // Funkcja obliczająca cyfrę kontrolną dla numeru dowodu osobistego - zgodnie z walidatorem testerzy.pl
  const calculateIDControlDigit = (lettersPart: string, digitsPart: string): string => {
    // Wartości liter zgodnie z walidatorem: A=10, B=11, C=12, ..., Z=35
    const letterValues: { [key: string]: number } = {
      "A": 10, "B": 11, "C": 12, "D": 13, "E": 14, "F": 15, "G": 16, "H": 17, "I": 18, "J": 19, "K": 20,
      "L": 21, "M": 22, "N": 23, "O": 24, "P": 25, "Q": 26, "R": 27, "S": 28, "T": 29, "U": 30, "V": 31,
      "W": 32, "X": 33, "Y": 34, "Z": 35
    };
    
    // Wagi zgodnie z walidatorem: [7, 3, 1, 7, 3, 1, 7, 3]
    const controlSum = 7 * letterValues[lettersPart[0]] + 
                      3 * letterValues[lettersPart[1]] + 
                      1 * letterValues[lettersPart[2]] +
                      7 * parseInt(digitsPart[0]) + 
                      3 * parseInt(digitsPart[1]) + 
                      1 * parseInt(digitsPart[2]) + 
                      7 * parseInt(digitsPart[3]) + 
                      3 * parseInt(digitsPart[4]);
    
    // Cyfra kontrolna zgodnie z walidatorem: suma % 10
    return (controlSum % 10).toString();
  };

  // Generowanie numeru mDowód (dowód osobisty w systemie mObywatel)
  const generateMDowod = (): string => {
    const letters = 'ABCDEFGHIJKLMNPRSTUVWXYZ'; // Bez O i Q jak w oryginalnym algorytmie
    
    // Zawsze zaczyna się od MA
    const prefix = 'MA';
    
    // Generuj 2 litery serii dowodu
    const letter1 = letters[randomInt(0, letters.length - 1)];
    const letter2 = letters[randomInt(0, letters.length - 1)];
    
    // Generuj 4 losowe cyfry
    const randomNumbers = randomInt(1000, 9999).toString();
    
    // Utwórz bazowy numer (MA + 2 litery + 4 cyfry)
    const baseNumber = prefix + letter1 + letter2 + randomNumbers;
    
    // Oblicz cyfrę kontrolną z pierwszych 8 znaków
    const controlDigit = calculateMDowodControlDigit(baseNumber);
    
    // Wstaw cyfrę kontrolną na pozycję 4 (po MA + 2 litery)
    return baseNumber.substring(0, 4) + controlDigit + baseNumber.substring(4);
  };

  // Funkcja obliczająca cyfrę kontrolną dla numeru mDowód
  const calculateMDowodControlDigit = (mDowodString: string): string => {
    // Wagi dla kolejnych ośmiu pozycji: [M, A, L1, L2, C1, C2, C3, C4]
    const weights = [7, 3, 1, 7, 3, 1, 7, 3];
    
    let sum = 0;
    
    for (let i = 0; i < 8; i++) {
      const char = mDowodString[i];
      let value: number;
      
      if (char >= 'A' && char <= 'Z') {
        // Litery: A=10, B=11, C=12, ..., Z=35
        value = char.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
      } else if (char >= '0' && char <= '9') {
        // Cyfry: 0=0, 1=1, 2=2, ..., 9=9
        value = parseInt(char);
      } else {
        value = 0;
      }
      
      sum += value * weights[i];
    }
    
    return (sum % 10).toString();
  };

  // Generowanie numeru paszportu - zgodnie z oficjalnym algorytmem
  const generatePassportNumber = (): string => {
    // Mapowanie znaków na wartości liczbowe (A=10, B=11, ..., Z=35)
    const charValues: { [key: string]: number } = {};
    for (let i = 0; i < 26; i++) {
      charValues[String.fromCharCode(65 + i)] = 10 + i; // A=10, B=11, ..., Z=35
    }
    for (let i = 0; i < 10; i++) {
      charValues[i.toString()] = i; // 0=0, 1=1, ..., 9=9
    }
    
    // Generuj bazowy numer paszportu: AE + litera + 6 cyfr
    const firstLetter = 'AE'[randomInt(0, 1)]; // A lub E
    const secondLetter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[randomInt(0, 25)];
    const digits = randomInt(100000, 999999).toString();
    
    let passport = firstLetter + secondLetter + digits;
    
    // Wagi dla obliczenia cyfry kontrolnej
    const weights = [7, 3, 1, 7, 3, 1, 7, 3];
    
    // Oblicz sumę ważoną
    let sum = 0;
    for (let i = 0; i < passport.length; i++) {
      const znak = passport.charAt(i);
      const wartosc = charValues[znak];
      const waga = weights[i];
      sum += waga * wartosc;
    }
    
    // Oblicz cyfrę kontrolną
    const controlDigit = sum % 10;
    
    // Wstaw cyfrę kontrolną na pozycję 2 (po pierwszych dwóch literach)
    passport = passport.substr(0, 2) + controlDigit.toString() + passport.substr(2);
    
    return passport;
  };

  // Generowanie numeru księgi wieczystej
  const generateLandRegisterNumber = (): string => {
    // Oficjalne kody wydziałów sądów ksiąg wieczystych
    const courtCodes = [
      'WL1A', 'SU1A', 'OL1Y', 'PT1B', 'KA1B', 'LU1B', 'RA2G', 'KO1B', 'BI1B', 'BB1B',
      'BI1P', 'ZA1B', 'OL1B', 'TR1O', 'JG1B', 'EL1B', 'TO1B', 'OP1B', 'TR1B', 'LD1B',
      'KS1B', 'KI1B', 'BY1B', 'KA1Y', 'SL1B', 'LU1C', 'TO1C', 'PO1H', 'SL1C', 'KA1C',
      'SZ1C', 'KR1C', 'PL1C', 'BB1C', 'PO2T', 'KR1K', 'CZ1C', 'SL1Z', 'KA1D', 'TR1D',
      'RZ1D', 'KR2Y', 'KO1D', 'EL1D', 'SW1D', 'EL1E', 'OL1E', 'SI1G', 'GD1G', 'GD1Y',
      'OL1G', 'GL1G', 'LE1G', 'OP1G', 'PO1G', 'SZ1O', 'TO1G', 'NS1G', 'GW1G', 'PL1G',
      'PO1Y', 'LM1G', 'WA1G', 'PO1S', 'RA1G', 'TO1U', 'SZ1G', 'SZ1Y', 'ZG2K', 'BI2P',
      'ZA1H', 'EL1I', 'BY1I', 'ZA1J', 'KZ1J', 'PR1J', 'KS1J', 'GL1J', 'LE1J', 'KA1J',
      'JG1J', 'KI1J', 'KZ1A', 'JG1K', 'SZ1K', 'GD1R', 'KA1K', 'KI1I', 'OP1K', 'KZ1E',
      'OL1K', 'KR2E', 'KI1L', 'OP1U', 'CZ2C', 'SW1K', 'TB1K', 'KO1L', 'KN1K', 'KN1N',
      'KI1K', 'KO1K', 'PO1K', 'GD1E', 'RA1K', 'KR1P', 'ZA1K', 'LU1K', 'KS1K', 'ZG1K',
      'KZ1R', 'KR2K', 'LD1K', 'GD1I', 'WA1L', 'LE1L', 'KS1E', 'PO1L', 'RZ1E', 'SL1L',
      'OL1L', 'NS1L', 'WL1L', 'RA1L', 'PR1L', 'JG1L', 'LU1A', 'LE1U', 'CZ1L', 'LU1I',
      'JG1S', 'RZ1A', 'SR1L', 'LD1Y', 'SZ1L', 'LM1L', 'SI2S', 'LD1O', 'LD1M', 'LU1U',
      'GD1M', 'SL1M', 'KR1M', 'TB1M', 'PO2A', 'GW1M', 'KA1M', 'WR1M', 'SI1M', 'PL1M',
      'BY1M', 'EL2O', 'OL1M', 'NS2L', 'NS1M', 'KA1L', 'CZ1M', 'KR1Y', 'SZ1M', 'BY1N',
      'OL1N', 'KR2I', 'TB1N', 'SW2K', 'ZG1N', 'EL1N', 'GD2M', 'WA1N', 'NS1S', 'NS1T',
      'PO1N', 'OP1N', 'PO1O', 'OL1C', 'OP1L', 'WR1E', 'KR1O', 'OL1O', 'WR1O', 'KI1T',
      'PT1O', 'LU1O', 'OP1O', 'OS1O', 'KI1O', 'EL1O', 'OS1M', 'KZ1W', 'KZ1O', 'KR1E',
      'WA1O', 'LD1P', 'SR2W', 'WA1I', 'PO1I', 'KI1P', 'RA2Z', 'PT1P', 'OL1P', 'KZ1P',
      'PL1P', 'PL1L', 'SR2L', 'SZ2S', 'PO1P', 'PO2P', 'KR1H', 'OP1P', 'WA1P', 'OS1P',
      'PR1P', 'PR1R', 'RA1P', 'KA1P', 'GD2W', 'LU1P', 'OS1U', 'SZ2T', 'GL1R', 'RA1R',
      'PT1R', 'WL1R', 'LU1R', 'LD1R', 'PO1R', 'RZ1R', 'GL1S', 'GL1Y', 'LU1Y', 'WL1Y',
      'RZ1Z', 'KI1S', 'KS1S', 'SU1N', 'BY2T', 'SI1S', 'KA1I', 'BI3P', 'PR2R', 'SR1S',
      'PL1E', 'KR2P', 'KI1R', 'KR3I', 'LD1H', 'KO1E', 'KR1S', 'GW1S', 'KN1S', 'SL1S',
      'PL1O', 'SI1P', 'BI1S', 'GD1S', 'KA1S', 'TB1S', 'KI1H', 'SZ1T', 'GD1A', 'KI1A',
      'GW1K', 'OP1S', 'WR1T', 'RZ1S', 'KR1B', 'ZG2S', 'GW1U', 'SU1S', 'PO1A', 'KO1I',
      'SZ1S', 'OL1S', 'GD2I', 'BY1U', 'RA1S', 'PO1M', 'WR1S', 'PO1D', 'SW1S', 'LU1S',
      'KO2B', 'ZG1S', 'BY1S', 'SZ1W', 'TB1T', 'GL1T', 'TR1T', 'GD1T', 'ZA1T', 'PT1T',
      'TO1T', 'PO1T', 'WR1W', 'BY1T', 'TR2T', 'KN1T', 'KA1T', 'RZ2Z', 'KS2E', 'KR1W',
      'SW1W', 'KO1W', 'WA1M', 'WA2M', 'WA3M', 'WA4M', 'WA5M', 'WA6M', 'TO1W', 'PO1B',
      'GD1W', 'OL2G', 'SI1W', 'KR1I', 'SR1W', 'WL1W', 'LU1W', 'KI1W', 'GL1W', 'PO1E',
      'WA1W', 'WR1L', 'WR1K', 'PO1F', 'ZG1W', 'PO2H', 'LM1W', 'OS1W', 'GL1Z', 'NS1Z',
      'LM1Z', 'ZA1Z', 'CZ1Z', 'SW1Z', 'SR1Z', 'LD1G', 'JG1Z', 'ZG1E', 'LE1Z', 'PO1Z',
      'RA1Z', 'ZG1G', 'ZG1R', 'BY1Z', 'GL1X', 'PL2M', 'PL1Z', 'BB1Z'
    ];
    
    // Wybierz losowy kod wydziału
    const courtCode = courtCodes[randomInt(0, courtCodes.length - 1)];
    
    // Generuj 8-cyfrowy numer księgi wieczystej
    const bookNumber = randomInt(10000000, 99999999).toString();
    
    // Oblicz cyfrę kontrolną
    const controlDigit = calculateControlDigit(courtCode + bookNumber);
    
    return `${courtCode}/${bookNumber}/${controlDigit}`;
  };

  // Obliczanie cyfry kontrolnej księgi wieczystej
  const calculateControlDigit = (input: string): string => {
    // Oficjalne wartości znaków zgodnie z tabelą Ministerstwa Sprawiedliwości
    const charValues: { [key: string]: number } = {
      // Cyfry
      '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
      // Litery - zgodnie z oficjalną tabelą
      'X': 10, 'A': 11, 'B': 12, 'C': 13, 'D': 14, 'E': 15, 'F': 16,
      'G': 17, 'H': 18, 'I': 19, 'J': 20, 'K': 21, 'L': 22, 'M': 23, 'N': 24, 'O': 25, 'P': 26,
      'R': 27, 'S': 28, 'T': 29, 'U': 30, 'W': 31, 'Y': 32, 'Z': 33
    };
    
    // Wagi dla kolejnych znaków: 1 3 7 1 3 7 1 3 7 1 3 7
    const weights = [1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
    
    let sum = 0;
    
    for (let i = 0; i < input.length && i < weights.length; i++) {
      const char = input[i].toUpperCase();
      const value = charValues[char] || 0;
      const weight = weights[i];
      sum += value * weight;
    }
    
    return (sum % 10).toString();
  };

  // Generowanie SWIFT
  const generateSWIFT = (): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let swift = '';
    
    // 4 litery (kod banku)
    for (let i = 0; i < 4; i++) {
      swift += letters[randomInt(0, 25)];
    }
    
    // 2 litery (kod kraju) - PL dla Polski
    swift += 'PL';
    
    // 2 znaki (kod lokalizacji)
    swift += randomInt(10, 99).toString();
    
    return swift;
  };


  // Generowanie GUID/UUID v4
  const generateGUID = (): string => {
    // Generowanie UUID v4 zgodnie z RFC 4122
    const hex = '0123456789abcdef';
    let uuid = '';
    
    // Generuj 32 losowych znaków hex
    for (let i = 0; i < 32; i++) {
      uuid += hex[randomInt(0, 15)];
    }
    
    // Wstaw myślniki w odpowiednich miejscach
    return [
      uuid.substring(0, 8),
      uuid.substring(8, 12),
      uuid.substring(12, 16),
      uuid.substring(16, 20),
      uuid.substring(20, 32)
    ].join('-');
  };

  // Generowanie wszystkich danych
  const generateAllData = (): TestData => {
    const selectedGender = gender === 'K/M' ? (randomInt(0, 1) === 0 ? 'K' : 'M') : gender;
    const firstName = selectedGender === 'K' 
      ? femaleNames[randomInt(0, femaleNames.length - 1)]
      : maleNames[randomInt(0, maleNames.length - 1)];
    
    return {
      firstName: firstName,
      lastName: lastNames[randomInt(0, lastNames.length - 1)],
      pesel: generatePESELWithGender(selectedGender),
      regon: generateREGON(),
      nip: generateNIP(),
      nrb: generateNRB(),
      idNumber: generateIDNumber(),
      mDowod: generateMDowod(),
      passportNumber: generatePassportNumber(),
      landRegisterNumber: generateLandRegisterNumber(),
      swift: generateSWIFT(),
      guid: generateGUID()
    };
  };

  // Kopiowanie do schowka
  const copyToClipboard = async (value: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (err) {
      console.error('Nie można skopiować do schowka:', err);
    }
  };

  // Odświeżanie pojedynczego pola
  const refreshField = (fieldKey: keyof TestData) => {
    const newData = { ...data };
    
    switch (fieldKey) {
      case 'firstName':
        const selectedGender = gender === 'K/M' ? (randomInt(0, 1) === 0 ? 'K' : 'M') : gender;
        newData.firstName = selectedGender === 'K' 
          ? femaleNames[randomInt(0, femaleNames.length - 1)]
          : maleNames[randomInt(0, maleNames.length - 1)];
        break;
      case 'lastName':
        newData.lastName = lastNames[randomInt(0, lastNames.length - 1)];
        break;
      case 'pesel':
        newData.pesel = generatePESELWithGender(gender);
        break;
      case 'regon':
        newData.regon = generateREGON();
        break;
      case 'nip':
        newData.nip = generateNIP();
        break;
      case 'nrb':
        newData.nrb = generateNRB();
        break;
      case 'idNumber':
        newData.idNumber = generateIDNumber();
        break;
      case 'mDowod':
        newData.mDowod = generateMDowod();
        break;
      case 'passportNumber':
        newData.passportNumber = generatePassportNumber();
        break;
      case 'landRegisterNumber':
        newData.landRegisterNumber = generateLandRegisterNumber();
        break;
      case 'swift':
        newData.swift = generateSWIFT();
        break;
      case 'guid':
        newData.guid = generateGUID();
        break;
    }
    
    setData(newData);
  };

  // Kopiowanie kodu
  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      alert("Kod skopiowany do schowka!");
    } catch (err) {
      console.error('Nie można skopiować kodu:', err);
    }
  };


  // Inicjalizacja danych przy uruchomieniu
  useEffect(() => {
    setData(generateAllData());
  }, []);

  const fields = [
    { key: 'firstName' as keyof TestData, label: 'Imię' },
    { key: 'lastName' as keyof TestData, label: 'Nazwisko' },
    { key: 'pesel' as keyof TestData, label: 'PESEL' },
    { key: 'regon' as keyof TestData, label: 'REGON' },
    { key: 'nip' as keyof TestData, label: 'NIP' },
    { key: 'nrb' as keyof TestData, label: 'NRB' },
    { key: 'idNumber' as keyof TestData, label: 'Numer dowodu' },
    { key: 'mDowod' as keyof TestData, label: 'mDowód' },
    { key: 'passportNumber' as keyof TestData, label: 'Numer paszportu' },
    { key: 'landRegisterNumber' as keyof TestData, label: 'Księga wieczysta' },
    { key: 'swift' as keyof TestData, label: 'SWIFT' },
    { key: 'guid' as keyof TestData, label: 'GUID' }
  ];

  return (
    <div id="app-container" data-testid="app-container" className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b-2 border-black">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black text-black mb-2">
                Generator Danych Testowych
              </h1>
              <p className="text-gray-600 text-sm">
                PESEL, REGON, NIP, dowód osobisty (ABC012345), mDowód, paszport, księga wieczysta, NRB, SWIFT, GUID
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Kliknij pole aby skopiować • Użyj ↻ do odświeżania
              </p>
              <div className="bg-gray-50 border-2 border-black p-2 mt-2 text-xs">
                <span className="font-bold text-black">Automatyzacja:</span> 
                <span className="text-gray-700"> Każde pole ma unikalny ID (np. input-pesel). </span>
                <button 
                  onClick={() => setShowHelpModal(true)}
                  className="text-black underline hover:text-gray-600 font-bold"
                >
                  Zobacz instrukcje →
                </button>
              </div>
            </div>
            
            {/* Computer illustration */}
            <div className="flex-shrink-0">
              <div className="w-32 h-24 md:w-40 md:h-30 bg-black rounded-lg relative">
                {/* Monitor */}
                <div className="absolute inset-2 bg-white rounded border-2 border-black">
                  <div className="w-full h-2 bg-black rounded-t"></div>
                  <div className="p-2 pb-4 flex items-center justify-center h-full">
                    <img 
                      src="/Wasi_noBackground.png" 
                      alt="Wasi" 
                      className="w-16 h-16 object-contain grayscale"
                    />
                  </div>
                </div>
                {/* Stand */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-black rounded-b"></div>
                {/* Base */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-black rounded"></div>
                {/* Decorative elements */}
                <div className="absolute -top-2 -right-2 w-3 h-3 border-2 border-black rounded-full bg-white"></div>
                <div className="absolute -top-4 right-4 w-2 h-2 border-2 border-black rounded-full bg-white"></div>
                <div className="absolute -left-3 top-2 w-2 h-2 border-2 border-black rounded-full bg-white"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div id="fields-container" data-testid="fields-container" className="space-y-3">
          {/* Pierwszy rząd: Imię i Nazwisko */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Pole Imię */}
            <div
              id="field-container-firstName"
              data-testid="field-container-firstName"
              data-field-type="firstName"
              data-field-label="Imię"
              className="bg-white border-2 border-black p-3 hover:shadow-lg transition-shadow relative"
            >
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                Imię
                <span className="text-gray-500 font-normal normal-case ml-2">
                  ID: input-firstName
                </span>
              </label>
              
              <div className="flex gap-2">
                <input
                  id="input-firstName"
                  data-testid="input-firstName"
                  data-field-type="firstName"
                  data-field-label="Imię"
                  type="text"
                  value={data.firstName}
                  readOnly
                  onClick={() => copyToClipboard(data.firstName, 'firstName')}
                  className="flex-1 px-2 py-1 border border-gray-300 text-sm font-mono bg-gray-50 cursor-pointer hover:bg-gray-100 focus:outline-none focus:border-black transition-colors"
                  placeholder="Kliknij aby skopiować"
                />
                <button
                  id="refresh-firstName"
                  data-testid="refresh-firstName"
                  data-field-type="firstName"
                  data-action="refresh-field"
                  onClick={() => refreshField('firstName')}
                  className="px-2 py-1 bg-black text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                  title="Odśwież"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

            {/* Pole Nazwisko */}
            <div
              id="field-container-lastName"
              data-testid="field-container-lastName"
              data-field-type="lastName"
              data-field-label="Nazwisko"
              className="bg-white border-2 border-black p-3 hover:shadow-lg transition-shadow relative"
            >
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                Nazwisko
                <span className="text-gray-500 font-normal normal-case ml-2">
                  ID: input-lastName
                </span>
              </label>
              
              <div className="flex gap-2">
                <input
                  id="input-lastName"
                  data-testid="input-lastName"
                  data-field-type="lastName"
                  data-field-label="Nazwisko"
                  type="text"
                  value={data.lastName}
                  readOnly
                  onClick={() => copyToClipboard(data.lastName, 'lastName')}
                  className="flex-1 px-2 py-1 border border-gray-300 text-sm font-mono bg-gray-50 cursor-pointer hover:bg-gray-100 focus:outline-none focus:border-black transition-colors"
                  placeholder="Kliknij aby skopiować"
                />
                <button
                  id="refresh-lastName"
                  data-testid="refresh-lastName"
                  data-field-type="lastName"
                  data-action="refresh-field"
                  onClick={() => refreshField('lastName')}
                  className="px-2 py-1 bg-black text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                  title="Odśwież"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Drugi rząd: Płeć i PESEL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Przełącznik płci */}
            <div className="bg-white border-2 border-black p-3 hover:shadow-lg transition-shadow relative">
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                Płeć
                <span className="text-gray-500 font-normal normal-case ml-2">
                  ID: gender-switch
                </span>
              </label>
              
              <div className="flex gap-2">
                <div className="flex-1 flex bg-gray-100 border border-gray-300 rounded">
                  <button
                    id="gender-k"
                    data-testid="gender-k"
                    onClick={() => handleGenderChange('K')}
                    className={`flex-1 px-3 py-1 text-xs font-bold transition-colors ${
                      gender === 'K' 
                        ? 'bg-black text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Kobieta
                  </button>
                  <button
                    id="gender-m"
                    data-testid="gender-m"
                    onClick={() => handleGenderChange('M')}
                    className={`flex-1 px-3 py-1 text-xs font-bold transition-colors ${
                      gender === 'M' 
                        ? 'bg-black text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Mężczyzna
                  </button>
                  <button
                    id="gender-km"
                    data-testid="gender-km"
                    onClick={() => handleGenderChange('K/M')}
                    className={`flex-1 px-3 py-1 text-xs font-bold transition-colors ${
                      gender === 'K/M' 
                        ? 'bg-black text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    K/M
                  </button>
                </div>
              </div>
            </div>

            {/* Pole PESEL */}
            <div
              id="field-container-pesel"
              data-testid="field-container-pesel"
              data-field-type="pesel"
              data-field-label="PESEL"
              className="bg-white border-2 border-black p-3 hover:shadow-lg transition-shadow relative"
            >
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                PESEL
                <span className="text-gray-500 font-normal normal-case ml-2">
                  ID: input-pesel
                </span>
              </label>
              
              <div className="flex gap-2">
                <input
                  id="input-pesel"
                  data-testid="input-pesel"
                  data-field-type="pesel"
                  data-field-label="PESEL"
                  type="text"
                  value={data.pesel}
                  readOnly
                  onClick={() => copyToClipboard(data.pesel, 'pesel')}
                  className="flex-1 px-2 py-1 border border-gray-300 text-sm font-mono bg-gray-50 cursor-pointer hover:bg-gray-100 focus:outline-none focus:border-black transition-colors"
                  placeholder="Kliknij aby skopiować"
                />
                <button
                  id="refresh-pesel"
                  data-testid="refresh-pesel"
                  data-field-type="pesel"
                  data-action="refresh-field"
                  onClick={() => refreshField('pesel')}
                  className="px-2 py-1 bg-black text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                  title="Odśwież"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Pozostałe pola w standardowym układzie */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fields.filter(field => !['firstName', 'lastName', 'pesel'].includes(field.key)).map((field) => (
              <div
                key={field.key}
                id={`field-container-${field.key}`}
                data-testid={`field-container-${field.key}`}
                data-field-type={field.key}
                data-field-label={field.label}
                className="bg-white border-2 border-black p-3 hover:shadow-lg transition-shadow relative"
              >
                {/* Tooltip button for land register */}
                {field.key === 'landRegisterNumber' && (
                  <button
                    onClick={() => setShowLandRegisterModal(true)}
                    className="absolute top-2 right-2 hover:bg-gray-200 rounded transition-colors"
                    title="Jak obliczana jest cyfra kontrolna?"
                  >
                    <Info size={12} />
                  </button>
                )}

                {/* Tooltip button for mDowód */}
                {field.key === 'mDowod' && (
                  <button
                    onClick={() => setShowMDowodModal(true)}
                    className="absolute top-2 right-2 hover:bg-gray-200 rounded transition-colors"
                    title="Jak generowany jest mDowód?"
                  >
                    <Info size={12} />
                  </button>
                )}

                {/* Tooltip button for ID Number */}
                {field.key === 'idNumber' && (
                  <button
                    onClick={() => setShowIDNumberModal(true)}
                    className="absolute top-2 right-2 hover:bg-gray-200 rounded transition-colors"
                    title="Jak generowany jest numer dowodu osobistego? (3 litery + cyfra kontrolna + 5 cyfr)"
                  >
                    <Info size={12} />
                  </button>
                )}

                
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                  {field.label}
                  <span className="text-gray-500 font-normal normal-case ml-2">
                    ID: input-{field.key}
                  </span>
                </label>
                
                <div className="flex gap-2">
                  <input
                    id={`input-${field.key}`}
                    data-testid={`input-${field.key}`}
                    data-field-type={field.key}
                    data-field-label={field.label}
                    type="text"
                    value={data[field.key]}
                    readOnly
                    onClick={() => copyToClipboard(data[field.key], field.key)}
                    className="flex-1 px-2 py-1 border border-gray-300 text-sm font-mono bg-gray-50 cursor-pointer hover:bg-gray-100 focus:outline-none focus:border-black transition-colors"
                    placeholder="Kliknij aby skopiować"
                  />
                  <button
                    id={`refresh-${field.key}`}
                    data-testid={`refresh-${field.key}`}
                    data-field-type={field.key}
                    data-action="refresh-field"
                    onClick={() => refreshField(field.key)}
                    className="px-2 py-1 bg-black text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                    title="Odśwież"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refresh All Button */}
        <div className="text-center mt-6">
          <button
            id="refresh-all-button"
            data-testid="refresh-all-button"
            data-action="refresh-all"
            onClick={() => setData(generateAllData())}
            className="px-6 py-2 bg-black text-white font-bold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
          >
            Odśwież wszystkie dane
          </button>
        </div>
      </div>

      {/* Toast notification */}
      {copiedField && (
        <div id="toast-notification" data-testid="toast-notification" className="fixed top-4 right-4 z-50">
          <div className="bg-black text-white px-4 py-2 border-2 border-black shadow-lg">
            <div className="flex items-center gap-2">
              <Copy size={16} />
              <span className="font-bold text-sm">Skopiowano!</span>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-black max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b-2 border-black">
              <h2 className="text-2xl font-black text-black">🤖 Instrukcje Automatyzacji</h2>
              <button
                id="close-help-modal"
                data-testid="close-help-modal"
                onClick={() => setShowHelpModal(false)}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Introduction */}
              <div className="bg-gray-50 p-4 border-2 border-black">
                <h3 className="text-lg font-bold mb-2 text-black">🎯 Każde pole ma unikalny identyfikator!</h3>
                <p className="text-sm text-gray-700">
                  Wszystkie pola mają unikalne ID i atrybuty <code className="bg-white border border-black px-1 font-mono">data-testid</code> 
                  które ułatwiają automatyzację testów z Selenium, Playwright, Cypress i innymi narzędziami.
                </p>
              </div>

              {/* Field IDs */}
              <div>
                <h3 className="text-lg font-bold mb-3 text-black">📋 Dostępne identyfikatory pól:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="bg-white p-2 border-2 border-black">
                    <strong className="text-black">Imię:</strong> <code className="bg-gray-100 border border-black px-1 font-mono">input-firstName</code>
                  </div>
                  <div className="bg-white p-2 border-2 border-black">
                    <strong className="text-black">Nazwisko:</strong> <code className="bg-gray-100 border border-black px-1 font-mono">input-lastName</code>
                  </div>
                  <div className="bg-white p-2 border-2 border-black">
                    <strong className="text-black">PESEL:</strong> <code className="bg-gray-100 border border-black px-1 font-mono">input-pesel</code>
                  </div>
                  <div className="bg-white p-2 border-2 border-black">
                    <strong className="text-black">REGON:</strong> <code className="bg-gray-100 border border-black px-1 font-mono">input-regon</code>
                  </div>
                  <div className="bg-white p-2 border-2 border-black">
                    <strong className="text-black">NIP:</strong> <code className="bg-gray-100 border border-black px-1 font-mono">input-nip</code>
                  </div>
                  <div className="bg-white p-2 border-2 border-black">
                    <strong className="text-black">NRB:</strong> <code className="bg-gray-100 border border-black px-1 font-mono">input-nrb</code>
                  </div>
                  <div className="bg-white p-2 border-2 border-black">
                    <strong className="text-black">Dowód (ABC012345):</strong> <code className="bg-gray-100 border border-black px-1 font-mono">input-idNumber</code>
                  </div>
                  <div className="bg-white p-2 border-2 border-black">
                    <strong className="text-black">mDowód:</strong> <code className="bg-gray-100 border border-black px-1 font-mono">input-mDowod</code>
                  </div>
                  <div className="bg-white p-2 border-2 border-black">
                    <strong className="text-black">Paszport:</strong> <code className="bg-gray-100 border border-black px-1 font-mono">input-passportNumber</code>
                  </div>
                  <div className="bg-white p-2 border-2 border-black">
                    <strong className="text-black">Księga:</strong> <code className="bg-gray-100 border border-black px-1 font-mono">input-landRegisterNumber</code>
                  </div>
                  <div className="bg-white p-2 border-2 border-black">
                    <strong className="text-black">SWIFT:</strong> <code className="bg-gray-100 border border-black px-1 font-mono">input-swift</code>
                  </div>
                  <div className="bg-white p-2 border-2 border-black">
                  </div>
                  <div className="bg-white p-2 border-2 border-black">
                    <strong className="text-black">GUID:</strong> <code className="bg-gray-100 border border-black px-1 font-mono">input-guid</code>
                  </div>
                </div>
              </div>

              {/* Button IDs */}
              <div>
                <h3 className="text-lg font-bold mb-3 text-black">🔄 Przyciski odświeżania:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="bg-white p-2 border-2 border-black">
                    <strong className="text-black">Odśwież pole:</strong> <code className="bg-gray-100 border border-black px-1 font-mono">refresh-{'{fieldName}'}</code>
                  </div>
                  <div className="bg-white p-2 border-2 border-black">
                    <strong className="text-black">Odśwież wszystkie:</strong> <code className="bg-gray-100 border border-black px-1 font-mono">refresh-all-button</code>
                  </div>
                </div>
              </div>

              {/* Code Examples with Tabs */}
              <div>
                <h3 className="text-lg font-bold mb-3 text-black">💻 Przykłady kodu:</h3>
                
                {/* Tab Navigation */}
                <div className="flex border-2 border-black mb-0">
                  <button
                    onClick={() => setActiveTab('python')}
                    className={`px-4 py-2 font-bold text-sm border-r-2 border-black ${
                      activeTab === 'python' 
                        ? 'bg-black text-white' 
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    🐍 Python (Selenium)
                  </button>
                  <button
                    onClick={() => setActiveTab('javascript')}
                    className={`px-4 py-2 font-bold text-sm ${
                      activeTab === 'javascript' 
                        ? 'bg-black text-white' 
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    🟨 JavaScript (Playwright)
                  </button>
                </div>

                {/* Tab Content */}
                <div className="bg-black text-white border-2 border-black border-t-0 relative">
                  {/* Copy Button */}
                  <button
                    onClick={() => {
                      const pythonCode = `# Instalacja: pip install selenium
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("https://dane-testowe.netlify.app/")

# Pobieranie wartości PESEL
pesel = driver.find_element(By.ID, "input-pesel")
pesel_value = pesel.get_attribute("value")
print(f"PESEL: {pesel_value}")

# Pobieranie wszystkich danych
fields = ["firstName", "lastName", "pesel", "regon"]
for field in fields:
    element = driver.find_element(By.ID, f"input-{field}")
    print(f"{field}: {element.get_attribute('value')}")

# Odświeżenie pola
driver.find_element(By.ID, "refresh-pesel").click()
driver.quit()`;

                      const jsCode = `// Instalacja: npm install playwright
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://dane-testowe.netlify.app/');
  
  // Pobieranie wartości PESEL
  const peselValue = await page.inputValue('#input-pesel');
  console.log('PESEL:', peselValue);
  
  // Pobieranie wszystkich danych
  const fields = ['firstName', 'lastName', 'pesel', 'regon'];
  for (const field of fields) {
    const value = await page.inputValue(\`#input-\${field}\`);
    console.log(\`\${field}:\`, value);
  }
  
  // Odświeżenie pola
  await page.click('#refresh-pesel');
  
  await browser.close();
})();`;

                      copyCode(activeTab === 'python' ? pythonCode : jsCode);
                    }}
                    className="absolute top-2 right-2 p-2 bg-white text-black hover:bg-gray-200 transition-colors"
                    title="Skopiuj kod"
                  >
                    <Copy size={16} />
                  </button>

                  {/* Code Display */}
                  <div className="p-4 pr-12 text-sm font-mono overflow-x-auto">
                    {activeTab === 'python' ? (
                      <pre>{`# Instalacja: pip install selenium
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("https://dane-testowe.netlify.app/")

# Pobieranie wartości PESEL
pesel = driver.find_element(By.ID, "input-pesel")
pesel_value = pesel.get_attribute("value")
print(f"PESEL: {pesel_value}")

# Pobieranie wszystkich danych
fields = ["firstName", "lastName", "pesel", "regon"]
for field in fields:
    element = driver.find_element(By.ID, f"input-{field}")
    print(f"{field}: {element.get_attribute('value')}")

# Odświeżenie pola
driver.find_element(By.ID, "refresh-pesel").click()
driver.quit()`}</pre>
                    ) : (
                      <pre>{`// Instalacja: npm install playwright
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://dane-testowe.netlify.app/');
  
  // Pobieranie wartości PESEL
  const peselValue = await page.inputValue('#input-pesel');
  console.log('PESEL:', peselValue);
  
  // Pobieranie wszystkich danych
  const fields = ['firstName', 'lastName', 'pesel', 'regon'];
  for (const field of fields) {
    const value = await page.inputValue(\`#input-\${field}\`);
    console.log(\`\${field}:\`, value);
  }
  
  // Odświeżenie pola
  await page.click('#refresh-pesel');
  
  await browser.close();
})();`}</pre>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-gray-50 p-4 border-2 border-black">
                <h3 className="text-lg font-bold mb-2 text-black">💡 Szybkie wskazówki:</h3>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Każde pole ma zarówno <code className="bg-white border border-black px-1 font-mono">id</code> jak i <code className="bg-white border border-black px-1 font-mono">data-testid</code></li>
                  <li>• Użyj <code className="bg-white border border-black px-1 font-mono">By.ID</code> lub <code className="bg-white border border-black px-1 font-mono">By.CSS_SELECTOR</code> w Selenium</li>
                  <li>• Wartości są automatycznie generowane przy każdym odświeżeniu</li>
                  <li>• Aplikacja dostępna na <code className="bg-white border border-black px-1 font-mono">https://dane-testowe.netlify.app/</code></li>
                  <li>• Pełna dokumentacja w pliku <code className="bg-white border border-black px-1 font-mono">TESTING.md</code></li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Land Register Algorithm Modal */}
      {showLandRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-black max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b-2 border-black">
              <h2 className="text-2xl font-black text-black">🏛️ Algorytm Księgi Wieczystej</h2>
              <button
                onClick={() => setShowLandRegisterModal(false)}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Introduction */}
              <div className="bg-gray-50 p-4 border-2 border-black">
                <h3 className="text-lg font-bold mb-2 text-black">📋 Format numeru księgi wieczystej:</h3>
                <p className="text-sm text-gray-700 mb-2">
                  <code className="bg-white border border-black px-1 font-mono">XXXX/XXXXXXXX/X</code>
                </p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>XXXX</strong> - kod wydziału sądu (np. WA1N)</li>
                  <li>• <strong>XXXXXXXX</strong> - 8-cyfrowy numer księgi</li>
                  <li>• <strong>X</strong> - cyfra kontrolna (0-9)</li>
                </ul>
              </div>

              {/* Algorithm Steps */}
              <div>
                <h3 className="text-lg font-bold mb-3 text-black">🔢 Kroki obliczania cyfry kontrolnej:</h3>
                <div className="space-y-4">
                  <div className="bg-white p-3 border-2 border-black">
                    <h4 className="font-bold text-black mb-2">1. Przypisanie wartości znakom</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div><strong>Cyfry:</strong> 0=0, 1=1, 2=2, ..., 9=9</div>
                      <div><strong>Litery:</strong> X=10, A=11, B=12, ..., Z=33</div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 border-2 border-black">
                    <h4 className="font-bold text-black mb-2">2. Wagi dla kolejnych znaków</h4>
                    <p className="text-sm text-gray-700">
                      <code className="bg-gray-100 border border-black px-1 font-mono">1 3 7 1 3 7 1 3 7 1 3 7</code>
                    </p>
                  </div>
                  
                  <div className="bg-white p-3 border-2 border-black">
                    <h4 className="font-bold text-black mb-2">3. Obliczenia</h4>
                    <p className="text-sm text-gray-700">
                      Każdy znak × jego waga, następnie suma wszystkich iloczynów
                    </p>
                  </div>
                  
                  <div className="bg-white p-3 border-2 border-black">
                    <h4 className="font-bold text-black mb-2">4. Cyfra kontrolna</h4>
                    <p className="text-sm text-gray-700">
                      Reszta z dzielenia sumy przez 10
                    </p>
                  </div>
                </div>
              </div>

              {/* Example */}
              <div>
                <h3 className="text-lg font-bold mb-3 text-black">📝 Przykład: WA1N/22092490/7</h3>
                <div className="bg-black text-white p-4 border-2 border-black text-sm font-mono overflow-x-auto">
                  <pre>{`WA1N22092490

W(31) × 1 = 31
A(11) × 3 = 33
1(1) × 7 = 7
N(24) × 1 = 24
2(2) × 3 = 6
2(2) × 7 = 14
0(0) × 1 = 0
9(9) × 3 = 27
2(2) × 7 = 14
4(4) × 1 = 4
9(9) × 3 = 27
0(0) × 7 = 0

Suma: 31+33+7+24+6+14+0+27+14+4+27+0 = 187
Cyfra kontrolna: 187 % 10 = 7`}</pre>
                </div>
              </div>

              {/* Character Values Table */}
              <div>
                <h3 className="text-lg font-bold mb-3 text-black">📊 Tabela wartości znaków:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-2 border-2 border-black">
                    <strong>Cyfry:</strong><br/>
                    0=0, 1=1, 2=2, 3=3, 4=4<br/>
                    5=5, 6=6, 7=7, 8=8, 9=9
                  </div>
                  <div className="bg-white p-2 border-2 border-black">
                    <strong>Litery A-F:</strong><br/>
                    X=10, A=11, B=12, C=13<br/>
                    D=14, E=15, F=16
                  </div>
                  <div className="bg-white p-2 border-2 border-black">
                    <strong>Litery G-P:</strong><br/>
                    G=17, H=18, I=19, J=20<br/>
                    K=21, L=22, M=23, N=24<br/>
                    O=25, P=26
                  </div>
                  <div className="bg-white p-2 border-2 border-black">
                    <strong>Litery R-Z:</strong><br/>
                    R=27, S=28, T=29, U=30<br/>
                    W=31, Y=32, Z=33
                  </div>
                </div>
              </div>

              {/* Official Source */}
              <div className="bg-yellow-50 p-4 border-2 border-yellow-300">
                <h3 className="text-lg font-bold mb-2 text-black">ℹ️ Źródło:</h3>
                <p className="text-sm text-gray-700">
                  Algorytm zgodny z oficjalną specyfikacją Ministerstwa Sprawiedliwości.
                  Używany w systemie EKW (Elektroniczne Księgi Wieczyste).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* mDowód Algorithm Modal */}
      {showMDowodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-black max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b-2 border-black">
              <h2 className="text-2xl font-black text-black">📱 Algorytm mDowód</h2>
              <button
                onClick={() => setShowMDowodModal(false)}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Introduction */}
              <div className="bg-gray-50 p-4 border-2 border-black">
                <h3 className="text-lg font-bold mb-2 text-black">📋 Format numeru mDowód:</h3>
                <p className="text-sm text-gray-700 mb-2">
                  <code className="bg-white border border-black px-1 font-mono">MAXXYYYY</code>
                </p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>MA</strong> - stały prefiks</li>
                  <li>• <strong>XX</strong> - 2 litery serii dowodu</li>
                  <li>• <strong>Y</strong> - cyfra kontrolna (pozycja 4)</li>
                  <li>• <strong>YYYY</strong> - 4 cyfry numeru dowodu</li>
                </ul>
              </div>

              {/* Algorithm Steps */}
              <div>
                <h3 className="text-lg font-bold mb-3 text-black">🔢 Kroki generowania:</h3>
                <div className="space-y-4">
                  <div className="bg-white p-3 border-2 border-black">
                    <h4 className="font-bold text-black mb-2">1. Generowanie prefiksu</h4>
                    <p className="text-sm text-gray-700">
                      Zawsze zaczyna się od <code className="bg-gray-100 border border-black px-1 font-mono">MA</code>
                    </p>
                  </div>
                  
                  <div className="bg-white p-3 border-2 border-black">
                    <h4 className="font-bold text-black mb-2">2. Generowanie liter</h4>
                    <p className="text-sm text-gray-700">
                      2 losowe litery z alfabetu bez O i Q: <code className="bg-gray-100 border border-black px-1 font-mono">ABCDEFGHIJKLMNPRSTUVWXYZ</code>
                    </p>
                  </div>
                  
                  <div className="bg-white p-3 border-2 border-black">
                    <h4 className="font-bold text-black mb-2">3. Generowanie cyfr</h4>
                    <p className="text-sm text-gray-700">
                      4 losowe cyfry (1000-9999)
                    </p>
                  </div>
                  
                  <div className="bg-white p-3 border-2 border-black">
                    <h4 className="font-bold text-black mb-2">4. Obliczanie cyfry kontrolnej</h4>
                    <p className="text-sm text-gray-700">
                      Wagi: <code className="bg-gray-100 border border-black px-1 font-mono">[7, 3, 1, 7, 3, 1, 7, 3]</code>
                    </p>
                    <p className="text-sm text-gray-700">
                      Suma z pierwszych 8 znaków modulo 10
                    </p>
                  </div>
                  
                  <div className="bg-white p-3 border-2 border-black">
                    <h4 className="font-bold text-black mb-2">5. Wstawienie cyfry kontrolnej</h4>
                    <p className="text-sm text-gray-700">
                      Cyfra kontrolna wstawiana na pozycję 4 (po MA + 2 litery)
                    </p>
                  </div>
                </div>
              </div>

              {/* Example */}
              <div>
                <h3 className="text-lg font-bold mb-3 text-black">📝 Przykład: MAAAB1234</h3>
                <div className="bg-black text-white p-4 border-2 border-black text-sm font-mono overflow-x-auto">
                  <pre>{`MAAAB1234

M(22) × 7 = 154
A(10) × 3 = 30
A(10) × 1 = 10
A(10) × 7 = 70
B(11) × 3 = 33
1(1) × 1 = 1
2(2) × 7 = 14
3(3) × 3 = 9

Suma: 321
Cyfra kontrolna: 321 % 10 = 1
Finalny numer: MAAAB12341`}</pre>
                </div>
              </div>

              {/* Character Values */}
              <div>
                <h3 className="text-lg font-bold mb-3 text-black">📊 Wartości znaków:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-2 border-2 border-black">
                    <strong>Cyfry:</strong><br/>
                    0=0, 1=1, 2=2, 3=3, 4=4<br/>
                    5=5, 6=6, 7=7, 8=8, 9=9
                  </div>
                  <div className="bg-white p-2 border-2 border-black">
                    <strong>Litery A-M:</strong><br/>
                    A=10, B=11, C=12, D=13<br/>
                    E=15, F=16, G=17, H=18<br/>
                    I=19, J=20, K=21, L=22<br/>
                    M=23
                  </div>
                  <div className="bg-white p-2 border-2 border-black">
                    <strong>Litery N-Z:</strong><br/>
                    N=24, P=26, R=27, S=28<br/>
                    T=29, U=30, V=31, W=32<br/>
                    X=33, Y=34, Z=35
                  </div>
                </div>
              </div>

              {/* Official Source */}
              <div className="bg-blue-50 p-4 border-2 border-blue-300">
                <h3 className="text-lg font-bold mb-2 text-black">ℹ️ Źródło:</h3>
                <p className="text-sm text-gray-700">
                  Algorytm zgodny z walidatorem <a href="https://romek.info/ut/js-pesel.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">romek.info</a>.
                  Używany w systemie mObywatel dla generowania numerów dowodów osobistych.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ID Number Algorithm Modal */}
      {showIDNumberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-black max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b-2 border-black">
              <h2 className="text-2xl font-black text-black">🆔 Algorytm Numeru Dowodu Osobistego</h2>
              <button
                onClick={() => setShowIDNumberModal(false)}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Introduction */}
              <div className="bg-gray-50 p-4 border-2 border-black">
                <h3 className="text-lg font-bold mb-2 text-black">📋 Struktura numeru dowodu osobistego:</h3>
                <p className="text-sm text-gray-700 mb-2">
                  <code className="bg-white border border-black px-1 font-mono">3_LITERY + CYFRA_KONTROLNA + 5_CYFR</code>
                </p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>3_LITERY</strong> - trzy losowe litery (pełny alfabet z O i Q)</li>
                  <li>• <strong>CYFRA_KONTROLNA</strong> - obliczana cyfra kontrolna</li>
                  <li>• <strong>5_CYFR</strong> - pięciocyfrowy numer identyfikacyjny</li>
                </ul>
              </div>

              {/* Algorithm Steps */}
              <div>
                <h3 className="text-lg font-bold mb-3 text-black">🔢 Kroki generowania:</h3>
                <div className="space-y-4">
                  <div className="bg-white p-3 border-2 border-black">
                    <h4 className="font-bold text-black mb-2">1. Generowanie liter</h4>
                    <p className="text-sm text-gray-700">
                      3 losowe litery z pełnego alfabetu: <code className="bg-gray-100 border border-black px-1 font-mono">ABCDEFGHIJKLMNOPQRSTUVWXYZ</code>
                    </p>
                  </div>
                  
                  <div className="bg-white p-3 border-2 border-black">
                    <h4 className="font-bold text-black mb-2">2. Generowanie numeru</h4>
                    <p className="text-sm text-gray-700">
                      5 losowych cyfr (10000-99999)
                    </p>
                  </div>
                  
                  <div className="bg-white p-3 border-2 border-black">
                    <h4 className="font-bold text-black mb-2">3. Obliczanie cyfry kontrolnej</h4>
                    <p className="text-sm text-gray-700">
                      Wagi: <code className="bg-gray-100 border border-black px-1 font-mono">[7, 3, 1, 7, 3, 1, 7, 3]</code>
                    </p>
                    <p className="text-sm text-gray-700">
                      Suma z 8 znaków (3 litery + 5 cyfr) modulo 10
                    </p>
                  </div>
                  
                  <div className="bg-white p-3 border-2 border-black">
                    <h4 className="font-bold text-black mb-2">4. Wstawienie cyfry kontrolnej</h4>
                    <p className="text-sm text-gray-700">
                      Cyfra kontrolna wstawiana na pozycję 3 (po 3 literach)
                    </p>
                  </div>
                </div>
              </div>

              {/* Example */}
              <div>
                <h3 className="text-lg font-bold mb-3 text-black">📝 Przykład: ABC12345</h3>
                <div className="bg-black text-white p-4 border-2 border-black text-sm font-mono overflow-x-auto">
                  <pre>{`ABC12345

A(10) × 7 = 70
B(11) × 3 = 33
C(12) × 1 = 12
1(1) × 7 = 7
2(2) × 3 = 6
3(3) × 1 = 3
4(4) × 7 = 28
5(5) × 3 = 15

Suma: 174
Cyfra kontrolna: 174 % 10 = 4
Finalny numer: ABC412345`}</pre>
                </div>
              </div>

              {/* Character Values */}
              <div>
                <h3 className="text-lg font-bold mb-3 text-black">📊 Wartości znaków:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-2 border-2 border-black">
                    <strong>Cyfry:</strong><br/>
                    0=0, 1=1, 2=2, 3=3, 4=4<br/>
                    5=5, 6=6, 7=7, 8=8, 9=9
                  </div>
                  <div className="bg-white p-2 border-2 border-black">
                    <strong>Litery A-M:</strong><br/>
                    A=10, B=11, C=12, D=13<br/>
                    E=14, F=15, G=16, H=17<br/>
                    I=18, J=19, K=20, L=21<br/>
                    M=22
                  </div>
                  <div className="bg-white p-2 border-2 border-black">
                    <strong>Litery N-Z:</strong><br/>
                    N=23, O=24, P=25, Q=26<br/>
                    R=27, S=28, T=29, U=30<br/>
                    V=31, W=32, X=33, Y=34, Z=35
                  </div>
                </div>
              </div>

              {/* Official Source */}
              <div className="bg-green-50 p-4 border-2 border-green-300">
                <h3 className="text-lg font-bold mb-2 text-black">ℹ️ Źródło walidatora:</h3>
                <p className="text-sm text-gray-700">
                  Algorytm zgodny z walidatorem <a href="https://testerzy.pl/baza-wiedzy/narzedzia-online/walidatory" target="_blank" rel="noopener noreferrer" className="text-green-600 underline">testerzy.pl</a>.
                  Format: 3 litery + cyfra kontrolna + 5 cyfr. Wartości liter: A=10, B=11, ..., Z=35.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Footer */}
      <footer className="bg-white border-t-2 border-black mt-8">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <span className="text-gray-700 text-sm">Stworzone przez:</span>
            <a
              href="https://github.com/Grandpa1001"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-colors"
            >
              <Github size={16} />
              <span>Grandpa1001</span>
            </a>
            <a
              href="https://mgrgracz.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-colors"
            >
              <img 
                src="/WasiHead.png" 
                alt="Wasi" 
                className="w-4 h-4 object-contain"
              />
              <span>Website</span>
            </a>
          </div>
          <p className="text-center text-gray-500 mt-2 text-xs">
            Dane generowane losowo dla celów testowych
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;