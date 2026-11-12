# PERIL perionica – sajt

Statički sajt (HTML/CSS/JS) za PERIL perionicu iz Novog Pazara, hostovan na GitHub Pages.

## Stranice
- `index.html` – početna (HERO sa CTA za pranje tepiha + ostale usluge)
- `pranje-tepiha.html` – kalkulator cene, cenovnik, forma za zakazivanje, FAQ
- `pranje-staklenih-povrsina.html`, `pranje-fasada.html`, `pranje-betonskih-povrsina.html`, `pranje-krovova.html` – opis, forma za upit (sa slikom), FAQ
- `blog.html` – blog (teme u pripremi)


## Šta treba popuniti
- Broj telefona i broj za poruke: `063 195 1501` (`BROJ_ZA_PORUKE` u `assets/js/main.js`, a u HTML fajlovima `+381631951501`).
- Forme ne koriste server ni email: posle klika otvaraju WhatsApp ili SMS kod kupca sa već napisanom porukom na broj firme.
- Cene tepiha: `assets/js/main.js` (`CENA_OSNOVNA`, `CENA_PREUZIMANJE`) i tekst na `pranje-tepiha.html` / `index.html`.
