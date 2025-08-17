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
  title: "明勝丸 | 山陰・日本海・鳥取の白いか釣り遊漁船",
  description: "山陰・日本海のイカメタル・白いか遊漁なら明勝丸。鳥取県琴浦町赤碕港から出港する白いか釣り専門の遊漁船で、山陰地方の日本海でイカメタル・白いか遊漁をお探しの方に最適。琴浦・赤碕・鳥取で白いか釣り体験を。初心者歓迎、釣具レンタルあり。",
  keywords: "山陰 白いか 遊漁, 日本海 白いか 遊漁, イカメタル, イカメタル 山陰, イカメタル 日本海, イカメタル 鳥取, イカメタル 琴浦, イカメタル 赤碕, 山陰 白いか, 日本海 白いか, 山陰 遊漁船, 日本海 遊漁船, 山陰 釣り船, 日本海 釣り船, 明勝丸, 鳥取 白いか 遊漁, 琴浦 白いか 遊漁, 赤碕 白いか 遊漁, 鳥取 白いか, 琴浦 白いか, 赤碕 白いか, 鳥取 遊漁船, 琴浦 遊漁船, 赤碕 遊漁船, 鳥取県 白いか釣り, 琴浦町 白いか釣り, 赤碕港 白いか釣り, 白イカ, 白いか, 琴浦町, 琴浦, 赤碕港, 赤碕, 日本海, 釣り船, 釣り体験, 鳥取県, 鳥取, 山陰, 遊漁, 釣果, シロイカ, スルメイカ, 夜釣り, 船釣り",
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
    title: "明勝丸 | 山陰・日本海・鳥取の白いか釣り遊漁船",
    description: "山陰・日本海のイカメタル・白いか遊漁なら明勝丸。鳥取県琴浦町赤碕港発の白いか釣り専門遊漁船。山陰地方の日本海でイカメタル・白いか遊漁をお探しの方へ。日本海の豊かな漁場で最高の釣り体験を。初心者歓迎、道具レンタル可。",
    url: "https://meisho-maru.com",
    siteName: "明勝丸 - 鳥取県琴浦町の遊漁船",
    images: [
      {
        url: "/images/logo.png",
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
    title: "明勝丸 | 山陰・日本海・鳥取の白いか釣り遊漁船",
    description: "山陰・日本海のイカメタル・白いか遊漁なら明勝丸。鳥取県琴浦町赤碕港から出港。",
    images: ["/images/logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/images/logo.png", type: "image/png", sizes: "192x192" }
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png", sizes: "180x180" },
      { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }
    ],
    shortcut: "/favicon.ico",
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
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/images/logo.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e3a8a" />
        <meta name="msapplication-TileColor" content="#1e3a8a" />
        <meta name="msapplication-TileImage" content="/images/logo.png" />
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
              "telephone": "090-4695-3087",
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
              "keywords": "イカメタル, イカメタル 山陰, イカメタル 日本海, イカメタル 鳥取, イカメタル 琴浦, イカメタル 赤碕, 山陰 白いか 遊漁, 日本海 白いか 遊漁, 山陰 白いか, 日本海 白いか, 山陰 遊漁船, 日本海 遊漁船, 山陰 釣り船, 日本海 釣り船, 鳥取 白いか 遊漁, 琴浦 白いか 遊漁, 赤碕 白いか 遊漁, 鳥取 白いか, 琴浦 白いか, 赤碕 白いか, 鳥取 遊漁船, 琴浦 遊漁船, 赤碕 遊漁船, 鳥取 イカ釣り, 白イカ釣り, 遊漁船, 琴浦町 釣り船, 赤碕港, 日本海 釣り, 鳥取県 遊漁",
              "sameAs": [
                "https://www.instagram.com/meisho_maru",
                "https://lin.ee/HQX3Ezq"
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
