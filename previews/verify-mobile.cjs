const { chromium } = require('C:/Users/Sajjad Ur Rehman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({reducedMotion: 'reduce'});
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('https://ipapi.co/**', route => route.fulfill({json: {country_code: 'US'}}));
  for (const [width, height] of [[390, 844], [320, 568], [375, 667], [430, 932], [844, 390], [1280, 720]]) {
    await page.setViewportSize({width, height});
    await page.goto(pathToFileURL(path.resolve(__dirname, '../index.html')).href);
    await page.evaluate(() => document.fonts.ready);
    const previewHeadingDisplay = await page.locator('.preview-section > .section-heading').evaluate(el => getComputedStyle(el).display);
    const reviewFont = await page.locator('.review-quote').first().evaluate(el => getComputedStyle(el).fontSize);
    assert.equal(previewHeadingDisplay, width <= 820 ? 'none' : 'flex');
    assert.equal(reviewFont, width <= 820 ? '14px' : '16px');
    const detailColumns = await page.locator('.details-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    assert.equal(detailColumns, width <= 1024 ? 2 : 4);
    if (width === 390) await page.screenshot({path: path.join(__dirname, 'mobile-home.png')});
    const overflowing = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.width && rect.right > innerWidth + 1;
    }).map(el => ({tag: el.tagName, class: el.className, right: el.getBoundingClientRect().right})).slice(0, 15));
    if (overflowing.length) console.log(JSON.stringify(overflowing));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Page overflows at ${width}`);
    if (width === 390) {
      await page.locator('.mobile-purchase a[href="#inside"]').click();
      await page.screenshot({path: path.join(__dirname, 'mobile-pages.png')});
      await page.locator('#reviews').evaluate(el => el.scrollIntoView({block: 'start'}));
      await page.screenshot({path: path.join(__dirname, 'mobile-reviews.png')});
      await page.locator('.details-grid').evaluate(el => el.scrollIntoView({block: 'start'}));
      await page.screenshot({path: path.join(__dirname, 'mobile-details.png')});
    }
    await page.locator('.hero-purchase').click();
    await page.locator('.amazon-purchase').click();
    const modalBounds = await page.locator('#purchase-dialog').boundingBox();
    assert(modalBounds.y >= 0 && modalBounds.y + modalBounds.height <= height, `Popup outside viewport at ${width}x${height}: ${JSON.stringify(modalBounds)}`);
    assert.equal(await page.locator('#purchase-dialog').evaluate(el => el.scrollHeight > el.clientHeight), false, `Popup scrolls at ${width}x${height}`);
    const bounds = await page.locator('#amazon-direct-btn').boundingBox();
    assert(bounds.y >= 0 && bounds.y + bounds.height <= height, `Buy action offscreen at ${width}x${height}`);
    if (width === 390) await page.screenshot({path: path.join(__dirname, 'mobile-purchase.png')});
    await page.locator('#amazon-dialog-store-menu').click();
    await page.waitForFunction(() => document.querySelector('#purchase-dialog .country-options').style.maxHeight !== '');
    const menuBounds = await page.locator('#purchase-dialog .country-options').boundingBox();
    const triggerBounds = await page.locator('#amazon-dialog-store-menu').boundingBox();
    assert(menuBounds.y >= modalBounds.y && menuBounds.y + menuBounds.height < triggerBounds.y, `Country menu must open upward inside the popup at ${width}x${height}`);
    if (width === 390) await page.screenshot({path: path.join(__dirname, 'mobile-country-menu.png')});
    const openBounds = await page.locator('#amazon-direct-btn').boundingBox();
    assert(openBounds.y + openBounds.height <= height, `Buy action hidden by menu at ${width}x${height}`);
    await page.getByRole('radio', {name: 'United Kingdom (UK)', exact: true}).last().check();
    await page.locator('#amazon-cta-label').waitFor({state: 'visible'});
    assert.equal(await page.locator('#amazon-direct-btn').getAttribute('href'), 'https://www.amazon.co.uk/dp/B0HMJ8V7V6');
    await page.locator('#amazon-dialog-store-menu').click();
    await page.getByRole('radio', {name: 'Ireland (IE)', exact: true}).last().check();
    await page.locator('#amazon-dialog-store-menu').click();
    await page.waitForFunction(() => document.querySelector('#purchase-dialog .country-options').scrollTop === 0);
    assert.equal(await page.locator('#purchase-dialog .country-option').first().innerText(), 'United States (US)');
    await page.getByRole('radio', {name: 'United Kingdom (UK)', exact: true}).last().check();
    if (width === 1280) await page.screenshot({path: path.join(__dirname, 'desktop-purchase.png')});
    console.log(`Passed ${width}x${height}: no horizontal overflow, popup fits, purchase button visible, country selection updates URL.`);
  }
  assert.deepEqual(errors, []);
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
