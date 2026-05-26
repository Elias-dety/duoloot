import { test, expect } from '@playwright/test';

test('Real Lobby E2E Flow (Create and Join)', async ({ browser }) => {
  test.setTimeout(60000);

  const ownerContext = await browser.newContext();
  const ownerPage = await ownerContext.newPage();

  ownerPage.on('console', msg => console.log('OWNER CONSOLE:', msg.text()));
  ownerPage.on('pageerror', err => console.log('OWNER PAGE ERROR:', err.message));
  ownerPage.on('response', response => {
    if (response.status() >= 400) {
      console.log('OWNER BAD RESPONSE:', response.status(), response.url());
      response.text().then(text => console.log('OWNER RESPONSE BODY:', text)).catch(() => {});
    }
  });

  const joinerContext = await browser.newContext();
  const joinerPage = await joinerContext.newPage();

  joinerPage.on('console', msg => console.log('JOINER CONSOLE:', msg.text()));
  joinerPage.on('pageerror', err => console.log('JOINER PAGE ERROR:', err.message));
  joinerPage.on('response', response => {
    if (response.status() >= 400) {
      console.log('JOINER BAD RESPONSE:', response.status(), response.url());
      response.text().then(text => console.log('JOINER RESPONSE BODY:', text)).catch(() => {});
    }
  });

  console.log('Logging in Owner...');
  await ownerPage.goto('/login');
  await ownerPage.fill('input#email', 'owner_test@duoloot.com');
  await ownerPage.fill('input#password', 'Password123!');
  await ownerPage.click('button[type="submit"]');

  await ownerPage.waitForTimeout(5000);
  await ownerPage.screenshot({ path: 'owner_login_debug.png' });
  console.log('Owner current URL:', ownerPage.url());

  await expect(ownerPage).not.toHaveURL(/\/login/, { timeout: 10000 });
  console.log('Owner logged in successfully.');

  console.log('Logging in Joiner...');
  await joinerPage.goto('/login');
  await joinerPage.fill('input#email', 'joiner_test@duoloot.com');
  await joinerPage.fill('input#password', 'Password123!');
  await joinerPage.click('button[type="submit"]');

  await joinerPage.waitForTimeout(5000);
  await joinerPage.screenshot({ path: 'joiner_login_debug.png' });
  console.log('Joiner current URL:', joinerPage.url());

  await expect(joinerPage).not.toHaveURL(/\/login/, { timeout: 10000 });
  console.log('Joiner logged in successfully.');

  console.log('Navigating both pages to /lobby...');
  await ownerPage.goto('/lobby');
  await joinerPage.goto('/lobby');

  await expect(ownerPage.getByText('Lobbies disponíveis')).toBeVisible({ timeout: 10000 });
  await expect(joinerPage.getByText('Lobbies disponíveis')).toBeVisible({ timeout: 10000 });

  console.log('Owner clicking "+ Criar Lobby"...');
  await ownerPage.click('button:has-text("+ Criar Lobby")');

  console.log('Waiting for Owner success message...');
  await expect(ownerPage.getByText('Lobby criado com sucesso.')).toBeVisible({ timeout: 15000 });
  console.log('Lobby created successfully!');

  const ownerLobbyCard = ownerPage.locator('.dl-panel', { hasText: 'Owner Test' }).first();
  await expect(ownerLobbyCard).toBeVisible({ timeout: 10000 });
  console.log('Lobby card is visible on Owner page.');

  console.log('Waiting for Lobby card to appear on Joiner page via Realtime...');
  const joinerLobbyCard = joinerPage.locator('.dl-panel', { hasText: 'Owner Test' }).first();
  await expect(joinerLobbyCard).toBeVisible({ timeout: 15000 });
  console.log('Lobby card is visible on Joiner page!');

  console.log('Joiner clicking "Entrar no lobby"...');
  const joinButton = joinerLobbyCard.locator('button:has-text("Entrar no lobby")');
  await expect(joinButton).toBeVisible({ timeout: 10000 });
  await expect(joinButton).toBeEnabled({ timeout: 10000 });
  await joinButton.click();

  console.log('Waiting for Joiner joined card state...');
  await expect(joinerLobbyCard.locator('button:has-text("Você entrou")')).toBeVisible({ timeout: 20000 });
  await expect(joinerLobbyCard.locator('button:has-text("Sair do lobby")')).toBeVisible({ timeout: 10000 });
  console.log('Joiner joined lobby successfully!');

  await ownerContext.close();
  await joinerContext.close();
});
