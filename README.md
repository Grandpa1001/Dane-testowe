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
- **Adres do E-doręczeń** - format AE:PL-XXXXX-XXXXX-XXXXX-XX z oficjalnym algorytmem
- **Polskie imiona i nazwiska** - realistyczne dane

### 🔧 Funkcje automatyzacji:
- **Unikalne ID pól** - każdy element ma identyfikator (np. `input-pesel`, `input-regon`, `input-birthDate`, `input-edoreczenie`)
- **Automatyczne kopiowanie** - kliknij na pole aby skopiować do schowka
- **Przyciski odświeżania** - dla każdego pola osobno
- **Pole daty urodzenia** - z kalendarzem HTML5 i checkboxem "Modyfikowana"
- **Synchronizacja PESEL ↔ Data** - automatyczne pobieranie daty z PESEL
- **Adres e-doręczeń** - z prefiksem AE:PL- i oficjalnym algorytmem walidacji
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

### 📧 Pole "Adres do E-doręczeń" - nowa funkcjonalność:

#### **Format adresu:**
- ✅ **Prefiks:** `AE:PL-` (zawsze na początku)
- ✅ **Struktura:** `AE:PL-XXXXX-XXXXX-XXXXX-XX`
- ✅ **Części:**
  - 2 × 5 cyfr losowych (00000-99999)
  - 5 losowych liter (A-Z)
  - 2-cyfrowa suma kontrolna (00-99)

#### **Algorytm walidacji:**
- ✅ **Suma ASCII** liter (część 4)
- ✅ **Suma liczbowa** dwóch części cyfrowych
- ✅ **Różnica bezwzględna** między sumami
- ✅ **Suma cyfr** wyniku jako suma kontrolna

#### **Przykład:**
```
AE:PL-12345-67890-ABCDE-12
```

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

# Pobierz adres e-doręczeń
edoreczenie = driver.find_element(By.ID, "input-edoreczenie").get_attribute("value")
print(f"E-doręczenia: {edoreczenie}")

# Pobierz wszystkie dane
fields = ["firstName", "lastName", "pesel", "birthDate", "regon", "nip", "edoreczenie"]
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

const edoreczenieValue = await page.inputValue('#input-edoreczenie');
console.log('E-doręczenia:', edoreczenieValue);

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

  it('should generate valid e-doręczenia address', () => {
    cy.visit('https://dane-testowe.netlify.app/');
    cy.get('#input-edoreczenie').should('be.visible');
    cy.get('#input-edoreczenie').should('have.value').and('match', /^AE:PL-\d{5}-\d{5}-[A-Z]{5}-\d{2}$/);
  });
});
```

## ✅ Zaimplementowane algorytmy

Wszystkie algorytmy zostały zaimplementowane zgodnie z oficjalnymi specyfikacjami:

- **PESEL** - z uwzględnieniem płci i wieku (cyfra płci na pozycji 10)
- **Data urodzenia** - automatyczne wyciąganie z PESEL z możliwością modyfikacji
- **Adres e-doręczeń** - format AE:PL-XXXXX-XXXXX-XXXXX-XX z oficjalnym algorytmem walidacji
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

## 🚀 Chcesz dodać nową funkcjonalność?

Masz pomysł na nowe pole lub funkcję? **Zgłoś to jako Issue!**

[![GitHub Issues](https://img.shields.io/github/issues/Grandpa1001/Dane-testowe?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Grandpa1001/Dane-testowe/issues)

### 💡 Co możesz zgłosić:

- **Nowe pola** - PESEL dla firm, numer KRS, adres e-dokumentów
- **Nowe funkcje** - eksport do CSV, walidacja danych, historia generowania
- **Ulepszenia UI** - nowe style, animacje, responsywność
- **Błędy** - nieprawidłowe algorytmy, problemy z interfejsem
- **Dokumentacja** - brakujące przykłady, niejasne opisy

### 🎯 Jak zgłosić:

1. **Kliknij** [![New Issue](https://img.shields.io/badge/New%20Issue-FF6B6B?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Grandpa1001/Dane-testowe/issues/new)
2. **Wybierz** odpowiedni szablon (Feature Request / Bug Report)
3. **Opisz** szczegółowo swoją propozycję
4. **Czekaj** na odpowiedź i implementację!

### 🏆 Najlepsze propozycje:

- **Pola biznesowe** - KRS, CEIDG, VAT
- **Dokumenty** - prawo jazdy, legitymacja studencka
- **Adresy** - e-dokumenty, e-faktury
- **Numery** - telefon, konto bankowe, karta płatnicza

**Każda propozycja jest mile widziana!** 🎉

## ⚠️ Uwaga

Wszystkie generowane dane są **losowe i służą wyłącznie celom testowym**. Nie odpowiadają one rzeczywistym danym osób fizycznych lub prawnych.

## 📄 Licencja

Ten projekt jest dostępny na licencji MIT. Zobacz plik `LICENSE` dla szczegółów.

## 🏷️ Tagi i słowa kluczowe

`generator danych testowych` `PESEL generator` `data urodzenia generator` `adres e-doręczeń generator` `REGON generator` `NIP generator` `dowód osobisty generator` `mDowód generator` `paszport generator` `księga wieczysta generator` `NRB generator` `IBAN generator` `SWIFT generator` `GUID generator` `dane testowe` `testy automatyczne` `selenium` `playwright` `cypress` `automatyzacja testów` `polskie dane testowe` `fake data generator` `test data` `QA testing tools` `react` `typescript` `vite` `tailwind css` `polski generator` `dane testowe polska` `generator dokumentów` `walidacja danych` `cyfra kontrolna` `algorytm walidacji` `kalendarz HTML5` `synchronizacja PESEL` `e-doręczenia` `adres elektroniczny`

## 🔗 Linki

- **🌐 Live Demo:** https://dane-testowe.netlify.app/
- **📖 Dokumentacja AI:** https://dane-testowe.netlify.app/llms.txt
- **🤖 GitHub:** https://github.com/Grandpa1001/Dane-testowe
- **🐛 Zgłoś błąd:** https://github.com/Grandpa1001/Dane-testowe/issues/new
- **💡 Nowa funkcja:** https://github.com/Grandpa1001/Dane-testowe/issues/new
- **👨‍💻 Autor:** https://github.com/Grandpa1001
- **🌍 Website:** https://kamil-bandzwolek.pl/

## 👨‍💻 Autor

**Grandpa1001**
- GitHub: [@Grandpa1001](https://github.com/Grandpa1001)
- Website: [kamil-bandzwolek.pl](https://kamil-bandzwolek.pl/)

---

⭐ **Jeśli projekt Ci się podoba, zostaw gwiazdkę!**

🐛 **Znalazłeś błąd?** [Zgłoś go tutaj](https://github.com/Grandpa1001/Dane-testowe/issues/new)

💡 **Masz pomysł na nową funkcję?** [Opisz go tutaj](https://github.com/Grandpa1001/Dane-testowe/issues/new)

🤝 **Chcesz pomóc w rozwoju?** Forkuj repo i stwórz Pull Request!

## 📊 Statystyki

![GitHub stars](https://img.shields.io/github/stars/Grandpa1001/Dane-testowe?style=social)
![GitHub forks](https://img.shields.io/github/forks/Grandpa1001/Dane-testowe?style=social)
![GitHub issues](https://img.shields.io/github/issues/Grandpa1001/Dane-testowe)
![GitHub license](https://img.shields.io/github/license/Grandpa1001/Dane-testowe)
