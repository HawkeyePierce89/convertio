import path from 'path';
import puppeteer, { Browser, Page } from 'puppeteer';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const LANGUAGES = [
  { value: 'en', name: 'English' },
  { value: 'ru', name: 'Русский' },
  { value: 'de', name: 'Deutsch' },
  { value: 'es', name: 'Español' },
  { value: 'zh', name: '中文' },
];
const BASE_URL = 'http://localhost:4173/convertio/';
const TEST_IMAGE = path.resolve(__dirname, '../fixtures/test-image.png');

describe('i18n overflow check', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
  });

  afterAll(async () => {
    await browser.close();
  });

  for (const lang of LANGUAGES) {
    it(`buttons should not overflow container (${lang.name})`, async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

      // Select language by value (language code)
      await page.select('#language-select', lang.value);

      // Small delay to let UI update
      await new Promise((r) => setTimeout(r, 100));

      // Upload test image to show the buttons
      const fileInput = await page.$('input[type="file"]');
      if (fileInput) {
        await fileInput.uploadFile(TEST_IMAGE);
      }

      // Wait for buttons to appear
      await page.waitForSelector('.actions .btn');

      // Check overflow
      const overflowInfo = await page.evaluate(() => {
        const container = document.querySelector('.actions');
        const buttons = container?.querySelectorAll('.btn');
        if (!container || !buttons || buttons.length === 0) {
          return { hasOverflow: false, details: 'No buttons found' };
        }

        const containerRect = container.getBoundingClientRect();
        const overflowingButtons: string[] = [];

        for (const btn of buttons) {
          const btnRect = btn.getBoundingClientRect();
          if (btnRect.right > containerRect.right + 1) {
            overflowingButtons.push(
              `"${btn.textContent}" (btn.right=${btnRect.right.toFixed(0)}, container.right=${containerRect.right.toFixed(0)})`
            );
          }
        }

        return {
          hasOverflow: overflowingButtons.length > 0,
          details: overflowingButtons.join(', '),
        };
      });

      expect(overflowInfo.hasOverflow, `Overflow detected: ${overflowInfo.details}`).toBe(false);
    });
  }
});
