import { HeroSection } from './HomePage/components/HeroSection';
import { FeaturesSection } from './HomePage/components/FeaturesSection';
import { SocialProofSection } from './HomePage/components/SocialProofSection';
import { HomeCallToAction } from './HomePage/components/HomeCallToAction';

export default function HomePage() {
  return (
    <div className="flex w-full flex-col">
      <HeroSection />

      {/* Gradient divider */}
      <div
        className="mx-auto h-px w-full max-w-6xl"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
        }}
      />

      <FeaturesSection />

      <div
        className="mx-auto h-px w-full max-w-6xl"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
        }}
      />

      <SocialProofSection />

      <HomeCallToAction />
    </div>
  );
}
