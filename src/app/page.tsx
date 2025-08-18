import { HeroSection } from '@/components/sections/HeroSection';
import { ImageSlider } from '@/components/sections/ImageSlider';
import { LineReservation } from '@/components/sections/LineReservation';
import { ScheduleSection } from '@/components/sections/ScheduleSection';
import { InfoSection } from '@/components/sections/InfoSection';
import { ImportantNoticeSection } from '@/components/sections/ImportantNoticeSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { AccessSection } from '@/components/sections/AccessSection';
import { RegulationsSection } from '@/components/sections/RegulationsSection';
import { InstagramBanner } from '@/components/sections/InstagramBanner';
import { LazySection } from '@/components/ui/LazySection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <LazySection>
        <ImageSlider />
      </LazySection>
      <LazySection>
        <LineReservation />
      </LazySection>
      <LazySection>
        <ScheduleSection />
      </LazySection>
      <LazySection>
        <InfoSection />
      </LazySection>
      <LazySection>
        <ImportantNoticeSection />
      </LazySection>
      <LazySection>
        <TestimonialsSection />
      </LazySection>
      <LazySection>
        <FAQSection />
      </LazySection>
      <LazySection>
        <AccessSection />
      </LazySection>
      <LazySection>
        <RegulationsSection />
      </LazySection>
      <LazySection>
        <InstagramBanner />
      </LazySection>
    </main>
  );
}