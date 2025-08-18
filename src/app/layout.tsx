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
  title: "鳥取・琴浦町 白いか釣り船明勝丸 | 日本海遊漁船・夜釣り専門",
  description: "鳥取県琴浦町赤碕港の白いか釣り専門船「明勝丸」。日本海で夜釣り・イカメタル体験。関西・中国地方から好アクセス。初心者歓迎、竿レンタル完備。船長歴30年のベテランが案内する本格白いか釣り。大阪・広島・岡山から多数来船。予約受付中。",
  keywords: "鳥取 釣り船, 日本海 白いか釣り, 赤碕港 遊漁船, 琴浦町 釣り, 白いか 釣り, イカメタル, 夜釣り, 遊漁船, 鳥取県 白いか, 山陰 釣り船, 日本海 遊漁船, 白いか 夜釣り, イカメタル 鳥取, 明勝丸, 白いか専門船, 鳥取 夜釣り, 琴浦 釣り船, 赤碕 遊漁船, 日本海 イカ釣り, 白いか船, 鳥取県 遊漁, 山陰 白いか, 関西 釣りツアー, 大阪 釣り船, 広島 釣り船, 岡山 釣り船, 白イカ釣り, シロイカ, スルメイカ, 船釣り, 釣り体験, 釣果",
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
    title: "鳥取・琴浦町 白いか釣り船明勝丸 | 日本海遊漁船・夜釣り専門",
    description: "鳥取県琴浦町赤碕港の白いか釣り専門船「明勝丸」。日本海で夜釣り・イカメタル体験。関西・中国地方から好アクセス。初心者歓迎、竿レンタル完備。船長歴30年のベテランが案内する本格白いか釣り。",
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
    title: "鳥取・琴浦町 白いか釣り船明勝丸 | 日本海遊漁船・夜釣り専門",
    description: "鳥取県琴浦町赤碕港の白いか釣り専門船。日本海で夜釣り・イカメタル体験。関西・中国地方から好アクセス。初心者歓迎、竿レンタル完備。",
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
              "description": "関西・中国地方から多数来船する鳥取県琴浦町赤碕港の白イカ釣り専門遊漁船。大阪・名古屋・広島・岡山から好アクセス。",
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
