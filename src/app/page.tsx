import { HeroSection } from '@/components/sections/HeroSection';
import { ImageSlider } from '@/components/sections/ImageSlider';
import { LineReservation } from '@/components/sections/LineReservation';
import { ScheduleSection } from '@/components/sections/ScheduleSection';
import { InfoSection } from '@/components/sections/InfoSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { AccessSection } from '@/components/sections/AccessSection';
import { InstagramBanner } from '@/components/sections/InstagramBanner';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ImageSlider />
      <LineReservation />
      <ScheduleSection />
      <InfoSection />
      <TestimonialsSection />
      <AccessSection />
      <InstagramBanner />
    </main>
  );
}