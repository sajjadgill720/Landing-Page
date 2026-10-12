# Cozy Moments storefront

The complete HTML, CSS, JavaScript, and artwork for your private storefront prototype. No build step, npm packages, or API keys are required.

## Run locally

1. Extract the ZIP fully.
2. Open `cozy-moments-source/index.html` in a modern browser.

Or open a terminal in the extracted `cozy-moments-source` folder and run:

```bash
python -m http.server 8000
```

On Windows, use `py -m http.server 8000` if the `python` command is unavailable. Then open http://localhost:8000.

## Files

- `index.html`: page content, sections, and dialogs.
- `styles.css`: design, desktop/mobile layouts, and reduced-motion support.
- `app.js`: scene gallery, colored/line-art switch, enlarged previews, keyboard navigation, touch gestures, and country-specific Amazon product links.
- `assets/`: book cover, six pairs of scene previews, and favicon.

## Customize

Edit the title, offer, and page copy in `index.html`; edit questions and advice in the `scenes` array in `app.js`; edit colors and layout in `styles.css`. Keep image paths relative to `index.html`.

The displayed offer is $9.99 USD. The header, hero, and mobile “Get the book” links scroll to the purchase section, where visitors can choose their Amazon store. The Amazon button in the section opens a country-selection popup; its Buy on Amazon link points to product `B0HMJ8V7V6` in one of the 14 configured Amazon stores. On page load, a browser-region fallback is applied immediately, then an IP country lookup through `https://ipapi.co/json/` updates the links (with a three-second timeout). This third-party request shares the visitor's IP address with ipapi; no precise device location permission is requested. If the lookup fails, the browser-region fallback remains; unsupported countries use the US store. The section and popup store selectors stay synchronized and let visitors override detection, including when using a VPN, and a selection made during lookup is preserved. Without JavaScript, section links still scroll to the offer and the Amazon purchase link opens the US product listing. Local prices and delivery are confirmed on Amazon.

## Hosting

Any static host can serve these files. Upload the contents of this folder so `index.html` sits at the site root. This export contains only the storefront; the private ChatGPT sign-in gate is supplied by the existing hosting service. Configure access controls on any host where you want the site to stay private.

Existing private prototype:
https://cozy-moments-book.sajjadajmal405.chatgpt.site


## Mobile purchase layout

The compact purchase popup keeps its buy action visible while the country list scrolls. The mobile page includes a persistent purchase-section link, large tap targets, and rounded buttons with golden shadows. Preview screenshots are saved in the previews folder. Automated layout checks cover 320x568, 375x667, 390x844, 430x932, 844x390, and 1280x720 viewports.
