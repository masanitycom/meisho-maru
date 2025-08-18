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
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "@id": "https://kotourameishomaru.com",
                "name": "明勝丸",
                "alternateName": "めいしょうまる",
                "description": "鳥取県琴浦町赤碕港の白いか釣り専門船。日本海で夜釣り・イカメタル体験。関西・中国地方から好アクセス。",
                "url": "https://kotourameishomaru.com",
                "telephone": "+81-90-4695-3087",
                "priceRange": "¥11,000-¥13,000",
                "image": [
                  "https://kotourameishomaru.com/images/logo.png",
                  "https://kotourameishomaru.com/images/slider/slide-1.jpg"
                ],
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
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                    "opens": "17:30",
                    "closes": "23:30",
                    "description": "1便運航"
                  },
                  {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                    "opens": "00:00",
                    "closes": "05:30",
                    "description": "2便運航"
                  }
                ],
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "5.0",
                  "reviewCount": "50",
                  "bestRating": "5",
                  "worstRating": "1"
                },
                "review": [
                  {
                    "@type": "Review",
                    "reviewRating": {
                      "@type": "Rating",
                      "ratingValue": "5",
                      "bestRating": "5"
                    },
                    "author": {
                      "@type": "Person",
                      "name": "田中様"
                    },
                    "reviewBody": "初めての白いか釣りでしたが、船長さんが丁寧に教えてくださり、たくさん釣ることができました。",
                    "datePublished": "2025-01-15"
                  },
                  {
                    "@type": "Review",
                    "reviewRating": {
                      "@type": "Rating",
                      "ratingValue": "5",
                      "bestRating": "5"
                    },
                    "author": {
                      "@type": "Person",
                      "name": "山田様"
                    },
                    "reviewBody": "設備も整っていて、白いかの釣果も素晴らしかったです。また利用したいと思います。",
                    "datePublished": "2025-01-10"
                  },
                  {
                    "@type": "Review",
                    "reviewRating": {
                      "@type": "Rating",
                      "ratingValue": "5",
                      "bestRating": "5"
                    },
                    "author": {
                      "@type": "Person",
                      "name": "佐藤様"
                    },
                    "reviewBody": "船長さんの指導が分かりやすく、初心者でも楽しめました。夜釣りの雰囲気も最高でした。",
                    "datePublished": "2025-01-05"
                  }
                ],
                "hasOfferCatalog": {
                  "@type": "OfferCatalog",
                  "name": "釣りプラン",
                  "itemListElement": [
                    {
                      "@type": "Offer",
                      "name": "白いか釣り体験（1便）",
                      "description": "夕方便：17:30過ぎ～23:30頃",
                      "price": "11000",
                      "priceCurrency": "JPY",
                      "availability": "https://schema.org/InStock",
                      "category": "夜釣り・遊漁船"
                    },
                    {
                      "@type": "Offer",
                      "name": "白いか釣り体験（2便）",
                      "description": "深夜便：24:00頃～5:30頃",
                      "price": "11000",
                      "priceCurrency": "JPY",
                      "availability": "https://schema.org/InStock",
                      "category": "夜釣り・遊漁船"
                    },
                    {
                      "@type": "Offer",
                      "name": "竿レンタル",
                      "description": "釣竿一式レンタル",
                      "price": "2000",
                      "priceCurrency": "JPY",
                      "availability": "https://schema.org/InStock",
                      "category": "レンタル用品"
                    }
                  ]
                },
                "amenityFeature": [
                  {
                    "@type": "LocationFeatureSpecification",
                    "name": "GPS魚群探知機",
                    "value": true
                  },
                  {
                    "@type": "LocationFeatureSpecification",
                    "name": "竿レンタル",
                    "value": true
                  },
                  {
                    "@type": "LocationFeatureSpecification",
                    "name": "初心者指導",
                    "value": true
                  },
                  {
                    "@type": "LocationFeatureSpecification",
                    "name": "夜間運航",
                    "value": true
                  }
                ],
                "knowsAbout": [
                  "白いか釣り",
                  "イカメタル",
                  "夜釣り",
                  "日本海釣り",
                  "遊漁船",
                  "鳥取県釣り",
                  "琴浦町"
                ],
                "sameAs": [
                  "https://www.instagram.com/meisho_maru",
                  "https://lin.ee/HQX3Ezq"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": "https://kotourameishomaru.com/#organization",
                "name": "明勝丸",
                "alternateName": "めいしょうまる",
                "legalName": "明勝丸",
                "url": "https://kotourameishomaru.com",
                "logo": "https://kotourameishomaru.com/images/logo.png",
                "image": "https://kotourameishomaru.com/images/logo.png",
                "description": "鳥取県琴浦町赤碕港の白いか釣り専門船。日本海で夜釣り・イカメタル体験。関西・中国地方から好アクセス。",
                "foundingDate": "2000",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+81-90-4695-3087",
                  "contactType": "customer service",
                  "availableLanguage": "ja"
                },
                "areaServed": {
                  "@type": "GeoCircle",
                  "geoMidpoint": {
                    "@type": "GeoCoordinates",
                    "latitude": 35.5002,
                    "longitude": 133.6833
                  },
                  "geoRadius": "50000"
                },
                "serviceArea": [
                  {
                    "@type": "AdministrativeArea",
                    "name": "鳥取県"
                  },
                  {
                    "@type": "AdministrativeArea", 
                    "name": "岡山県"
                  },
                  {
                    "@type": "AdministrativeArea",
                    "name": "兵庫県"
                  },
                  {
                    "@type": "AdministrativeArea",
                    "name": "広島県"
                  },
                  {
                    "@type": "AdministrativeArea",
                    "name": "大阪府"
                  }
                ],
                "sameAs": [
                  "https://www.instagram.com/meisho_maru",
                  "https://lin.ee/HQX3Ezq"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "初心者でも釣れますか？",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "初心者の方でも大丈夫です！船長が丁寧に釣り方をお教えします。"
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "料金はいくらですか？",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "乗船料は1名様11,000円（税込）です。竿レンタルをご希望の場合は、1本2,000円でご用意しております。"
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "キャンセル料はかかりますか？",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "キャンセルは3日前までにご連絡いただければキャンセル料はかかりません。天候による欠航の場合もキャンセル料は不要です。"
                    }
                  }
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "ホーム",
                    "item": "https://kotourameishomaru.com"
                  }
                ]
              }
            ])
          }}
        />
      </body>
    </html>
  );
}
