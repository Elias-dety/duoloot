import { useEffect, useMemo, useState } from 'react';
import { mockCoaches } from '@/data/mocks/coaches.mock';
import { Coach } from '@/schemas/coach.schema';
import { CoachesTemplate } from '@/templates/CoachesTemplate';

type AvailabilityFilter = 'all' | 'available';

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [search, setSearch] = useState('');
  const [game, setGame] = useState('all');
  const [availability, setAvailability] = useState<AvailabilityFilter>('all');

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        await new Promise((resolve) => setTimeout(resolve, 450));
        setCoaches(mockCoaches);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  const filteredCoaches = useMemo(() => {
    return coaches.filter((coach) => {
      const matchesSearch =
        !search ||
        [coach.name, coach.game, coach.headline, ...coach.specialty, ...coach.focusAreas]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesGame = game === 'all' || coach.game === game;
      const matchesAvailability = availability === 'all' || coach.isAvailable;

      return matchesSearch && matchesGame && matchesAvailability;
    });
  }, [availability, coaches, game, search]);

  return (
    <CoachesTemplate
      coaches={coaches}
      filteredCoaches={filteredCoaches}
      search={search}
      game={game}
      availability={availability}
      isLoading={isLoading}
      isError={isError}
      onSearchChange={setSearch}
      onGameChange={setGame}
      onAvailabilityChange={setAvailability}
      onClearFilters={() => {
        setSearch('');
        setGame('all');
        setAvailability('all');
      }}
    />
  );
}
