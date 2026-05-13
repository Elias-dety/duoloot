import { Button } from '@/components/atoms';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full px-4 pb-14 pt-10 md:px-0 md:pb-18 md:pt-18">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="mb-5 rounded-full border border-brand-primary/25 bg-brand-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-wide text-brand-primary">
          lobby competitivo + cofre semanal
        </div>
        <h1 className="mb-5 text-4xl font-black uppercase leading-tight text-content-primary md:text-6xl">
          Duo Loot
        </h1>
        <p className="mb-8 max-w-2xl text-base leading-7 text-content-secondary md:text-lg">
          Monte duo por confiança, acompanhe compatibilidade antes de entrar e dispute recompensas nos cofres
          ativos da comunidade.
        </p>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button variant="primary" size="lg" fullWidth className="sm:w-auto" onClick={() => navigate(ROUTES.VAULT)}>
            Destravar o Cofre
          </Button>
          <Button variant="secondary" size="lg" fullWidth className="sm:w-auto" onClick={() => navigate(ROUTES.LOBBY)}>
            Encontrar Duo
          </Button>
        </div>
      </div>
    </section>
  );
};
