'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, Phone } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export function HeroSection() {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/90 to-blue-800/90 z-10" />
      
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1553155198-b24e1c3a70d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
        }}
      />

      <div className="container mx-auto px-4 relative z-20 text-white text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          鳥取の海で
          <br />
          <span className="text-accent">白いか釣り</span>を体験
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          初心者からベテランまで安心して楽しめる
          <br />
          白いか遊漁船「明勝丸」
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-accent hover:bg-accent/90" asChild>
            <Link href="/reservation">
              <Calendar className="mr-2 h-5 w-5" />
              今すぐ予約する
            </Link>
          </Button>
          
          <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
            <a href={`tel:${SITE_CONFIG.contact.phone}`}>
              <Phone className="mr-2 h-5 w-5" />
              電話で問い合わせ
            </a>
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-2">午前便</h3>
            <p className="text-lg">6:00 〜 12:00</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-2">午後便</h3>
            <p className="text-lg">13:00 〜 19:00</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-2">料金</h3>
            <p className="text-lg">¥10,000〜</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-20" />
    </section>
  );
}