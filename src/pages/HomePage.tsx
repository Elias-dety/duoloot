import { HeroSearchSection } from './HomePage/components/HeroSearchSection';
import { LobbyPreviewSection } from './HomePage/components/LobbyPreviewSection';
import { FreeTournamentsSection } from './HomePage/components/FreeTournamentsSection';
import { CoachesSection } from './HomePage/components/CoachesSection';

export default function HomePage() {
  return (
    <div className="flex w-full flex-col">
      <HeroSearchSection />
      <LobbyPreviewSection />
      <FreeTournamentsSection />
      <CoachesSection />
    </div>
  );
}
