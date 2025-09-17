# Generator Danych Testowych

Aplikacja React do generowania polskich danych testowych takich jak PESEL, REGON, NRB, numery dowodów osobistych i inne.

## 🚀 Funkcje

- **Generowanie danych osobowych**: Imiona, nazwiska, PESEL, REGON
- **Dokumenty**: Numery dowodów osobistych, paszportów, księgi wieczystej
- **Finanse**: NRB, IBAN, SWIFT
- **Kopiowanie do schowka**: Kliknij na pole aby skopiować wartość
- **Odświeżanie**: Możliwość odświeżenia pojedynczego pola lub wszystkich danych
- **Responsywny design**: Działa na wszystkich urządzeniach

## 🛠️ Technologie

- **React 18** z TypeScript
- **Vite** jako bundler
- **Tailwind CSS** do stylowania
- **Lucide React** do ikon
- **ESLint** do lintowania

## 📦 Instalacja

1. Sklonuj repozytorium:
```bash
git clone https://github.com/MgrGracz/dane-testowe.git
cd dane-testowe
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Uruchom aplikację w trybie deweloperskim:
```bash
npm run dev
```

4. Otwórz [http://localhost:5173](http://localhost:5173) w przeglądarce

## 🏗️ Dostępne skrypty

- `npm run dev` - Uruchamia serwer deweloperski
- `npm run build` - Buduje aplikację do produkcji
- `npm run preview` - Podgląd zbudowanej aplikacji
- `npm run lint` - Sprawdza kod pod kątem błędów ESLint

## 📝 Użycie

1. **Generowanie danych**: Aplikacja automatycznie generuje wszystkie dane przy uruchomieniu
2. **Kopiowanie**: Kliknij na dowolne pole aby skopiować wartość do schowka
3. **Odświeżanie**: Użyj przycisku ↻ obok pola aby wygenerować nową wartość
4. **Odświeżanie wszystkich**: Użyj przycisku "Odśwież wszystkie dane" na dole strony

## 🤖 Automatyzacja Testów

Aplikacja jest przygotowana do automatyzacji testów z narzędziami takimi jak Selenium, Playwright czy Cypress.

### Dostępne identyfikatory:
- **Input fields**: `input-{fieldName}` (np. `input-pesel`, `input-firstName`)
- **Refresh buttons**: `refresh-{fieldName}` (np. `refresh-pesel`)
- **Refresh all**: `refresh-all-button`
- **Data attributes**: `data-testid`, `data-field-type`, `data-action`

### Przykład użycia Selenium:
```python
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("http://localhost:5173")

# Pobieranie wartości PESEL
pesel = driver.find_element(By.ID, "input-pesel").get_attribute("value")
print(f"PESEL: {pesel}")

# Odświeżenie pola
driver.find_element(By.ID, "refresh-pesel").click()
```

📖 **Szczegółowa dokumentacja**: Zobacz plik `TESTING.md` dla pełnych przykładów użycia z różnymi narzędziami automatyzacji.

## ⚠️ Uwaga

Wszystkie generowane dane są **losowe i służą wyłącznie celom testowym**. Nie odpowiadają one rzeczywistym danym osób fizycznych lub prawnych.

## 🤝 Wkład w projekt

Jeśli chcesz przyczynić się do rozwoju projektu:

1. Fork repozytorium
2. Stwórz branch dla swojej funkcji (`git checkout -b feature/AmazingFeature`)
3. Commit swoje zmiany (`git commit -m 'Add some AmazingFeature'`)
4. Push do brancha (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

## 📄 Licencja

Ten projekt jest dostępny na licencji MIT. Zobacz plik `LICENSE` dla szczegółów.

## 👨‍💻 Autor

**MgrGracz**
- GitHub: [@MgrGracz](https://github.com/MgrGracz)

---

⭐ Jeśli projekt Ci się podoba, zostaw gwiazdkę!
