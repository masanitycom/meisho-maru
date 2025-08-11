import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-sans",
});

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "明勝丸 | 鳥取県琴浦町の白イカ釣り遊漁船 - 赤碕港発",
  description: "鳥取県琴浦町赤碕港から出港する白イカ釣り専門の遊漁船「明勝丸」。日本海の絶好の漁場で白イカ釣りを体験。初心者歓迎、釣具レンタルあり。オンライン予約可能。",
  keywords: "明勝丸, 鳥取, イカ釣り, 遊漁船, 白イカ, 白いか, 琴浦町, 琴浦, 赤碕港, 日本海, 釣り船, 釣り体験, 鳥取県, 山陰, 遊漁, 釣果, シロイカ, スルメイカ, 夜釣り, 船釣り",
  authors: [{ name: "明勝丸" }],
  creator: "明勝丸",
  publisher: "明勝丸",
  formatDetection: {
    telephone: true,
    date: false,
    address: true,
    email: true,
  },
  metadataBase: new URL("https://meisho-maru.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "明勝丸 | 鳥取県琴浦町の白イカ釣り遊漁船",
    description: "鳥取県琴浦町赤碕港発の白イカ釣り専門遊漁船。日本海の豊かな漁場で最高の釣り体験を。初心者歓迎、道具レンタル可。",
    url: "https://meisho-maru.com",
    siteName: "明勝丸 - 鳥取県琴浦町の遊漁船",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "明勝丸 - 鳥取県琴浦町の白イカ釣り遊漁船",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "明勝丸 | 鳥取県琴浦町の白イカ釣り遊漁船",
    description: "鳥取県琴浦町赤碕港から出港。白イカ釣り体験なら明勝丸へ。",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/images/logo.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1e3a8a" />
        <meta name="geo.region" content="JP-31" />
        <meta name="geo.placename" content="琴浦町" />
        <meta name="geo.position" content="35.5002;133.6833" />
        <meta name="ICBM" content="35.5002, 133.6833" />
      </head>
      <body className={`${notoSansJP.variable} ${notoSerifJP.variable} ${notoSansJP.className} antialiased`}>
        <Header />
        {children}
        <Footer />
        
        {/* 構造化データ（JSON-LD） */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://meisho-maru.com",
              "name": "明勝丸",
              "alternateName": "めいしょうまる",
              "description": "鳥取県琴浦町赤碕港を拠点とする白イカ釣り専門の遊漁船",
              "url": "https://meisho-maru.com",
              "telephone": "090-1234-5678",
              "priceRange": "¥¥",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "大字別所１１２８番地",
                "addressLocality": "琴浦町",
                "addressRegion": "鳥取県",
                "postalCode": "689-2501",
                "addressCountry": "JP"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 35.5002,
                "longitude": 133.6833
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday"
                  ],
                  "opens": "17:30",
                  "closes": "05:30"
                }
              ],
              "keywords": "鳥取 イカ釣り, 白イカ釣り, 遊漁船, 琴浦町 釣り船, 赤碕港, 日本海 釣り, 鳥取県 遊漁",
              "sameAs": [
                "https://www.instagram.com/meisho_maru",
                "https://line.me/ti/p/@meisho_maru"
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
