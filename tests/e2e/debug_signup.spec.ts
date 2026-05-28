import { test } from '@playwright/test';

test('Debug Signup', async ({ page }) => {
  page.on('console', msg => console.log('PAGE CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText);
  });

  page.on('response', response => {
    if (response.status() >= 400) {
      console.log('BAD RESPONSE:', response.status(), response.url());
      response.text().then(text => console.log('RESPONSE BODY:', text)).catch(() => {});
    }
  });

  const timestamp = Date.now();
  const email = `owner_${timestamp}@duoloot.com`;
  const password = 'Password123!';

  await page.goto('/cadastro');
  await page.fill('input#name', 'Owner Test');
  await page.fill('input#nickname', `owner_${timestamp}`);
  await page.fill('input#email', email);
  await page.fill('input#password', password);
  await page.fill('input#confirmPassword', password);
  
  console.log('Submitting signup...');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);
  
  await page.screenshot({ path: 'signup_debug.png' });
  console.log('Screenshot saved to signup_debug.png. Current URL:', page.url());
});
