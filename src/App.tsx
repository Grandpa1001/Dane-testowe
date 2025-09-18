import { useState, useEffect } from 'react';
import { RefreshCw, Copy, Github, X, Settings, Info } from 'lucide-react';

interface TestData {
  firstName: string;
  lastName: string;
  pesel: string;
  regon: string;
  nrb: string;
  idNumber: string;
  passportNumber: string;
  landRegisterNumber: string;
  swift: string;
  iban: string;
}

function App() {
  const [data, setData] = useState<TestData>({
    firstName: '',
    lastName: '',
    pesel: '',
    regon: '',
    nrb: '',
    idNumber: '',
    passportNumber: '',
    landRegisterNumber: '',
    swift: '',
    iban: ''
  });
  
  const [copiedField, setCopiedField] = useState<string>('');
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'python' | 'javascript'>('python');
  const [showLandRegisterModal, setShowLandRegisterModal] = useState<boolean>(false);

  // Polskie imiona i nazwiska
  const firstNames = [
    'Anna', 'Piotr', 'Katarzyna', 'Tomasz', 'Agnieszka', 'Krzysztof', 'Barbara', 'Andrzej',
    'Ewa', 'Jan', 'Aleksandra', 'Michał', 'Joanna', 'Paweł', 'Magdalena', 'Marcin',
    'Monika', 'Łukasz', 'Teresa', 'Grzegorz', 'Maria', 'Adam', 'Justyna', 'Robert'
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

  // Generowanie PESEL
  const generatePESEL = (): string => {
    const year = randomInt(1950, 2005);
    const month = randomInt(1, 12);
    const day = randomInt(1, 28);
    const sex = randomInt(0, 1);
    
    let yearStr = year.toString().substring(2);
    let monthStr = month.toString().padStart(2, '0');
    
    if (year >= 2000) {
      monthStr = (month + 20).toString();
    }
    
    const dayStr = day.toString().padStart(2, '0');
    const serialNum = randomInt(100, 999).toString();
    const sexDigit = sex.toString();
    
    const peselBase = yearStr + monthStr + dayStr + serialNum + sexDigit;
    
    // Obliczanie cyfry kontrolnej
    const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    let sum = 0;
    
    for (let i = 0; i < 10; i++) {
      sum += parseInt(peselBase[i]) * weights[i];
    }
    
    const controlDigit = (10 - (sum % 10)) % 10;
    
    return peselBase + controlDigit.toString();
  };

  // Generowanie REGON
  const generateREGON = (): string => {
    const regonBase = randomInt(100000000, 999999999).toString();
    const weights = [8, 9, 2, 3, 4, 5, 6, 7];
    let sum = 0;
    
    for (let i = 0; i < 8; i++) {
      sum += parseInt(regonBase[i]) * weights[i];
    }
    
    const controlDigit = sum % 11;
    return regonBase + (controlDigit === 10 ? '0' : controlDigit.toString());
  };

  // Generowanie NRB
  const generateNRB = (): string => {
    const bankCode = randomInt(1000, 9999).toString();
    const accountNumber = randomInt(10000000, 99999999).toString() + 
                         randomInt(10000000, 99999999).toString();
    
    // Uproszczone generowanie - w rzeczywistości wymaga bardziej złożonych obliczeń
    const checkDigits = randomInt(10, 99).toString();
    
    return checkDigits + bankCode + '0000' + accountNumber;
  };

  // Generowanie numeru dowodu
  const generateIDNumber = (): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letter1 = letters[randomInt(0, 25)];
    const letter2 = letters[randomInt(0, 25)];
    const letter3 = letters[randomInt(0, 25)];
    
    // Generuj 5 losowych cyfr (bez pierwszej cyfry kontrolnej)
    const randomNumbers = randomInt(10000, 99999).toString();
    
    // Oblicz cyfrę kontrolną na podstawie liter i pozostałych cyfr
    const controlDigit = calculateIDControlDigit(letter1 + letter2 + letter3 + randomNumbers);
    
    return letter1 + letter2 + letter3 + controlDigit + randomNumbers;
  };

  // Funkcja obliczająca cyfrę kontrolną dla numeru dowodu osobistego
  const calculateIDControlDigit = (idString: string): string => {
    // Wagi dla kolejnych znaków: 7, 3, 1, 7, 3, 1, 7, 3
    const weights = [7, 3, 1, 7, 3, 1, 7, 3];
    
    let sum = 0;
    
    for (let i = 0; i < 8; i++) {
      const char = idString[i];
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

  // Generowanie numeru paszportu
  const generatePassportNumber = (): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letter1 = letters[randomInt(0, 25)];
    const letter2 = letters[randomInt(0, 25)];
    const numbers = randomInt(1000000, 9999999).toString();
    
    return letter1 + letter2 + numbers;
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

  // Generowanie IBAN
  const generateIBAN = (): string => {
    const nrb = generateNRB();
    return 'PL' + randomInt(10, 99).toString() + nrb;
  };

  // Generowanie wszystkich danych
  const generateAllData = (): TestData => {
    return {
      firstName: firstNames[randomInt(0, firstNames.length - 1)],
      lastName: lastNames[randomInt(0, lastNames.length - 1)],
      pesel: generatePESEL(),
      regon: generateREGON(),
      nrb: generateNRB(),
      idNumber: generateIDNumber(),
      passportNumber: generatePassportNumber(),
      landRegisterNumber: generateLandRegisterNumber(),
      swift: generateSWIFT(),
      iban: generateIBAN()
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

  // Kopiowanie kodu
  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      alert("Kod skopiowany do schowka!");
    } catch (err) {
      console.error('Nie można skopiować kodu:', err);
    }
  };

  // Odświeżanie pojedynczego pola
  const refreshField = (fieldName: keyof TestData) => {
    const newData = generateAllData();
    setData(prevData => ({
      ...prevData,
      [fieldName]: newData[fieldName]
    }));
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
    { key: 'nrb' as keyof TestData, label: 'NRB' },
    { key: 'idNumber' as keyof TestData, label: 'Numer dowodu' },
    { key: 'passportNumber' as keyof TestData, label: 'Numer paszportu' },
    { key: 'landRegisterNumber' as keyof TestData, label: 'Księga wieczysta' },
    { key: 'swift' as keyof TestData, label: 'SWIFT' },
    { key: 'iban' as keyof TestData, label: 'IBAN' }
  ];

  return (
    <div id="app-container" data-testid="app-container" className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b-2 border-black">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black text-black mb-2">
                Generator Danych
              </h1>
              <p className="text-gray-600 text-sm">
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
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div id="fields-container" data-testid="fields-container" className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {fields.map((field) => (
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
                    <strong className="text-black">NRB:</strong> <code className="bg-gray-100 border border-black px-1 font-mono">input-nrb</code>
                  </div>
                  <div className="bg-white p-2 border-2 border-black">
                    <strong className="text-black">Dowód:</strong> <code className="bg-gray-100 border border-black px-1 font-mono">input-idNumber</code>
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
                    <strong className="text-black">IBAN:</strong> <code className="bg-gray-100 border border-black px-1 font-mono">input-iban</code>
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
driver.get("http://localhost:5173")

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
  
  await page.goto('http://localhost:5173');
  
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
driver.get("http://localhost:5173")

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
  
  await page.goto('http://localhost:5173');
  
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
                  <li>• Aplikacja musi być uruchomiona na <code className="bg-white border border-black px-1 font-mono">http://localhost:5173</code></li>
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