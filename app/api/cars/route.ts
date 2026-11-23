import { NextResponse } from 'next/server';
import { cars_db, couchReady } from '../../lib/couchdb';
import { Car, CouchDocument } from '../../../lib/types';
import { redis } from '../../../lib/redis';

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

    const allCars = result.rows
      .map((row) => {
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

// ==========================================
// ۲. ثبت ماشین جدید (Post)
// ==========================================
export async function POST(request: Request) {
  try {
    await couchReady;
    const body = (await request.json()) as Car;

    const response = await cars_db.insert(body);

    const keys = await redis.keys('cars:page:*');
    if (keys.length > 0) await redis.del(...keys);

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error('POST /api/cars error:', error);
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
  }
}

// ==========================================
// ۳. ویرایش ماشین (Update)
// ==========================================
export async function PUT(request: Request) {
  try {
    await couchReady;
    const body = (await request.json()) as Car;

    if (!body._id || !body._rev) {
      return NextResponse.json({ error: '_id and _rev are required' }, { status: 400 });
    }

    const response = await cars_db.insert(body);

    const keys = await redis.keys('cars:page:*');
    if (keys.length > 0) await redis.del(...keys);

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error('PUT /api/cars error:', error);
    return NextResponse.json({ error: 'Failed to update car' }, { status: 500 });
  }
}

// ==========================================
// ۴. حذف ماشین (Delete)
// ==========================================
export async function DELETE(request: Request) {
  try {
    await couchReady;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const rev = searchParams.get('rev');

    if (!id || !rev) {
      return NextResponse.json({ error: 'ID and Rev are required' }, { status: 400 });
    }

    const response = await cars_db.destroy(id, rev);

    const keys = await redis.keys('cars:page:*');
    if (keys.length > 0) await redis.del(...keys);

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error('DELETE /api/cars error:', error);
    return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 });
  }
}
