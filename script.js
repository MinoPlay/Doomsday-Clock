/* ═══════════════════════════════════════════
   TIME CIRCUITS — script.js
═══════════════════════════════════════════ */

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN',
                'JUL','AUG','SEP','OCT','NOV','DEC'];

// Row colour used for CSS variable injection
const ROW_COLORS = {
  destination: '#FF5500',
  present:     '#00FF55',
  departed:    '#FFAA00',
};

// State for each row
const state = {
  destination: null,
  present:     null,
  departed:    null,
};

// Which row the modal is currently editing
let activeRow = null;
// Which AM/PM is selected in the modal
let modalAmPm = 'AM';

/* ──────────────────────────────────────────
   Initialise: load Present Time from clock
────────────────────────────────────────── */
(function init() {
  const now = new Date(2055, 2, 12); // default: Mar 12 2055
  const h24  = now.getHours();
  const ampm = h24 < 12 ? 'AM' : 'PM';
  const h12  = h24 % 12 === 0 ? 12 : h24 % 12;

  state.present = {
    month: MONTHS[now.getMonth()],
    day:   now.getDate(),
    year:  now.getFullYear(),
    hour:  h12,
    min:   now.getMinutes(),
    ampm,
  };

  renderRow('present');
})();

/* ──────────────────────────────────────────
   Render a row from state
────────────────────────────────────────── */
function renderRow(row) {
  const s = state[row];
  const empty = s === null;

  function setCell(id, value, dim) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = value;
    el.classList.toggle('dim-state', !!dim);
  }

  if (empty) {
    setCell(`${row}-month`, '---', true);
    setCell(`${row}-day`,   '--',  true);
    setCell(`${row}-year`,  '----',true);
    setCell(`${row}-hour`,  '--',  true);
    setCell(`${row}-min`,   '--',  true);
    setAmPmDisplay(row, null);
  } else {
    setCell(`${row}-month`, s.month, false);
    setCell(`${row}-day`,   String(s.day).padStart(2, '0'), false);
    setCell(`${row}-year`,  String(s.year).padStart(4, '0'), false);
    setCell(`${row}-hour`,  String(s.hour).padStart(2, '0'), false);
    setCell(`${row}-min`,   String(s.min).padStart(2, '0'), false);
    setAmPmDisplay(row, s.ampm);
  }
}

function setAmPmDisplay(row, ampm) {
  const amEl = document.getElementById(`${row}-am`);
  const pmEl = document.getElementById(`${row}-pm`);
  if (!amEl || !pmEl) return;
  amEl.classList.toggle('active', ampm === 'AM');
  pmEl.classList.toggle('active', ampm === 'PM');
}

/* ──────────────────────────────────────────
   Open modal
────────────────────────────────────────── */
function openModal(row) {
  activeRow = row;

  // Inject CSS variable for the LED colour inside the modal
  const box = document.getElementById('modal-box');
  box.style.setProperty('--row-color', ROW_COLORS[row]);

  // Update modal title
  const titles = {
    destination: 'DESTINATION TIME',
    present:     'PRESENT TIME',
    departed:    'LAST TIME DEPARTED',
  };
  document.getElementById('modal-title').textContent = titles[row];

  // Clear error
  document.getElementById('modal-error').textContent = '';

  // Pre-fill from existing state (or sensible defaults)
  const s = state[row];
  if (s) {
    document.getElementById('input-month').value = s.month;
    document.getElementById('input-day').value   = s.day;
    document.getElementById('input-year').value  = s.year;
    document.getElementById('input-hour').value  = s.hour;
    document.getElementById('input-min').value   = String(s.min).padStart(2, '0');
    modalAmPm = s.ampm;
  } else {
    document.getElementById('input-month').value = 'JAN';
    document.getElementById('input-day').value   = '';
    document.getElementById('input-year').value  = '';
    document.getElementById('input-hour').value  = '';
    document.getElementById('input-min').value   = '';
    modalAmPm = 'AM';
  }

  // Apply colour to all .field-input and .ampm-btn
  applyModalColor(ROW_COLORS[row]);
  refreshAmPmButtons();

  // Show
  document.getElementById('modal-overlay').classList.add('visible');

  // Focus first input
  setTimeout(() => document.getElementById('input-day').focus(), 50);
}

function applyModalColor(color) {
  document.querySelectorAll('.field-input').forEach(el => {
    el.style.color = color;
    el.style.textShadow = `0 0 8px ${color}`;
  });
}

/* ──────────────────────────────────────────
   Close modal
────────────────────────────────────────── */
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('visible');
  activeRow = null;
}

function overlayClick(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

/* ──────────────────────────────────────────
   AM / PM toggle
────────────────────────────────────────── */
function selectAmPm(val) {
  modalAmPm = val;
  refreshAmPmButtons();
}

function refreshAmPmButtons() {
  document.getElementById('btn-am').classList.toggle('active', modalAmPm === 'AM');
  document.getElementById('btn-pm').classList.toggle('active', modalAmPm === 'PM');
}

/* ──────────────────────────────────────────
   Confirm / validate
────────────────────────────────────────── */
function confirmModal() {
  const errorEl = document.getElementById('modal-error');
  errorEl.textContent = '';

  const month = document.getElementById('input-month').value.trim().toUpperCase();
  const day   = parseInt(document.getElementById('input-day').value, 10);
  const year  = parseInt(document.getElementById('input-year').value, 10);
  const hour  = parseInt(document.getElementById('input-hour').value, 10);
  const min   = parseInt(document.getElementById('input-min').value, 10);

  // Validation
  if (!MONTHS.includes(month)) {
    errorEl.textContent = 'INVALID MONTH';
    return;
  }
  if (isNaN(day) || day < 1 || day > 31) {
    errorEl.textContent = 'DAY MUST BE 1 – 31';
    return;
  }
  if (isNaN(year) || year < 1 || year > 9999) {
    errorEl.textContent = 'YEAR MUST BE 1 – 9999';
    return;
  }
  if (isNaN(hour) || hour < 1 || hour > 12) {
    errorEl.textContent = 'HOUR MUST BE 1 – 12';
    return;
  }
  if (isNaN(min) || min < 0 || min > 59) {
    errorEl.textContent = 'MINUTE MUST BE 0 – 59';
    return;
  }

  // Save state
  state[activeRow] = { month, day, year, hour, min, ampm: modalAmPm };
  renderRow(activeRow);
  closeModal();
}

/* ──────────────────────────────────────────
   Keyboard support
────────────────────────────────────────── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
  if (e.key === 'Enter') {
    if (document.getElementById('modal-overlay').classList.contains('visible')) {
      confirmModal();
    }
  }
});
