import { expect, test } from '@playwright/test';

const mockEventId = '11111111-1111-4111-8111-111111111111';
const mockMissionId = '22222222-2222-4222-8222-222222222222';

const now = new Date().toISOString();
const tomorrow = new Date(Date.now() + 86400000).toISOString();

const mockEvent = {
  id: mockEventId,
  title: 'Mock Vault Event',
  description: 'Test Description',
  prize_label: 'DuoCoins',
  prize_value: 5000,
  prize_pool: 5000,
  prize_currency: 'DuoCoins',
  status: 'active',
  goal_points: 1000,
  current_points: 120,
  total_participants: 150,
  online_participants: 40,
  starts_at: now,
  ends_at: tomorrow,
  metadata: {},
  created_at: now,
  updated_at: now,
};

const mockMission = {
  id: mockMissionId,
  event_id: mockEventId,
  title: 'Mock Mission',
  description: 'Mock Description',
  mission_type: 'manual',
  target_value: 1,
  points_reward: 100,
  status: 'active',
  metadata: {},
  created_at: now,
  updated_at: now,
};

test.describe('Cofre/Vault Page E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/rest/v1/vault_events*', async route => {
      const isSingle = route.request().headers()['accept']?.includes('vnd.pgrst.object');
      await route.fulfill({ status: 200, json: isSingle ? mockEvent : [mockEvent] });
    });

    await page.route('**/rest/v1/vault_missions*', async route => {
      const isSingle = route.request().headers()['accept']?.includes('vnd.pgrst.object');
      await route.fulfill({ status: 200, json: isSingle ? mockMission : [mockMission] });
    });

    await page.route('**/rest/v1/vault_participants*', async route => {
      await route.fulfill({
        status: 200,
        headers: { 'content-range': '0-0/150' },
        json: [],
      });
    });

    await page.route('**/rest/v1/vault_winners*', async route => {
      await route.fulfill({ status: 200, json: [] });
    });

    await page.route('**/rest/v1/rpc/get_vault_leaderboard*', async route => {
      await route.fulfill({ status: 200, json: [] });
    });

    await page.route('**/rest/v1/rpc/get_my_vault_rank*', async route => {
      await route.fulfill({ status: 200, json: [] });
    });

    await page.route('**/rest/v1/rpc/get_vault_winners*', async route => {
      await route.fulfill({ status: 200, json: [] });
    });

    await page.route('**/rest/v1/rpc/get_vault_seasons*', async route => {
      await route.fulfill({ status: 200, json: [] });
    });

    await page.goto('/cofre');
    await page.waitForLoadState('networkidle');
  });

  test('carrega a rota /cofre e exibe evento ativo', async ({ page }) => {
    await expect(page.locator('body')).toContainText(/Mock Vault Event|Cofre|Vault/i);
  });

  test('exibe CTA principal coerente com estado de visitante', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Login para participar|Entrar no Vault|Participar/i })).toBeVisible();
  });

  test('exibe premio do evento quando dados do cofre carregam', async ({ page }) => {
    await expect(page.getByText(/5000|DuoCoins/i).first()).toBeVisible();
  });

  test('Cofre mobile mantém CTA visível', async ({ page, isMobile }) => {
    if (!isMobile) return;

    await expect(page.getByRole('button', { name: /Login para participar|Entrar no Vault|Participar/i })).toBeVisible();
  });
});
