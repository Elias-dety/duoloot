import { test } from '@playwright/test';

test('Signup owner and joiner', async ({ page }) => {
  // We will register owner and joiner users
  const timestamp = Date.now();
  const ownerEmail = `owner_${timestamp}@duoloot.com`;
  const joinerEmail = `joiner_${timestamp}@duoloot.com`;
  const password = 'Password123!';

  console.log(`OWNER_EMAIL=${ownerEmail}`);
  console.log(`JOINER_EMAIL=${joinerEmail}`);

  // Register Owner
  await page.goto('/cadastro');
  await page.fill('input#name', 'Owner Test');
  await page.fill('input#nickname', `owner_${timestamp}`);
  await page.fill('input#email', ownerEmail);
  await page.fill('input#password', password);
  await page.fill('input#confirmPassword', password);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);
  console.log('Owner signup submitted. Current URL:', page.url());
  const bodyTextOwner = await page.locator('body').textContent();
  console.log('Owner body text snippet:', bodyTextOwner?.substring(0, 300));

  // Register Joiner
  await page.goto('/cadastro');
  await page.fill('input#name', 'Joiner Test');
  await page.fill('input#nickname', `joiner_${timestamp}`);
  await page.fill('input#email', joinerEmail);
  await page.fill('input#password', password);
  await page.fill('input#confirmPassword', password);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);
  console.log('Joiner signup submitted. Current URL:', page.url());
  const bodyTextJoiner = await page.locator('body').textContent();
  console.log('Joiner body text snippet:', bodyTextJoiner?.substring(0, 300));
});
