'use strict';

const AMAZON_PRODUCT_ID = 'B0HMJ8V7V6';
const AMAZON_STORES = {
  US: 'www.amazon.com',
  GB: 'www.amazon.co.uk',
  DE: 'www.amazon.de',
  FR: 'www.amazon.fr',
  ES: 'www.amazon.es',
  JP: 'www.amazon.co.jp',
  CA: 'www.amazon.ca',
  IT: 'www.amazon.it',
  NL: 'www.amazon.nl',
  PL: 'www.amazon.pl',
  AU: 'www.amazon.com.au',
  SE: 'www.amazon.se',
  BE: 'www.amazon.com.be',
  IE: 'www.amazon.ie'
};

function amazonUrl(country) {
  return `https://${AMAZON_STORES[country] || AMAZON_STORES.US}/dp/${AMAZON_PRODUCT_ID}`;
}

const scenes = [
  {
    title: 'Sleepy little bear',
    short: 'Sweet dreams',
    description: 'A bear and a little teddy tucked beneath a patchwork quilt',
    question: 'If this bear could dream of anywhere, where would the dream take them?',
    advice: 'Rest is important. Give yourself a cozy break when you need one.'
  },
  {
    title: 'One more story',
    short: 'Story time',
    description: 'A bunny reading beside a warm fireplace while a dog rests nearby',
    question: 'What story do you think the bunny is reading? Can you invent its ending?',
    advice: 'Your ideas matter. Share them, even when they feel small.'
  },
  {
    title: 'A rainy-day daydream',
    short: 'Rainy days',
    description: 'A cat sitting on a blanket-covered window seat, watching the rain',
    question: 'If the raindrops could talk, what would they say to the cat?',
    advice: 'It is okay to slow down. Take a breath and notice something lovely.'
  },
  {
    title: 'Cookies made with kindness',
    short: 'Baking day',
    description: 'A bear in a chef’s hat making cookies in a cozy kitchen',
    question: 'What surprising cookie shape would you invent, and who would you share it with?',
    advice: 'A small act of kindness can make someone’s day feel warmer.'
  },
  {
    title: 'A picnic for two',
    short: 'Friendly picnic',
    description: 'A fox and a bunny sharing a picnic in a flower-filled garden',
    question: 'If you could invite one more friend to this picnic, who would it be and why?',
    advice: 'Make room for others. Sharing can turn a little moment into a happy one.'
  },
  {
    title: 'A blanket-fort adventure',
    short: 'Cozy hideaway',
    description: 'A teddy bear in a blanket fort with cushions, books, and gentle lights',
    question: 'Imagine this blanket fort is a secret world. What would you find inside?',
    advice: 'You can create something wonderful with the little things around you.'
  }
];

let current = 0;
let view = 'pair';
const $ = id => document.getElementById(id);

// Generate thumbnails
const thumbnails = $('scene-thumbnails');
scenes.forEach((scene, i) => {
  const button = document.createElement('button');
  button.className = 'scene-thumbnail';
  button.type = 'button';
  button.setAttribute('aria-label', `Preview scene ${i + 1}: ${scene.title}`);
  
  const img = document.createElement('img');
  img.src = `assets/scene-${i + 1}-colored.webp`;
  img.alt = '';
  img.loading = 'lazy';
  img.width = 1000;
  img.height = 667;
  
  const label = document.createElement('span');
  label.textContent = scene.short;
  
  button.append(img, label);
  button.addEventListener('click', () => render(i));
  thumbnails.append(button);
});

function render(index) {
  current = (index + scenes.length) % scenes.length;
  const s = scenes[current];
  const n = current + 1;
  
  for (const [id, variant] of [
    ['colored-page', 'colored'],
    ['line-page', 'line'],
    ['zoom-colored', 'colored'],
    ['zoom-line', 'line']
  ]) {
    $(id).src = `assets/scene-${n}-${variant}.webp`;
    $(id).alt = `${s.description}. ${variant === 'colored' ? 'Colored inspiration page' : 'Line-art coloring page'}.`;
  }
  
  $('scene-title').textContent = s.title;
  $('scene-counter').textContent = `Scene ${n} of ${scenes.length}`;
  $('page-question').textContent = s.question;
  $('question-note').textContent = `“${s.question}”`;
  $('page-advice').textContent = s.advice;
  $('advice-note').textContent = `“${s.advice}”`;
  $('zoom-title').textContent = s.title;
  $('zoom-question').textContent = `Wonder: ${s.question}`;
  $('zoom-advice').textContent = `A kind word: ${s.advice}`;
  $('zoom-counter').textContent = `${n} / ${scenes.length}`;
  
  document.querySelectorAll('.paper-number').forEach((el, i) => {
    el.textContent = String(current * 2 + i + 1).padStart(2, '0');
  });
  
  [...thumbnails.children].forEach((button, i) => {
    button.setAttribute('aria-pressed', String(i === current));
  });
  
  const spread = $('spread');
  spread.classList.remove('page-enter');
  void spread.offsetWidth; // Force reflow
  spread.classList.add('page-enter');
}

// Controls
for (const id of ['previous', 'zoom-previous']) {
  $(id).addEventListener('click', () => render(current - 1));
}
for (const id of ['next', 'zoom-next']) {
  $(id).addEventListener('click', () => render(current + 1));
}

