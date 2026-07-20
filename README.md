# MSP Provjera — minski sumnjiva područja BiH

Web alat za provjeru blizine minski sumnjivih područja (MSP) u Bosni i Hercegovini.
Jedan HTML fajl sa svim podacima ugrađenim (7.974 poligona, ~818,5 km², 80 JOG listova),
serviran preko minimalnog Node servera bez ijedne dependency-je.

**Datum podataka: 2024-07-31 (snapshot). NIJE ZA NAVIGACIJU.**

## ⚠️ Upozorenje

Ovo je neslužbeni alat za ličnu orijentaciju i razvoj. Za bilo kakav stvarni
odlazak na teren u blizini ovih zona, jedini mjerodavni izvori su zvanična
aplikacija **BH Mine Suspected Areas** i **BHMAC**.

Hitni brojevi: **122** (policija) · **121** (CZ) · **BHMAC 033-253-800**

## Deploy na Railway

1. Pushaj ovaj repo na GitHub (već jeste, ako čitaš ovo tamo).
2. Na [railway.app](https://railway.app): **New Project → Deploy from GitHub repo** → izaberi ovaj repo.
3. Railway automatski detektuje Node (`package.json`) i pokrene `node server.js`.
4. U servisu otvori **Settings → Networking → Generate Domain** da dobiješ javni HTTPS URL.

To je sve — nema env varijabli, nema baze, nema builda. Server poštuje
Railwayev `PORT`, ima `/healthz` endpoint i servira `index.html` gzipovan
(2,2 MB → znatno manje preko žice).

**Bonus:** Railway domena je HTTPS, pa dugme „Provjeri moju lokaciju" (GPS)
radi — za razliku od otvaranja fajla direktno s diska.

## Lokalno pokretanje

```sh
node server.js          # http://localhost:3000
# ili bez Node-a:
python3 -m http.server  # http://localhost:8000/index.html
```

## Rute

| Ruta | Sadržaj |
|---|---|
| `/` | MSP Provjera — glavni alat |
| `/minesweeper` | MSP Minesweeper — edukativna igra: nasumični segment karte (~1,7 × 1,7 km) postaje minesweeper tabla, mine su tačno tamo gdje mreža presijeca stvarne MSP poligone |
| `/msp_data.json` | GeoJSON sa svih 7.974 poligona (koristi ga igrica) |
| `/healthz` | Healthcheck (`ok`) |

## Struktura

| Fajl | Uloga |
|---|---|
| `index.html` | Kompletan alat — karta, podaci, logika (2,2 MB) |
| `minesweeper.html` | Minesweeper igra (učitava `msp_data.json`) |
| `msp_data.json` | MSP poligoni ekstraktovani iz `index.html` |
| `server.js` | Statički server (Node stdlib, bez dependency-ja) |
| `package.json` | `npm start` → `node server.js`; Node ≥ 18 |
| `railway.json` | Start komanda, healthcheck, restart policy |

Vanjski zahtjevi u browseru: Leaflet 1.9.4 (cdnjs) i OpenStreetMap tile-ovi —
sve ostalo je ugrađeno u `index.html`.
