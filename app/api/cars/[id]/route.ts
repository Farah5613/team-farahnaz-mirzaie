import { NextResponse } from 'next/server';
import nano from 'nano';

const couchUrl = process.env.COUCHDB_URL || 'http://admin:secret123@127.0.0.1:5984';
// رفع خطای ۵: حذف as any
const couch = nano(couchUrl);
const db = couch.use('cars_db');

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const doc = await db.get(resolvedParams.id);
    return NextResponse.json(doc);
  } catch (error: unknown) {
    // رفع خطای ۱۳: تغییر any به unknown
    const message = error instanceof Error ? error.message : 'Not Found';
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const carId = resolvedParams.id;

    // رفع خطای ۱۹: تایپ دادن به بدنه درخواست
    const body = (await request.json()) as Record<string, unknown>;

    try {
      const existingDoc = await db.get(carId);
      const updatedDoc = {
        ...existingDoc,
        ...body,
        _id: existingDoc._id,
        _rev: existingDoc._rev,
      };

      const response = await db.insert(updatedDoc);
      return NextResponse.json(response);
    } catch {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
  } catch (error: unknown) {
    // رفع خطای ۲۴
    const message = error instanceof Error ? error.message : 'Failed to update';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const carId = resolvedParams.id;

    const doc = await db.get(carId);
    const response = await db.destroy(doc._id, doc._rev as string);

    return NextResponse.json(response);
  } catch (error: unknown) {
    // رفع خطاهای ۳۲، ۴۷ و ۵۰
    const message = error instanceof Error ? error.message : 'Failed to delete';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
