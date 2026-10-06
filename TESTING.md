# 🧪 Dokumentacja Automatyzacji Testów

Ten dokument opisuje jak używać narzędzi automatyzacji testów (Selenium, Playwright, Cypress) z aplikacją Generator Danych.

## 🎯 Dostępne Selektory

### Input Fields (Pola tekstowe)
Każde pole ma unikalne identyfikatory:

| Pole | ID | data-testid | data-field-type |
|------|----|--------------|----------------|
| Imię | `input-firstName` | `input-firstName` | `firstName` |
| Nazwisko | `input-lastName` | `input-lastName` | `lastName` |
| PESEL | `input-pesel` | `input-pesel` | `pesel` |
| REGON | `input-regon` | `input-regon` | `regon` |
| NRB | `input-nrb` | `input-nrb` | `nrb` |
| Numer dowodu | `input-idNumber` | `input-idNumber` | `idNumber` |
| Numer paszportu | `input-passportNumber` | `input-passportNumber` | `passportNumber` |
| Księga wieczysta | `input-landRegisterNumber` | `input-landRegisterNumber` | `landRegisterNumber` |
| SWIFT | `input-swift` | `input-swift` | `swift` |
| IBAN | `input-iban` | `input-iban` | `iban` |

### Buttons (Przyciski)
| Akcja | ID | data-testid | data-action |
|-------|----|--------------|-------------|
| Odśwież pole | `refresh-{fieldKey}` | `refresh-{fieldKey}` | `refresh-field` |
| Odśwież wszystkie | `refresh-all-button` | `refresh-all-button` | `refresh-all` |

### Containers (Kontenery)
| Element | ID | data-testid |
|---------|----|--------------|
| Główny kontener | `app-container` | `app-container` |
| Kontener pól | `fields-container` | `fields-container` |
| Kontener pola | `field-container-{fieldKey}` | `field-container-{fieldKey}` |
| Toast notification | `toast-notification` | `toast-notification` |

## 🐍 Przykłady Selenium (Python)

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Inicjalizacja drivera
driver = webdriver.Chrome()
driver.get("https://dane-testowe.com/")

# Oczekiwanie na załadowanie aplikacji
wait = WebDriverWait(driver, 10)
wait.until(EC.presence_of_element_located((By.ID, "app-container")))

# Pobieranie wartości z pola PESEL
pesel_input = driver.find_element(By.ID, "input-pesel")
pesel_value = pesel_input.get_attribute("value")
print(f"PESEL: {pesel_value}")

# Pobieranie wszystkich wartości
fields = ["firstName", "lastName", "pesel", "regon", "nrb", "idNumber", 
          "passportNumber", "landRegisterNumber", "swift", "iban"]

data = {}
for field in fields:
    input_element = driver.find_element(By.ID, f"input-{field}")
    data[field] = input_element.get_attribute("value")

print("Wszystkie dane:", data)

# Odświeżenie konkretnego pola
refresh_button = driver.find_element(By.ID, "refresh-pesel")
refresh_button.click()

# Odświeżenie wszystkich danych
refresh_all_button = driver.find_element(By.ID, "refresh-all-button")
refresh_all_button.click()

