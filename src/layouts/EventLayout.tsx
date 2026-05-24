import { Outlet, Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { Badge, Button, Logo } from '@/components/atoms';;

export default function EventLayout() {
  return (
    <div className="dl-grid-bg flex min-h-screen flex-col bg-[var(--dl-black)]">
      <header className="sticky top-0 z-20 border-b border-[var(--dl-border)] bg-[rgba(8,10,14,0.9)] backdrop-blur-[14px]">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-3 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex min-w-0 items-center gap-3 md:gap-4">
            <Button variant="secondary" size="sm" onClick={() => window.history.back()}>
              Voltar
            </Button>
            <Link to={ROUTES.HOME} className="dl-brand min-w-0">
              <Logo compact subtitle="Vault" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="accent">Evento ativo</Badge>
            <Badge>Vault online</Badge>
          </div>
        </div>
      </header>

      <main className="relative flex-1">
        <div className="relative z-[1] mx-auto max-w-[1240px] px-3 py-6 md:px-6 md:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
