import { Button } from '@/components/atoms';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full pt-12 pb-16 md:pt-24 md:pb-24 flex flex-col items-center justify-center text-center px-4 md:px-0">
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-content-primary tracking-tight mb-6 uppercase drop-shadow-sm leading-tight">
        O Loot Que Faltava <br className="hidden md:block" />
        <span className="text-brand-primary">Para o Seu Duo</span>
      </h1>
      
      <p className="text-lg md:text-xl text-content-secondary max-w-2xl mb-10">
        Encontre parceiros toxic-free, feche seu squad perfeito usando nosso trust score, e concorra a prêmios em dinheiro nos cofres semanais.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Button 
          variant="primary" 
          size="lg" 
          className="w-full sm:w-auto text-base font-bold uppercase tracking-wider py-4 px-8 shadow-[0_0_20px_rgba(255,70,85,0.3)]"
          onClick={() => navigate(ROUTES.VAULT)}
        >
          Destravar o Cofre
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full sm:w-auto text-base font-bold uppercase tracking-wider py-4 px-8 bg-surface-dark border-surface-highlight hover:border-brand-primary/50 transition-colors"
          onClick={() => navigate(ROUTES.LOBBY)}
        >
          Encontrar Duo
        </Button>
      </div>
    </section>
  );
};