driver.quit()
```

## 🎭 Przykłady Playwright (JavaScript)

```javascript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://dane-testowe.com/');
  
  // Oczekiwanie na załadowanie aplikacji
  await page.waitForSelector('#app-container');
  
  // Pobieranie wartości z pola PESEL
  const peselValue = await page.inputValue('#input-pesel');
  console.log('PESEL:', peselValue);
  
  // Pobieranie wszystkich wartości
  const fields = ['firstName', 'lastName', 'pesel', 'regon', 'nrb', 'idNumber', 
                  'passportNumber', 'landRegisterNumber', 'swift', 'iban'];
  
  const data = {};
  for (const field of fields) {
    data[field] = await page.inputValue(`#input-${field}`);
  }
  
  console.log('Wszystkie dane:', data);
  
  // Odświeżenie konkretnego pola
  await page.click('#refresh-pesel');
  
  // Odświeżenie wszystkich danych
  await page.click('#refresh-all-button');
  
  await browser.close();
})();
```

## 🌲 Przykłady Cypress

```javascript
describe('Generator Danych', () => {
  beforeEach(() => {
    cy.visit('https://dane-testowe.com/');
  });

  it('powinien wyświetlać wszystkie pola', () => {
    cy.get('[data-testid="app-container"]').should('be.visible');
    cy.get('[data-testid="fields-container"]').should('be.visible');
  });

  it('powinien generować dane dla wszystkich pól', () => {
    const fields = ['firstName', 'lastName', 'pesel', 'regon', 'nrb', 'idNumber', 
                    'passportNumber', 'landRegisterNumber', 'swift', 'iban'];
    
    fields.forEach(field => {
      cy.get(`[data-testid="input-${field}"]`).should('not.be.empty');
    });
  });

  it('powinien odświeżać pojedyncze pole', () => {
    cy.get('[data-testid="input-pesel"]').then($input => {
      const initialValue = $input.val();
      
      cy.get('[data-testid="refresh-pesel"]').click();
      
      cy.get('[data-testid="input-pesel"]').should($newInput => {
        expect($newInput.val()).to.not.equal(initialValue);
      });
    });
  });

  it('powinien odświeżać wszystkie dane', () => {
    cy.get('[data-testid="refresh-all-button"]').click();
    
    // Sprawdzenie czy toast się pojawił
    cy.get('[data-testid="toast-notification"]').should('be.visible');
  });
});
```

## 🔍 Selekcja przez Atrybuty Data

Możesz również używać atrybutów `data-*` do bardziej semantycznej selekcji:

```python
# Selenium - selekcja przez data-field-type
pesel_input = driver.find_element(By.CSS_SELECTOR, '[data-field-type="pesel"]')

# Selekcja wszystkich pól przez data-testid
all_inputs = driver.find_elements(By.CSS_SELECTOR, '[data-testid^="input-"]')

# Selekcja przycisków odświeżania
refresh_buttons = driver.find_elements(By.CSS_SELECTOR, '[data-action="refresh-field"]')
```

## 📊 API do Pobierania Danych

Możesz również stworzyć prosty API endpoint do pobierania danych:

```javascript
// Przykład funkcji do pobierania danych przez JavaScript
function getAllTestData() {
  const fields = ['firstName', 'lastName', 'pesel', 'regon', 'nrb', 'idNumber', 
                  'passportNumber', 'landRegisterNumber', 'swift', 'iban'];
  
  const data = {};
  fields.forEach(field => {
    const element = document.getElementById(`input-${field}`);
    if (element) {
      data[field] = element.value;
    }
  });
  
  return data;
}

// Użycie w konsoli przeglądarki
console.log(getAllTestData());
```

## 🚀 Uruchamianie Testów

1. **Produkcja:** Aplikacja dostępna na `https://dane-testowe.com/`
2. **Development:** Uruchom serwer deweloperski: `npm run dev` (localhost:5173)
3. Uruchom swoje testy automatyzacji
4. Dane będą automatycznie generowane przy każdym odświeżeniu strony

## 💡 Wskazówki

- **Unikalne wartości**: Każde odświeżenie generuje nowe, unikalne dane
- **Kopiowanie**: Kliknięcie na pole automatycznie kopiuje wartość do schowka
- **Responsywność**: Aplikacja działa na wszystkich rozmiarach ekranu
- **Toast notifications**: Po skopiowaniu pojawia się powiadomienie
- **Semantyczne selektory**: Używaj `data-testid` dla stabilnych testów

## 🔧 Debugowanie

Jeśli masz problemy z selektorami, możesz sprawdzić strukturę DOM:

```javascript
// W konsoli przeglądarki
console.log(document.querySelectorAll('[data-testid]'));
console.log(document.querySelectorAll('[data-field-type]'));
```
