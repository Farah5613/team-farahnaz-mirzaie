'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 max-w-7xl">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-blue-600">🚗 Laleh Cars</span>
        </div>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-blue-600 hover:no-underline">
            Home
          </Link>
          <Link href="/cars" className="transition-colors hover:text-blue-600 hover:no-underline">
            Cars
          </Link>
          <Link href="/about" className="transition-colors hover:text-blue-600 hover:no-underline">
            About Us
          </Link>
        </nav>

        {/* Login Button */}
        <div className="flex items-center gap-4">
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
            Login / Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
}
