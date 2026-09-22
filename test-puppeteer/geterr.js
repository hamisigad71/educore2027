const puppeteer = require('puppeteer');
(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    page.on('console', msg => {
      if (msg.type() === 'error') console.log('BROWSER_CONSOLE_ERROR:', msg.text());
    });
    page.on('pageerror', err => console.log('BROWSER_PAGE_ERROR:', err.toString()));
    await page.goto('http://localhost:5173/', { waitUntil: 'load', timeout: 10000 });
    await new Promise(r => setTimeout(r, 2000));
    await browser.close();
  } catch(e) {
    console.error("SCRIPT_ERROR", e);
  }
})();
