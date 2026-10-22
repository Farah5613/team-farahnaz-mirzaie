'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 max-w-7xl">
        {/* لوگو */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-blue-600">🚗 گالری خودرو</span>
        </div>

        {/* لینک‌ها */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-blue-600 hover:no-underline">
            خانه
          </Link>
          <Link href="/cars" className="transition-colors hover:text-blue-600 hover:no-underline">
            خودروها
          </Link>
          <Link href="/about" className="transition-colors hover:text-blue-600 hover:no-underline">
            درباره ما
          </Link>
        </nav>

        {/* دکمه ورود */}
        <div className="flex items-center gap-4">
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
            ورود / ثبت‌ نام
          </Button>
        </div>
      </div>
    </header>
  );
}
