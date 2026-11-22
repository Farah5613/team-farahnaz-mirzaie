import { NextResponse } from 'next/server';
// 👇 مسیر couchdb دقیقاً به پوشه app/lib اشاره می‌کند
import { cars_db, couchReady } from '../../lib/couchdb';
import { Car, CouchDocument } from '@/lib/types'; // types و redis در روت هستند
import { redis } from '@/lib/redis';

// ==========================================
// ۱. دریافت لیست (Get)
// ==========================================
export async function GET(request: Request) {
  try {
    await couchReady;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const cacheKey = `cars:page:${page}:limit:${limit}`;

    // ۱. چک کردن کش
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log(`✅ [CACHE HIT] Data fetched from Redis for page ${page}`);
      return NextResponse.json(JSON.parse(cachedData));
    }

    console.log(`❌ [CACHE MISS] Reading from CouchDB for page ${page}...`);

    // دریافت داده از CouchDB
    const result = await cars_db.list({ include_docs: true });

    // 👇 حل مشکل خطای any به شکل کاملاً استاندارد TypeScript
    const allCars = result.rows
      .map((row) => {
        // به TypeScript میگیم که این آبجکت ممکنه یه فیلد doc داشته باشه
        const typedRow = row as { doc?: CouchDocument };
        return typedRow.doc;
      })
      .filter((doc): doc is Car => doc != null && doc !== undefined);

    const totalCars = allCars.length;
    const paginatedCars = allCars.slice(skip, skip + limit);

    const responseData = {
      cars: paginatedCars,
      totalPages: Math.ceil(totalCars / limit),
      currentPage: page,
      totalCars,
    };

    // ۲. ذخیره در Redis (۵ دقیقه)
    await redis.set(cacheKey, JSON.stringify(responseData), 'EX', 300);
    console.log(`💾 Data saved to Redis Cache for page ${page}`);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('GET /api/cars error:', error);
    return NextResponse.json({ error: 'Failed to load cars data' }, { status: 500 });
  }
}

// ... بقیه متدهای POST, PUT, DELETE دقیقاً همون‌طور که در پیام قبل بودند بمانند ...
// (برای اینکه پیام خیلی طولانی نشه، فقط GET رو کامل نوشتم. متدهای دیگه رو از پیام قبلی کپی کن)
// فقط یادت باشه در متدهای POST/PUT/DELETE هم از `import { redis } from '@/lib/redis'` استفاده کنی.
