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
  title: "明勝丸 - 鳥取県の白いか遊漁船",
  description: "鳥取県の白いか遊漁船「明勝丸」。初心者からベテランまで安心して楽しめる白いか釣り体験をご提供します。",
  keywords: "白いか釣り, 遊漁船, 鳥取県, 明勝丸, 釣り体験, 日本海",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} ${notoSerifJP.variable} ${notoSansJP.className} antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
