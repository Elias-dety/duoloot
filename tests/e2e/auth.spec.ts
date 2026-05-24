import { test, expect } from '@playwright/test';

test.describe('Autenticação e Rotas', () => {
  const uniqueId = Date.now();
  const testEmail = `test_${uniqueId}@example.com`;
  const testPassword = 'Password123!';

  test.beforeEach(async ({ page }) => {
    // Intercepta chamadas de signup do Supabase Auth
    await page.route('**/auth/v1/signup*', async route => {
      await route.fulfill({
        status: 200,
        json: {
          id: 'mock-user-id',
          email: 'test_playwright@example.com',
          user_metadata: { name: 'Testador Playwright', nickname: 'tester_playwright' },
          created_at: new Date().toISOString()
        }
      });
    });

    // Intercepta chamadas de signin/token do Supabase Auth
    await page.route('**/auth/v1/token*', async route => {
      const request = route.request();
      if (request.method() === 'POST') {
        const body = request.postDataJSON();
        if (body?.email?.includes('fake') || body?.password === 'wrongpassword') {
          await route.fulfill({
            status: 400,
            json: {
              error: 'invalid_grant',
              error_description: 'Invalid login credentials'
            }
          });
          return;
        }
      }

      await route.fulfill({
        status: 200,
        json: {
          access_token: 'mock-access-token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'mock-refresh-token',
          user: {
            id: 'mock-user-id',
            email: 'test_playwright@example.com',
            user_metadata: { name: 'Testador Playwright', nickname: 'tester_playwright' }
          }
        }
      });
    });

    // Mock profiles table insert/select
    await page.route('**/rest/v1/profiles*', async route => {
      await route.fulfill({
        status: 200,
        json: {
          id: 'mock-user-id',
          name: 'Testador Playwright',
          nickname: 'tester_playwright',
          avatar_url: null,
          trust_score: 100,
          game_profile: {
            riotId: 'Test#123',
            mainGame: 'Valorant',
            currentRank: 'Silver 1',
            preferredModes: ['competitive'],
            microphone: true,
            region: 'br',
            bio: 'Test bio'
          }
        }
      });
    });
  });

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
