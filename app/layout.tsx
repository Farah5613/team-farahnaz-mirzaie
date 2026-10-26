import type { Metadata } from 'next';
import { Vazirmatn, Inter } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

// فونت فارسی (وزیرمتن)
const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazirmatn',
  display: 'swap',
});

// فونت انگلیسی (اینتر)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'گالری خودروهای لوکس',
  description: 'پروژه تمرینی با Next.js و Shadcn UI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // هر دو کلاس فونت رو به تگ html می‌دیم
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} ${inter.variable}`}>
      <body className="antialiased flex flex-col min-h-screen">
        <Header />
        <main className="grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
