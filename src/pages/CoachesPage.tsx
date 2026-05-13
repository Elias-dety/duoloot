import React, { useState, useEffect } from 'react';
import { CoachesTemplate } from '@/templates/CoachesTemplate';
import { mockCoaches } from '@/data/mocks/coaches.mock';
import { Coach } from '@/schemas/coach.schema';

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulação de delay
    const fetchCoaches = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      setCoaches(mockCoaches);
      setIsLoading(false);
    };

    fetchCoaches();
  }, []);

  return <CoachesTemplate coaches={coaches} isLoading={isLoading} />;
}
