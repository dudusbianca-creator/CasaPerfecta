<<<<<<< HEAD
# Casa Perfectă — Site Agenție Imobiliară

Site web complet, responsive, pentru agenția imobiliară fictivă **Casa Perfectă**.
Realizat cu HTML5, CSS3, Bootstrap 5.3 și JavaScript vanilla (fără framework-uri,
fără build step — funcționează direct, fără npm/webpack/etc).

## 1. Ce conține arhiva

```
casa-perfecta/
├── index.html          → Pagina Acasă
├── listings.html        → Anunțuri Imobiliare (filtrare, sortare, paginare)
├── about.html            → Despre noi (echipă, istoric, counter animat)
├── gallery.html           → Galerie proprietăți (filtrare + lightbox)
├── evaluation.html         → Evaluare proprietate + calculator credit ipotecar
├── contact.html             → Contact (formular validat + hartă)
├── favicon.ico
├── README.md             ← acest fișier
├── css/
│   └── style.css          → toate stilurile custom (peste Bootstrap 5)
├── js/
│   ├── main.js              → navbar, smooth scroll, back-to-top, slider
│   │                            testimoniale, counter animat, galerie+lightbox
│   ├── validation.js          → validare formulare (contact + evaluare)
│   ├── listings.js             → filtrare/sortare/paginare anunțuri
│   └── calculator.js            → estimare valoare + calculator credit ipotecar
└── img/
    ├── logo.png
    ├── hero/                    → imagine hero pagina principală
    ├── properties/               → 12 fotografii anunțuri
    ├── gallery/                   → 12 fotografii galerie (4 categorii)
    └── team/                       → echipă + clienți testimoniale
```

Toate cele 6 pagini sunt complet funcționale chiar acum, cu imagini
**placeholder generate automat** (în nuanțe navy/auriu, cu textul "ce trebuie
să conțină" scris pe ele) — astfel încât să poți deschide site-ul imediat,
fără erori, fără linkuri rupte. Tot ce trebuie să faci este să înlocuiești
aceste imagini cu fotografii reale, păstrând **exact aceleași denumiri de fișier**.

## 2. Cum înlocuiești imaginile

Pur și simplu suprascrie fișierul din folderul corespunzător, cu exact
același nume (poți schimba conținutul, nu și numele/extensia .jpg/.png).

| Fișier | Ce trebuie să fie | Dimensiune recomandată |
|---|---|---|
| `img/logo.png` | Siglă agenție | 240×240px, fundal transparent |
| `img/hero/hero-home.jpg` | Casă modernă (hero index) | 1600×1000px |
| `img/properties/property-1.jpg` … `property-12.jpg` | Cele 12 anunțuri (vezi titlu+locație în `listings.html`) | 800×600px |
| `img/gallery/gallery-*.jpg` | 12 imagini galerie, 3 per categorie (apartamente/case/terenuri/comerciale) | 800×800px |
| `img/team/team-group.jpg` | Fotografie de grup echipă | 1200×900px |
| `img/team/team-1.jpg` … `team-4.jpg` | Foto individuale agenți (vezi nume în `about.html`) | 500×600px |
| `img/team/client-1.jpg` … `client-3.jpg` | Avatare clienți (testimoniale index.html) | 200×200px |

**Recomandare optimizare**: comprimă fiecare imagine la sub 200KB
(TinyPNG.com sau Squoosh.app) înainte de upload, conform cerinței de
performanță. Toate imaginile sunt deja referențiate cu `loading="lazy"`
și `width`/`height` explicite, pentru performanță optimă.

## 3. Cum publici site-ul online

Site-ul este 100% static (fără bază de date, fără server backend), deci poate
fi publicat gratuit pe oricare din următoarele:

- **Netlify** — mergi pe app.netlify.com → "Add new site" → "Deploy manually"
  → tragi folderul `casa-perfecta` direct în browser. Gata în 10 secunde.
- **Vercel** — similar, drag & drop sau `vercel deploy` din CLI.
- **GitHub Pages** — urci conținutul într-un repo GitHub → Settings → Pages →
  selectezi branch-ul `main`.
- **Hosting clasic (cPanel/FTP)** — încarci tot conținutul folderului direct
  în `public_html/`.

Nu este nevoie de nicio configurare suplimentară — toate linkurile sunt relative.

## 4. Tehnologii folosite (CDN, fără instalare)

- [Bootstrap 5.3.3](https://getbootstrap.com) — grid, formulare, offcanvas (meniu mobil)
- [Bootstrap Icons 1.11](https://icons.getbootstrap.com) — toate iconițele
- [Google Fonts](https://fonts.google.com) — Montserrat (titluri) + Poppins (text)
- JavaScript vanilla (ES5/ES6, fără dependențe) pentru toată interactivitatea

Acestea se încarcă automat din CDN când pagina e deschisă cu internet activ —
nu necesită nicio instalare locală.

## 5. Funcționalități JavaScript implementate

| Funcționalitate | Fișier | Pagină |
|---|---|---|
| Validare formular contact + evaluare | `validation.js` | contact.html, evaluation.html |
| Meniu responsive (offcanvas) | `main.js` | toate paginile |
| Slider testimoniale (auto-play + control manual) | `main.js` | index.html |
| Smooth scroll | `main.js` | toate paginile |
| Buton Back to Top | `main.js` | toate paginile |
| Filtrare anunțuri (tip, preț, localitate) | `listings.js` | listings.html |
| Sortare anunțuri (preț/suprafață) + paginare | `listings.js` | listings.html |
| Galerie cu filtrare pe categorii + lightbox | `main.js` | gallery.html |
| Calculator credit ipotecar (dinamic, live) | `calculator.js` | evaluation.html |
| Estimare valoare proprietate | `calculator.js` | evaluation.html |
| Counter animat | `main.js` | index.html, about.html |

## 6. Personalizare rapidă

- **Culori / fonturi**: toate sunt variabile CSS în primele linii din
  `css/style.css` (`:root { --navy-900: ...; --gold-500: ...; }`) — schimbi
  o singură valoare și se aplică automat pe tot site-ul.
- **Date de contact** (adresă, telefon, email, program): apar identic în
  footer-ul fiecărei pagini și în `contact.html` — caută după text și
  înlocuiește.
- **Harta** din `contact.html` folosește un embed Google Maps fără API key,
  centrat pe Chișinău. Pentru adresa reală a agenției, înlocuiește
  parametrul `q=` din linkul `iframe` cu adresa exactă.
- **Anunțuri/prețuri**: fiecare card din `listings.html` are atributele
  `data-type`, `data-price`, `data-area`, `data-rooms`, `data-location` —
  editează-le pe acestea ȘI textul vizibil din card când actualizezi un anunț,
  altfel filtrarea/sortarea va folosi datele vechi.

## 7. Testare efectuată

Site-ul a fost testat automat (headless Chromium) la 375px / 768px / 1440px,
inclusiv: validare formulare (câmpuri goale, telefon invalid), calculator
credit ipotecar (verificare matematică), estimare proprietate, filtrare +
sortare + paginare anunțuri, filtrare galerie + navigare lightbox (next/prev/
Escape), meniu mobil offcanvas. Toate paginile au fost validate pentru SEO
on-page (titlu unic ≤60 caractere, meta description ≤160 caractere, un
singur `<h1>` per pagină, atribute `alt` pe toate imaginile, fără linkuri
interne rupte).

---

Spor la lansare! 🏡
=======
# CasaPerfecta
>>>>>>> e25d051f79e8ed7bec8d27054a28aee4c037425a
