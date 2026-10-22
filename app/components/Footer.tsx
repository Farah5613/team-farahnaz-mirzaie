import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6 mt-12">
      <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        {/* کپی‌رایت */}
        <div>© {new Date().getFullYear()} گالری خودرو. تمامی حقوق محفوظ است.</div>

        {/* لینک‌ها */}
        <div className="flex items-center gap-6">
          <Link href="/about" className="hover:text-blue-600 transition-colors hover:no-underline">
            درباره ما
          </Link>
          <Link
            href="/contact"
            className="hover:text-blue-600 transition-colors hover:no-underline"
          >
            تماس با ما
          </Link>
          <Link
            href="/privacy"
            className="hover:text-blue-600 transition-colors hover:no-underline"
          >
            قوانین و مقررات
          </Link>
        </div>
      </div>
    </footer>
  );
}
