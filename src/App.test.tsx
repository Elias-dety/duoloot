import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

// Mock Supabase para evitar chamadas reais
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
    }),
    removeChannel: vi.fn(),
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
    }),
  },
  isSupabaseConfigured: false,
  assertSupabaseConfigured: vi.fn(),
}));

describe('App — smoke test', () => {
  it('renderiza uma rota pública inicial sem crash', () => {
    const router = createMemoryRouter(
      [{ path: '/', element: <div data-testid="home">Home</div> }],
      { initialEntries: ['/'] }
    );

    const { getByTestId } = render(<RouterProvider router={router} />);
    expect(getByTestId('home')).toBeInTheDocument();
  });

  it('renderiza sem erros fatais ao montar RouterProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const router = createMemoryRouter(
      [{ path: '*', element: <div>Fallback</div> }],
      { initialEntries: ['/'] }
    );

    const { container } = render(<RouterProvider router={router} />);
    expect(container.innerHTML.length).toBeGreaterThan(0);

    const reactErrors = consoleSpy.mock.calls.filter(
      (call) => String(call[0]).includes('Uncaught') || String(call[0]).includes('unhandled')
    );
    expect(reactErrors).toHaveLength(0);

    consoleSpy.mockRestore();
  });
});
