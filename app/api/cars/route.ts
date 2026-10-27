import { NextResponse } from 'next/server';
import { cars_db, couchReady } from '../../lib/couchdb';

type Car = {
  _id?: string;
  _rev?: string;
  title: string;
  description: string;
  image: string;
};

type CouchDocument = Car | null;

export async function GET(request: Request) {
  try {
    await couchReady;

    // ۱. خواندن شماره صفحه و تعداد از آدرس (URL)
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '15', 10);
    const skip = (page - 1) * limit;

    // ۲. گرفتن همه اطلاعات از دیتابیس
    const result = await cars_db.list({ include_docs: true });

    // ۳. فیلتر کردن داکیومنت‌های اضافی (مثل design doc) و تبدیل به تایپ Car
    const allCars = result.rows
      .map((row) => row.doc as CouchDocument)
      .filter((doc): doc is Car => doc !== null);

    // ۴. برش دادن لیست (فقط ماشین‌های مربوط به این صفحه)
    const totalCars = allCars.length;
    const paginatedCars = allCars.slice(skip, skip + limit);

    // ۵. برگرداندن جواب به همراه تعداد کل صفحات
    return NextResponse.json({
      cars: paginatedCars,
      totalPages: Math.ceil(totalCars / limit),
      currentPage: page,
      totalCars,
    });
  } catch (error) {
    console.error('GET /api/cars error:', error);
    return NextResponse.json({ error: 'Failed to load cars data' }, { status: 500 });
  }
}

// 3. ویرایش ماشین (Update)
export async function PUT(request: Request) {
  try {
    await couchReady;

    const body = (await request.json()) as Car;

    if (!body._id || !body._rev) {
      return NextResponse.json(
        {
          error: '_id and _rev are required',
        },
        { status: 400 },
      );
    }

    const response = await cars_db.insert(body);

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error('PUT /api/cars error:', error);

    return NextResponse.json(
      {
        error: 'Failed to update car',
      },
      { status: 500 },
    );
  }
}

// 4. حذف ماشین (Delete)
export async function DELETE(request: Request) {
  try {
    await couchReady;

    const { searchParams } = new URL(request.url);

    const id = searchParams.get('id');
    const rev = searchParams.get('rev');

    if (!id || !rev) {
      return NextResponse.json(
        {
          error: 'ID and Rev are required',
        },
        { status: 400 },
      );
    }

    const response = await cars_db.destroy(id, rev);

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error('DELETE /api/cars error:', error);

    return NextResponse.json(
      {
        error: 'Failed to delete car',
      },
      { status: 500 },
    );
  }
}
