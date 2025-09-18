# Generator Danych Testowych

Aplikacja React do generowania polskich danych testowych takich jak PESEL, REGON, NRB, numery dowodów osobistych i inne.

## 🚀 Funkcje

- **Generowanie danych osobowych**: Imiona, nazwiska, PESEL, REGON, NIP
- **Dokumenty**: Numery dowodów osobistych, mDowód, paszportów, księgi wieczystej
- **Finanse**: NRB, IBAN, SWIFT
- **Inne**: GUID (UUID v4)
- **Przełącznik płci**: Automatyczne generowanie imion i PESEL zależne od płci
- **Kopiowanie do schowka**: Kliknij na pole aby skopiować wartość
- **Odświeżanie**: Możliwość odświeżenia pojedynczego pola lub wszystkich danych
- **Responsywny design**: Działa na wszystkich urządzeniach
- **Automatyzacja**: Wszystkie pola mają unikalne ID dla testów automatycznych

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

4. Otwórz [http://localhost:5173](http://localhost:5173) w przeglądarce

## 📝 Użycie

- **Generowanie danych**: Aplikacja automatycznie generuje wszystkie dane przy uruchomieniu
- **Kopiowanie**: Kliknij na dowolne pole aby skopiować wartość do schowka
- **Odświeżanie**: Użyj przycisku ↻ obok pola aby wygenerować nową wartość
- **Odświeżanie wszystkich**: Użyj przycisku "Odśwież wszystkie dane" na dole strony

## ✅ Zaimplementowane algorytmy

Wszystkie algorytmy zostały zaimplementowane zgodnie z oficjalnymi specyfikacjami:

- **PESEL** - z uwzględnieniem płci i wieku (cyfra płci na pozycji 10)
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

## 👨‍💻 Autor

**Grandpa1001**
- GitHub: [@Grandpa1001](https://github.com/Grandpa1001)

---

⭐ Jeśli projekt Ci się podoba, zostaw gwiazdkę!
