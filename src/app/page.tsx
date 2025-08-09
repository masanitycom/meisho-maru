import { HeroSection } from '@/components/sections/HeroSection';
import { ScheduleSection } from '@/components/sections/ScheduleSection';
import { InfoSection } from '@/components/sections/InfoSection';
import { AccessSection } from '@/components/sections/AccessSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ScheduleSection />
      <InfoSection />
      <AccessSection />
    </main>
  );
}