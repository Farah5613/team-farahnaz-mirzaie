import type { Metadata } from 'next';
import { Vazirmatn, Inter } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

// Persian Font (Vazirmatn)
const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazirmatn',
  display: 'swap',
});

// English Font (Inter)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Luxury Car Gallery',
  description: 'A practice project built with Next.js and Shadcn UI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // We add both font classes to the html tag
    <html lang="en" dir="ltr" className={`${vazirmatn.variable} ${inter.variable}`}>
      <body className="antialiased flex flex-col min-h-screen">
        <Header />
        <main className="grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
