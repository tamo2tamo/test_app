import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";

import { Providers } from "@/components/providers";
import "./globals.css";

const notoSans = Noto_Sans_JP({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "NISA運用者の投稿サイト",
  description: "属性 × 配分 × 成績(%) で近い運用者を探せる匿名投稿サイト",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className={notoSans.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
