import { useEffect, useState } from 'react';
import { mockPremiumPlans } from '@/data/mocks/premiumPlans.mock';
import { PremiumPlan } from '@/schemas/premiumPlan.schema';
import { PremiumTemplate } from '@/templates/PremiumTemplate';

export default function PremiumPage() {
  const [plans, setPlans] = useState<PremiumPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isPremiumLocked] = useState(false);

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

  return (
    <PremiumTemplate
      plans={plans}
      isLoading={isLoading}
      isError={isError}
      isPremiumLocked={isPremiumLocked}
    />
  );
}
