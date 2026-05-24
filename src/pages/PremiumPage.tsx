import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { mockPremiumPlans } from '@/data/mocks/premiumPlans.mock';
import { PremiumPlan } from '@/schemas/premiumPlan.schema';
import { PremiumTemplate } from '@/templates/PremiumTemplate';

export default function PremiumPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [plans, setPlans] = useState<PremiumPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isPremiumLocked] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setPlans(mockPremiumPlans);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = async (planId: string) => {
    const selectedPlan = plans.find((plan) => plan.id === planId);

    if (!session) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (selectedPlan && selectedPlan.price > 0) {
      setActionMessage('Checkout de pagamento ainda não está integrado. Plano não ativado.');
      return;
    }

    setIsProcessing(true);
    setActionMessage(null);
    await new Promise(r => setTimeout(r, 300));
    setActivePlanId(planId);
    setIsProcessing(false);
  };

  return (
    <PremiumTemplate
      plans={plans}
      isLoading={isLoading}
      isError={isError}
      isPremiumLocked={isPremiumLocked}
      activePlanId={activePlanId}
      isProcessing={isProcessing}
      actionMessage={actionMessage}
      onSelectPlan={handleSelectPlan}
    />
  );
}
