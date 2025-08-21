import { HeroSection } from '@/components/sections/HeroSection';
import { ImageSlider } from '@/components/sections/ImageSlider';
import { LineReservation } from '@/components/sections/LineReservation';
import { ScheduleSection } from '@/components/sections/ScheduleSection';
import { ScheduleSectionNew } from '@/components/sections/ScheduleSectionNew';
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
        <ScheduleSectionNew />
      </LazySection>
      {/* 旧カレンダー（比較用） */}
      <LazySection>
        <div className="bg-red-50 py-4">
          <div className="container mx-auto px-4">
            <h3 className="text-center text-lg font-bold text-red-600 mb-4">【比較用】旧カレンダー</h3>
          </div>
          <ScheduleSection />
        </div>
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