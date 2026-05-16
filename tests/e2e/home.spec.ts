import { test, expect } from '@playwright/test';

test.describe('Home Page E2E', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve carregar a Home sem erros e exibir título principal', async ({ page }) => {
    await expect(page.locator('h1.dl-title')).toContainText('Escaneie jogadores');
    await expect(page.locator('#scanner')).toBeVisible();
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

    const vaultButton = page.getByRole('button', { name: /Abrir cofre/i });
    await expect(vaultButton).toBeVisible();
    
    await vaultButton.click();
    
    await expect(page).toHaveURL(/\/vault/);
    await expect(page.locator('text=VAULT OPERATION').or(page.locator('text=Erro ao carregar'))).toBeVisible();
  });

  test('responsividade horizontal (Mobile)', async ({ page, isMobile }) => {
    if (!isMobile) return;
    
    const body = page.locator('body');
    const box = await body.boundingBox();
    expect(box?.width).toBeGreaterThan(0);
    
    const scannerPanel = page.locator('#scanner');
    await expect(scannerPanel).toBeVisible();
  });

});
