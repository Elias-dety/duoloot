import { useState, useEffect } from 'react';
import { HomeTemplate } from '@/templates/HomeTemplate';
import { mockEvents } from '@/data/mocks/events.mock';
import type { Event } from '@/schemas/event.schema';
import type { Winner } from '@/components/organisms/WinnersList';

// Mock temporary para os vencedores na Home
const mockWinners: Winner[] = [
  { id: '1', username: 'FalleN', prizeWon: '500 DuoCoins', date: 'Há 5 min' },
  { id: '2', username: 'Sacy', prizeWon: '200 DuoCoins', date: 'Há 12 min' },
  { id: '3', username: 'Aspas', prizeWon: '100 DuoCoins', date: 'Há 1 hora' },
];

export default function HomePage() {
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Use first mock event
        setActiveEvent(mockEvents[0]);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <HomeTemplate 
      activeEvent={activeEvent}
      recentWinners={mockWinners}
      isLoading={isLoading}
      isError={isError}
    />
  );
}
