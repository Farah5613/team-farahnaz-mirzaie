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

export async function GET() {
  try {
    await couchReady;

    const result = await cars_db.list({
      include_docs: true,
    });

    const cars = result.rows
      .map((row) => row.doc as CouchDocument)
      .filter((doc): doc is Car => doc !== null);

    return NextResponse.json(cars);
  } catch (error) {
    console.error('GET /api/cars error:', error);

    return NextResponse.json(
      {
        error: 'Failed to load cars data',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await couchReady;

    const body = (await request.json()) as Car;

    const response = await cars_db.insert(body);

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error('POST /api/cars error:', error);

    return NextResponse.json(
      {
        error: 'Failed to create car',
      },
      { status: 500 },
    );
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
