import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';
import { Phone, Mail, MapPin, Anchor } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            {/* ロゴ */}
            <div className="mb-4">
              <img 
                src="/images/logo.png" 
                alt="明勝丸ロゴ" 
                className="h-12 w-12 object-contain"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5)) drop-shadow(0 0 16px rgba(255,255,255,0.3))'
                }}
              />
              <Anchor className="h-12 w-12 text-white hidden" />
            </div>
            <p className="text-gray-400">
              鳥取県の白いか遊漁船
              <br />
              初心者からベテランまで
              <br />
              安心してお楽しみいただけます
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">メニュー</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#schedule" className="text-gray-400 hover:text-white transition-colors">
                  運航スケジュール
                </Link>
              </li>
              <li>
                <Link href="/#info" className="text-gray-400 hover:text-white transition-colors">
                  料金・設備
                </Link>
              </li>
              <li>
                <Link href="/#access" className="text-gray-400 hover:text-white transition-colors">
                  アクセス
                </Link>
              </li>
              <li>
                <Link href="/reservation" className="text-gray-400 hover:text-white transition-colors">
                  ご予約
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">お問い合わせ</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 mt-0.5 text-accent" />
                <div>
                  <a href={`tel:${SITE_CONFIG.contact.phone}`} className="text-gray-400 hover:text-white transition-colors">
                    {SITE_CONFIG.contact.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 mt-0.5 text-accent" />
                <div>
                  <a href={`mailto:${SITE_CONFIG.contact.email}`} className="text-gray-400 hover:text-white transition-colors">
                    {SITE_CONFIG.contact.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-0.5 text-accent" />
                <div className="text-gray-400">
                  {SITE_CONFIG.contact.address}
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">運航時間</h4>
            <ul className="space-y-2 text-gray-400">
              <li>1便: 17:30過ぎ～23:30頃</li>
              <li>2便: 24:00頃～5:30頃</li>
              <li className="pt-2">
                <span className="text-accent">※</span> 季節、天候により変更になる場合があります
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2025 明勝丸. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}