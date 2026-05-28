import { expect, test } from '@playwright/test';

const publicRoutes = [
  { path: '/', label: 'Home' },
  { path: '/lobby', label: 'Lobby' },
  { path: '/cofre', label: 'Vault' },
  { path: '/coaches', label: 'Coaches' },
  { path: '/login', label: 'Login' },
  { path: '/cadastro', label: 'Cadastro' },
];

const protectedRoutes = [
  '/dashboard',
  '/premium',
  '/onboarding',
  '/riot/connect',
  '/admin/cofre',
];

test.describe('Auditoria funcional de rotas', () => {
  for (const route of publicRoutes) {
    test(`rota pública carrega sem crash: ${route.label}`, async ({ page }) => {
      const pageErrors: Error[] = [];
      page.on('pageerror', (error) => pageErrors.push(error));

      await page.goto(route.path);
      await page.waitForLoadState('networkidle');

      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('#root')).toBeVisible();
      expect(pageErrors, pageErrors.map((error) => error.message).join('\n')).toHaveLength(0);
    });
  }

  for (const route of protectedRoutes) {
    test(`rota privada redireciona visitante para login: ${route}`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/\/login/);
    });
  }
});
