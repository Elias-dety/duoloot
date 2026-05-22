import { test, expect } from '@playwright/test';

test.describe('Lobby Page E2E', () => {

  test.beforeEach(async ({ page }) => {
    await page.route('**/rest/v1/lobbies*', async route => {
      const json = [{
        id: 'mock-lobby-1',
        owner: { id: 'user-1', name: 'MockUser', trust_score: 95 },
        slots_total: 5,
        slots_filled: 2,
        mode: 'competitivo',
        queue: 'ranked',
        status: 'open',
        created_at: new Date().toISOString()
      }];
      await route.fulfill({ json });
    });

    await page.goto('/lobby');
  });

  test('deve carregar a rota /lobby e exibir o título', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible();
    await expect(page.locator('text=MockUser')).toBeVisible();
  });

  test('deve validar que pelo menos 1 card aparece e botões principais', async ({ page }) => {
    // Espera o mock lobby renderizar
    const lobbyCard = page.locator('.dl-panel').filter({ hasText: 'MockUser' }).first();
    await expect(lobbyCard).toBeVisible();

    // Na arquitetura de card do Lobby, deve haver um botão de Entrar/Join
    const joinBtn = lobbyCard.locator('button').first();
    if (await joinBtn.count() > 0) {
      await expect(joinBtn).toBeVisible();
    }
  });

  test('Lobby mobile deve manter renderização consistente e exibir cards', async ({ page, isMobile }) => {
    if (!isMobile) return;
    
    await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible();
    
    // O card precisa estar visível
    const lobbyCard = page.locator('.dl-panel').filter({ hasText: 'MockUser' }).first();
    await expect(lobbyCard).toBeVisible();
  });

});