// View toggle (Both pages, Colored, Line art)
document.querySelectorAll('[data-view]').forEach(button => {
  button.addEventListener('click', () => {
    view = button.dataset.view;
    $('spread').dataset.view = view;
    document.querySelectorAll('[data-view]').forEach(b => {
      b.setAttribute('aria-pressed', String(b === button));
    });
  });
});

// Keyboard navigation
function keyboardNavigate(e) {
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    render(current - 1);
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    render(current + 1);
  }
}
$('book-viewer').addEventListener('keydown', keyboardNavigate);
$('zoom-dialog').addEventListener('keydown', keyboardNavigate);

// Touch gestures
let touchStart = null;
$('book-viewer').addEventListener('touchstart', e => {
  touchStart = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
}, { passive: true });

$('book-viewer').addEventListener('touchend', e => {
  if (!touchStart) return;
  const dx = e.changedTouches[0].clientX - touchStart.x;
  const dy = e.changedTouches[0].clientY - touchStart.y;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
    render(current + (dx < 0 ? 1 : -1));
  }
  touchStart = null;
}, { passive: true });

// Dialog handling
function openDialog(id) {
  const dialog = $(id);
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
    document.body.classList.add('modal-open');
  }
}

// Keep the section and popup store selections in sync.
const storeSelector = $('amazon-store');
const dialogStoreSelector = $('amazon-dialog-store');
dialogStoreSelector.replaceChildren(...[...storeSelector.options].map(option => option.cloneNode(true)));
let storeChosen = false;
const countryMenus = [storeSelector, dialogStoreSelector].map(selector => {
  const menu = document.createElement('details');
  menu.className = 'country-menu';
  const summary = document.createElement('summary');
  summary.id = `${selector.id}-menu`;
  const label = document.querySelector(`label[for="${selector.id}"]`);
  label.htmlFor = summary.id;
  label.id = `${selector.id}-label`;
  summary.setAttribute('aria-labelledby', `${label.id} ${summary.id}`);
  const list = document.createElement('div');
  list.className = 'country-options';
  list.setAttribute('role', 'group');
  list.setAttribute('aria-label', 'Amazon delivery country');
  for (const option of selector.options) {
    const row = document.createElement('label');
    row.className = 'country-option';
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = `${selector.id}-country`;
    radio.value = option.value;
    radio.addEventListener('change', () => {
      selector.value = radio.value;
      selector.dispatchEvent(new Event('change'));
    });
    row.append(radio, document.createTextNode(option.textContent));
    list.append(row);
  }
  menu.append(summary, list);
  selector.after(menu);
  selector.hidden = true;
  selector.addEventListener('change', () => {
    menu.open = false;
    summary.focus();
  });
  menu.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      event.preventDefault();
      event.stopPropagation();
      menu.open = false;
      summary.focus();
    }
  });
  document.addEventListener('pointerdown', event => {
    if (!menu.contains(event.target)) menu.open = false;
  });
  return {selector, menu, summary, list};
});

function setAmazonStore(country) {
  const code = String(country || '').toUpperCase();
  const normalized = code === 'UK' ? 'GB' : code;
  const selected = Object.hasOwn(AMAZON_STORES, normalized) ? normalized : 'US';
  storeSelector.value = selected;
  dialogStoreSelector.value = selected;
  for (const {selector, summary, list} of countryMenus) {
    summary.textContent = selector.selectedOptions[0].textContent;
    list.querySelectorAll('input').forEach(radio => {
      radio.checked = radio.value === selected;
    });
  }
  $('amazon-cta-label').textContent = `View book on Amazon ${selected === 'GB' ? 'UK' : selected}`;
  document.querySelectorAll('.amazon-purchase, #amazon-direct-btn').forEach(link => {
    link.href = amazonUrl(selected);
  });
}

for (const selector of [storeSelector, dialogStoreSelector]) {
  selector.addEventListener('change', () => {
    storeChosen = true;
    setAmazonStore(selector.value);
  });
}

document.querySelectorAll('.amazon-purchase').forEach(link => {
  link.addEventListener('click', event => {
    if (typeof $('purchase-dialog').showModal !== 'function') return;
    event.preventDefault();
    // Keep the country shown in the popup stable while the visitor reviews it.
    storeChosen = true;
    openDialog('purchase-dialog');
    countryMenus[1].menu.open = false;
    countryMenus[1].summary.focus();
  });
});

async function detectAmazonStore() {
  // Browser region provides an immediate fallback while IP lookup completes.
  const locale = navigator.language || '';
  const region = locale.match(/-([A-Z]{2})(?:-|$)/i);
  setAmazonStore(region ? region[1] : 'US');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
      credentials: 'omit',
      referrerPolicy: 'no-referrer'
    });
    if (!response.ok) return;
    const location = await response.json();
    if (!storeChosen && !location.error && /^[A-Z]{2}$/.test(location.country_code)) {
      setAmazonStore(location.country_code);
    }
  } catch {
    // Keep the browser-region fallback when offline or lookup is unavailable.
  } finally {
    clearTimeout(timeout);
  }
}

detectAmazonStore();

$('enlarge').addEventListener('click', () => openDialog('zoom-dialog'));

document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelectorAll('[data-close]').forEach(b => {
    b.addEventListener('click', () => dialog.close());
  });
  
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
  });
  
  dialog.addEventListener('click', e => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
      dialog.close();
    }
  });
});

// Initialize first scene
render(0);
