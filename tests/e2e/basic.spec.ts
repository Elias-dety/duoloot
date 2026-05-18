import { test, expect } from '@playwright/test';

test.describe('Rotas Públicas Básicas', () => {

  test('/ — Home carrega sem erro crítico', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).not.toContainText('Cannot GET');
    await expect(page.locator('body')).not.toContainText('Application error');
    // Algum conteúdo base aparece
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(10);
  });

  test('/lobby — Lobby carrega sem erro crítico', async ({ page }) => {
    // Mock API para evitar dependência de Supabase real
    await page.route('**/rest/v1/**', async route => {
      await route.fulfill({ json: [] });
    });
    await page.goto('/lobby');
    await expect(page.locator('body')).not.toContainText('Cannot GET');
    await expect(page.locator('body')).not.toContainText('Application error');
  });

  test('/cofre — Vault carrega sem erro crítico', async ({ page }) => {
    await page.route('**/rest/v1/**', async route => {
      const isSingle = route.request().headers()['accept']?.includes('vnd.pgrst.object');
      await route.fulfill({ json: isSingle ? null : [], status: isSingle ? 406 : 200 });
    });
    await page.goto('/cofre');
    await expect(page.locator('body')).not.toContainText('Cannot GET');
    await expect(page.locator('body')).not.toContainText('Application error');
  });

  test('/login — Login carrega sem erro crítico', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('body')).not.toContainText('Cannot GET');
    await expect(page.locator('body')).not.toContainText('Application error');
  });

  test('/cadastro — Cadastro carrega sem erro crítico', async ({ page }) => {
    await page.goto('/cadastro');
    await expect(page.locator('body')).not.toContainText('Cannot GET');
    await expect(page.locator('body')).not.toContainText('Application error');
  });

});
