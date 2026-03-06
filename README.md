# Doomsday Clock — Time Circuits

A **Back to the Future**-style time circuits display built with plain HTML, CSS, and JavaScript.  
It recreates the iconic DeLorean dashboard panel with three rows:

- **DESTINATION TIME** — where you're going
- **PRESENT TIME** — where you are now (defaults to March 12, 2055)
- **LAST TIME DEPARTED** — where you came from

Each row renders LED-style digits using the [DSEG](https://github.com/keshikan/DSEG) 7-segment and 14-segment fonts, complete with glow effects and the classic orange / green / amber colour scheme.

---

## Features

- Click any row label bar to open a **set-time dialog**
- All fields (month, day, year, hour, minute) use **dropdown selectors** — no manual typing required
- Year range spans **1885 – 2155** to cover all notable BTTF dates
- AM / PM toggle with colour-matched LED glow
- Keyboard shortcuts: **Enter** to confirm, **Escape** to cancel
- Fully responsive — scales from desktop down to mobile

---

## How to run / test

No build step or dependencies required.

1. Clone or download the repository.
2. Double-click **`index.html`** to open it in your browser or run **`start .\index.html`**.

---

## Project structure

```
index.html   — markup, modal dialog, font imports
style.css    — all styling (board, LED displays, modal)
script.js    — state management, dropdown population, render logic
```

---

## Browser support

Any modern browser (Chrome, Edge, Firefox, Safari). No polyfills needed.
