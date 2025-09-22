# Generator Danych Testowych 🇵🇱

**Bezpłatny generator polskich danych testowych** - PESEL, REGON, NIP, dowód osobisty (ABC012345), mDowód, paszport, księga wieczysta, NRB, IBAN, SWIFT, GUID. Idealny do testów automatycznych z Selenium, Playwright, Cypress.

🌐 **Live Demo:** https://dane-testowe.netlify.app/

## 🚀 Funkcje

### 📊 Generowane dane:
- **PESEL** - z walidacją płci (K/M) i prawidłową cyfrą kontrolną
- **Data urodzenia** - automatycznie wyciągana z PESEL z możliwością modyfikacji
- **REGON** - 9 i 14 cyfr z oficjalnym algorytmem walidacji  
- **NIP** - z cyfrą kontrolną zgodną z polskim standardem
- **Numer dowodu osobistego** - format ABC012345 (3 litery + cyfra kontrolna + 5 cyfr)
- **mDowód** - format MAXXYYYY dla systemu mObywatel
- **Numer paszportu** - z walidacją cyfry kontrolnej
- **Księga wieczysta** - z oficjalnymi kodami sądów
- **NRB** - polski numer rachunku bankowego (26 cyfr, prawdziwe kody banków)
- **IBAN** - międzynarodowy numer IBAN z wyborem kraju (PL/DE/FR/GB)
- **SWIFT** - kod SWIFT banku
- **GUID/UUID v4** - unikalne identyfikatory
- **Polskie imiona i nazwiska** - realistyczne dane

### 🔧 Funkcje automatyzacji:
- **Unikalne ID pól** - każdy element ma identyfikator (np. `input-pesel`, `input-regon`, `input-birthDate`)
- **Automatyczne kopiowanie** - kliknij na pole aby skopiować do schowka
- **Przyciski odświeżania** - dla każdego pola osobno
- **Pole daty urodzenia** - z kalendarzem HTML5 i checkboxem "Modyfikowana"
- **Synchronizacja PESEL ↔ Data** - automatyczne pobieranie daty z PESEL
- **Dropdown wyboru kraju** - dla IBAN (PL/DE/FR/GB)
- **Instrukcje dla testerów** - Selenium, Playwright, Cypress
- **Responsywny design** - działa na wszystkich urządzeniach

## 🛠️ Technologie

- **React 18** z TypeScript
- **Vite** jako bundler
- **Tailwind CSS** do stylowania
- **Lucide React** do ikon

## 📦 Instalacja

1. Sklonuj repozytorium:
```bash
git clone https://github.com/Grandpa1001/Dane-testowe.git
cd Dane-testowe
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Uruchom aplikację:
```bash
npm run dev
```

4. Otwórz [http://localhost:5173](http://localhost:5173) w przeglądarce (lokalny development)

**🌐 Produkcja:** [https://dane-testowe.netlify.app/](https://dane-testowe.netlify.app/)

## 📝 Użycie

### 🌐 Interfejs webowy:
- **Generowanie danych**: Aplikacja automatycznie generuje wszystkie dane przy uruchomieniu
- **Kopiowanie**: Kliknij na dowolne pole aby skopiować wartość do schowka
- **Odświeżanie**: Użyj przycisku ↻ obok pola aby wygenerować nową wartość
- **Odświeżanie wszystkich**: Użyj przycisku "Odśwież wszystkie dane" na dole strony

### 📅 Pole "Data urodzenia" - nowa funkcjonalność:

#### **Tryb automatyczny (domyślny):**
- ✅ **Pole nieedytowalne** - data jest automatycznie pobierana z PESEL
- ✅ **Synchronizacja** - przy odświeżaniu PESEL data aktualizuje się automatycznie
- ✅ **Format wyświetlania** - DD-MM-YYYY (pod polem)

#### **Tryb modyfikowany:**
- ✅ **Checkbox "Modyfikowana"** - odblokowuje edycję pola daty
- ✅ **Kalendarz HTML5** - wybór daty z ograniczeniem do przeszłości
- ✅ **Stała data** - przy odświeżaniu PESEL uwzględnia wybraną datę
- ✅ **Walidacja** - nie można wybrać daty z przyszłości

#### **Integracja z płcią:**
- **Kobieta** → PESEL z cyfrą płci parzystą (0,2,4,6,8)
- **Mężczyzna** → PESEL z cyfrą płci nieparzystą (1,3,5,7,9)
- **K/M** → PESEL z losową cyfrą płci (0-9)

### 🤖 Automatyzacja testów:

#### Selenium (Python):
```python
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("https://dane-testowe.netlify.app/")

# Pobierz PESEL
pesel = driver.find_element(By.ID, "input-pesel").get_attribute("value")
print(f"PESEL: {pesel}")

# Pobierz datę urodzenia
birth_date = driver.find_element(By.ID, "input-birthDate").get_attribute("value")
print(f"Data urodzenia: {birth_date}")

# Pobierz wszystkie dane
fields = ["firstName", "lastName", "pesel", "birthDate", "regon", "nip"]
for field in fields:
    element = driver.find_element(By.ID, f"input-{field}")
    print(f"{field}: {element.get_attribute('value')}")

