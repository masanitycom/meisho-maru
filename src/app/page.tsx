import { HeroSection } from '@/components/sections/HeroSection';
import { ImageSlider } from '@/components/sections/ImageSlider';
import { InstagramBanner } from '@/components/sections/InstagramBanner';
import { ScheduleSection } from '@/components/sections/ScheduleSection';
import { InfoSection } from '@/components/sections/InfoSection';
import { AccessSection } from '@/components/sections/AccessSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ImageSlider />
      <ScheduleSection />
      <InfoSection />
      <AccessSection />
      <InstagramBanner />
    </main>
  );
}