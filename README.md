# Unicorn Invite

Interaktywne, cyfrowe zaproszenie z animowaną kopertą, bajkowym tłem i personalizowanymi grafikami zaproszeń.

## Funkcje

- animowana koperta otwierana kliknięciem,
- responsywny układ na telefonach i komputerach,
- personalizowane zaproszenia przez parametr `?guest=...`,
- lista dozwolonych gości w `guests.js`,
- gotowe do publikacji na GitHub Pages.

## Struktura projektu

```text
index.html
404.html
README.md
guests.js
css/
js/
assets/
zaproszenia/
```

## Dodawanie zaproszenia

1. Dodaj plik PNG do folderu `zaproszenia/`, np.:

```text
zaproszenia/kacper.png
```

2. Dopisz identyfikator do `guests.js`:

```js
window.GUESTS = [
  "demo",
  "kacper"
];
```

3. Link do zaproszenia będzie wyglądał tak:

```text
https://twoj-login.github.io/nazwa-repo/?guest=kacper
```

Jeżeli identyfikatora nie ma w `guests.js`, strona przekieruje na `404.html`.

## Publikacja na GitHub Pages

W repozytorium wejdź w **Settings → Pages**, ustaw:

- Source: `Deploy from a branch`,
- Branch: `main`,
- Folder: `/ (root)`.

Po zapisaniu GitHub udostępni stronę pod adresem Pages.