# Obsługa checkboxa "Modyfikowana"
modified_checkbox = driver.find_element(By.ID, "birthDate-modified-checkbox")
if not modified_checkbox.is_selected():
    modified_checkbox.click()  # Odblokuj edycję daty
```

#### Playwright (JavaScript):
```javascript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://dane-testowe.netlify.app/');
  
const peselValue = await page.inputValue('#input-pesel');
console.log('PESEL:', peselValue);

const birthDateValue = await page.inputValue('#input-birthDate');
console.log('Data urodzenia:', birthDateValue);

// Obsługa checkboxa "Modyfikowana"
const isModified = await page.isChecked('#birthDate-modified-checkbox');
if (!isModified) {
  await page.check('#birthDate-modified-checkbox'); // Odblokuj edycję daty
}

await browser.close();
})();
```

#### Cypress:
```javascript
describe('Generator Danych Testowych', () => {
  it('should generate valid PESEL', () => {
    cy.visit('https://dane-testowe.netlify.app/');
    cy.get('#input-pesel').should('have.value').and('match', /^\d{11}$/);
  });

  it('should have birth date field', () => {
    cy.visit('https://dane-testowe.netlify.app/');
    cy.get('#input-birthDate').should('be.visible');
    cy.get('#birthDate-modified-checkbox').should('be.visible');
  });

  it('should allow modifying birth date', () => {
    cy.visit('https://dane-testowe.netlify.app/');
    cy.get('#birthDate-modified-checkbox').check();
    cy.get('#input-birthDate').should('not.be.disabled');
  });
});
```

## ✅ Zaimplementowane algorytmy

Wszystkie algorytmy zostały zaimplementowane zgodnie z oficjalnymi specyfikacjami:

- **PESEL** - z uwzględnieniem płci i wieku (cyfra płci na pozycji 10)
- **Data urodzenia** - automatyczne wyciąganie z PESEL z możliwością modyfikacji
- **REGON** - obsługa formatów 9 i 14 cyfr z cyframi regionu
- **NIP** - z poprawną cyfrą kontrolną (pierwsze 3 cyfry nie mogą być zerami)
- **Numer dowodu osobistego** - z prefiksami A, C, D i cyfrą kontrolną
- **mDowód** - format MA + 2 litery + 4 cyfry + cyfra kontrolna
- **Numer paszportu** - prefiksy A/E + cyfra kontrolna
- **Księga wieczysta** - z kodami sądów i cyfrą kontrolną
- **GUID** - UUID v4 zgodny ze standardem

## 📋 TODO

Planowane funkcje do dodania:

- **Adres e-dokumentów** - generowanie adresów elektronicznych dokumentów
- **VIN** - generowanie numerów identyfikacyjnych pojazdów
- **Numer rejestracyjny** - generowanie numerów rejestracyjnych pojazdów

## ⚠️ Uwaga

Wszystkie generowane dane są **losowe i służą wyłącznie celom testowym**. Nie odpowiadają one rzeczywistym danym osób fizycznych lub prawnych.

## 📄 Licencja

Ten projekt jest dostępny na licencji MIT. Zobacz plik `LICENSE` dla szczegółów.

## 🏷️ Tagi i słowa kluczowe

`generator danych testowych` `PESEL generator` `data urodzenia generator` `REGON generator` `NIP generator` `dowód osobisty generator` `mDowód generator` `paszport generator` `księga wieczysta generator` `NRB generator` `IBAN generator` `SWIFT generator` `GUID generator` `dane testowe` `testy automatyczne` `selenium` `playwright` `cypress` `automatyzacja testów` `polskie dane testowe` `fake data generator` `test data` `QA testing tools` `react` `typescript` `vite` `tailwind css` `polski generator` `dane testowe polska` `generator dokumentów` `walidacja danych` `cyfra kontrolna` `algorytm walidacji` `kalendarz HTML5` `synchronizacja PESEL`

## 🔗 Linki

- **🌐 Live Demo:** https://dane-testowe.netlify.app/
- **📖 Dokumentacja AI:** https://dane-testowe.netlify.app/llms.txt
- **🤖 GitHub:** https://github.com/Grandpa1001/Dane-testowe
- **👨‍💻 Autor:** https://github.com/Grandpa1001
- **🌍 Website:** https://mgrgracz.netlify.app/

## 👨‍💻 Autor

**Grandpa1001**
- GitHub: [@Grandpa1001](https://github.com/Grandpa1001)
- Website: [mgrgracz.netlify.app](https://mgrgracz.netlify.app/)

---

⭐ Jeśli projekt Ci się podoba, zostaw gwiazdkę!

## 📊 Statystyki

![GitHub stars](https://img.shields.io/github/stars/Grandpa1001/Dane-testowe?style=social)
![GitHub forks](https://img.shields.io/github/forks/Grandpa1001/Dane-testowe?style=social)
![GitHub issues](https://img.shields.io/github/issues/Grandpa1001/Dane-testowe)
![GitHub license](https://img.shields.io/github/license/Grandpa1001/Dane-testowe)
