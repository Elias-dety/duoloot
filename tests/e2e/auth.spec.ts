import { test, expect } from '@playwright/test';

test.describe('Autenticação e Rotas', () => {
  const uniqueId = Date.now();
  const testEmail = `test_${uniqueId}@example.com`;
  const testPassword = 'Password123!';

  test('1. Proteção de rotas: Redireciona /dashboard para /login sem sessão', async ({ page }) => {
    await page.goto('/dashboard');
    // Deve redirecionar para /login
    await expect(page).toHaveURL(/\/login/);
  });

  test('2. Cadastro de usuário', async ({ page }) => {
    await page.goto('/cadastro');
    
    await page.fill('input#name', 'Testador Playwright');
    await page.fill('input#nickname', `tester_${uniqueId}`);
    await page.fill('input#email', testEmail);
    await page.fill('input#password', testPassword);
    await page.fill('input#confirmPassword', testPassword);
    
    await page.click('button[type="submit"]');

    // Verifica se deu sucesso (redirecionamento ou tela de verificação)
    const verificationText = page.getByText(/Verificação enviada/i);
    const dashboardTitle = page.getByText(/Dashboard/i);
    
    await Promise.any([
      expect(verificationText).toBeVisible({ timeout: 10000 }),
      expect(page).toHaveURL(/\/dashboard|\/onboarding/)
    ]);
  });

  test('3. Login de usuário inválido exibe erro', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input#email', `fake_${Date.now()}@example.com`);
    await page.fill('input#password', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('form').locator('..').getByText(/inválid|erro|falha/i)).toBeVisible({ timeout: 10000 });
  });

});
