import { test, expect } from '@playwright/test';

test.describe('Home Page E2E', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve carregar a Home sem erros e exibir título principal', async ({ page }) => {
    // Busca o H1 principal e o input de busca
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    await expect(page.locator('input[placeholder*="Riot ID"]')).toBeVisible();
  });

  test('deve exibir CTA principal e navegar para Vault', async ({ page }) => {
    // Adiciona mocks do Vault apenas para a navegação não quebrar visualmente caso a API dispare
    await page.route('**/rest/v1/vault_events*', async route => {
      const isSingle = route.request().headers()['accept']?.includes('vnd.pgrst.object');
      const obj = {
        id: 'mock-event-1', title: 'Mock Vault Event', description: 'Test Description',
        prize_pool: 5000, prize_currency: 'DuoCoins', status: 'active',
        total_participants: 150, online_participants: 40,
        starts_at: new Date().toISOString(), ends_at: new Date(Date.now() + 86400000).toISOString()
      };
      await route.fulfill({ json: isSingle ? obj : [obj] });
    });
    await page.route('**/rest/v1/vault_tasks*', async route => {
      await route.fulfill({ json: [] });
    });
    await page.route('**/rest/v1/vault_winners*', async route => {
      await route.fulfill({ json: [] });
    });
    await page.route('**/rest/v1/rpc/get_vault_leaderboard*', async route => {
      await route.fulfill({ json: [] });
    });
    await page.route('**/rest/v1/rpc/get_my_vault_rank*', async route => {
      await route.fulfill({ json: [] });
    });
    await page.route('**/rest/v1/rpc/get_vault_winners*', async route => {
      await route.fulfill({ json: [] });
    });
    await page.route('**/rest/v1/rpc/get_vault_seasons*', async route => {
      await route.fulfill({ json: [] });
    });

    const isMobile = page.viewportSize()?.width && page.viewportSize()!.width < 768;
    if (isMobile) {
      const menuBtn = page.getByRole('button', { name: /Menu|Fechar/i });
      if (await menuBtn.isVisible()) {
        await menuBtn.click();
      }
    }

    const vaultLink = page.locator('a[href="/cofre"]').filter({ visible: true }).first();
    await expect(vaultLink).toBeVisible();
    await vaultLink.click();
    
    await expect(page).toHaveURL(/\/cofre/);
    await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible();
  });

  test('responsividade horizontal (Mobile)', async ({ page, isMobile }) => {
    if (!isMobile) return;
    
    const body = page.locator('body');
    const box = await body.boundingBox();
    expect(box?.width).toBeGreaterThan(0);
    
    const searchInput = page.locator('input[placeholder*="Riot ID"]');
    await expect(searchInput).toBeVisible();
  });

});
